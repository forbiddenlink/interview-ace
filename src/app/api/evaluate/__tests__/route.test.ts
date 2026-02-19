import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Use vi.hoisted to ensure mocks are available during hoisting
const { mockGetUser, mockFrom, mockOpenAICreate } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockOpenAICreate: vi.fn(),
}));

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => ({ value: 'mock-cookie' })),
  })),
}));

// Mock OpenAI
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: mockOpenAICreate,
      },
    };
  },
}));

// Import after mocks
import { POST } from '../route';
import { _resetRateLimitStore } from '@/lib/utils/rate-limit';

describe('POST /api/evaluate', () => {
  const validBody = {
    questionId: '550e8400-e29b-41d4-a716-446655440000',
    response: 'React is a JavaScript library for building user interfaces...',
    rubric: { accuracy: 1, clarity: 1, depth: 1 },
    type: 'conceptual',
  };

  const mockQuestion = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'What is React?',
    prompt: 'Explain the key concepts of React.',
    difficulty: 'beginner',
  };

  const mockEvaluationResponse = {
    score: 4.2,
    strengths: ['Good explanation', 'Clear examples'],
    improvements: ['Could mention hooks', 'More depth on virtual DOM'],
    feedback: 'Overall good response with clear understanding.',
    rubricScores: { accuracy: 4, clarity: 5, depth: 3 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    _resetRateLimitStore();
  });

  function setupAuthenticatedUser() {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@example.com' } },
      error: null,
    });
  }

  function setupQuestionQuery(question: typeof mockQuestion | null) {
    const mockSingle = vi.fn().mockResolvedValue({ data: question, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });
  }

  it('evaluates response successfully', async () => {
    setupAuthenticatedUser();
    setupQuestionQuery(mockQuestion);
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(mockEvaluationResponse) } }],
    });

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.evaluation).toBeDefined();
    expect(data.evaluation.score).toBe(mockEvaluationResponse.score);
    expect(data.evaluation.strengths).toEqual(mockEvaluationResponse.strengths);
  });

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 on auth error', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Auth failed'),
    });

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it('returns 400 for missing questionId', async () => {
    setupAuthenticatedUser();

    const invalidBody = { ...validBody, questionId: undefined };
    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('questionId');
  });

  it('returns 400 for invalid questionId format', async () => {
    setupAuthenticatedUser();

    const invalidBody = { ...validBody, questionId: 'not-a-uuid' };
    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('questionId');
  });

  it('returns 400 for empty response', async () => {
    setupAuthenticatedUser();

    const invalidBody = { ...validBody, response: '' };
    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('response');
  });

  it('returns 400 for missing rubric', async () => {
    setupAuthenticatedUser();

    const invalidBody = { ...validBody, rubric: undefined };
    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('rubric');
  });

  it('returns 400 for missing type', async () => {
    setupAuthenticatedUser();

    const invalidBody = { ...validBody, type: undefined };
    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('type');
  });

  it('returns 404 when question not found', async () => {
    setupAuthenticatedUser();
    setupQuestionQuery(null);

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Question not found');
  });

  it('validates response length', async () => {
    setupAuthenticatedUser();

    // Response over 50000 chars
    const tooLongResponse = 'x'.repeat(50001);
    const invalidBody = { ...validBody, response: tooLongResponse };
    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('response');
  });

  it('handles OpenAI errors gracefully', async () => {
    setupAuthenticatedUser();
    setupQuestionQuery(mockQuestion);
    mockOpenAICreate.mockRejectedValue(new Error('OpenAI API error'));

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to evaluate response');
  });

  it('handles malformed OpenAI response', async () => {
    setupAuthenticatedUser();
    setupQuestionQuery(mockQuestion);
    mockOpenAICreate.mockResolvedValue({
      choices: [{ message: { content: 'not valid json' } }],
    });

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    // Should return 500 because JSON.parse will fail
    expect(response.status).toBe(500);
  });

  it('rejects non-object body', async () => {
    setupAuthenticatedUser();

    const request = new NextRequest('http://localhost/api/evaluate', {
      method: 'POST',
      body: JSON.stringify('string body'),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
  });
});
