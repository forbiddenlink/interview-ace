import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '../route';

// Mock the database functions
vi.mock('@/lib/db/questions', () => ({
  getQuestions: vi.fn(),
  createQuestion: vi.fn(),
}));

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => ({ value: 'mock-cookie' })),
  })),
}));

import { getQuestions, createQuestion } from '@/lib/db/questions';
import { createServerClient } from '@supabase/ssr';

const mockGetQuestions = vi.mocked(getQuestions);
const mockCreateQuestion = vi.mocked(createQuestion);
const mockCreateServerClient = vi.mocked(createServerClient);

describe('GET /api/questions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns questions successfully', async () => {
    const mockQuestions = [
      { id: '1', title: 'Question 1', type: 'conceptual' },
      { id: '2', title: 'Question 2', type: 'coding' },
    ];
    mockGetQuestions.mockResolvedValue(mockQuestions as any);

    const request = new NextRequest('http://localhost/api/questions');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.questions).toEqual(mockQuestions);
  });

  it('passes filter parameters to getQuestions', async () => {
    mockGetQuestions.mockResolvedValue([]);

    const request = new NextRequest(
      'http://localhost/api/questions?technologies=react,typescript&difficulty=intermediate&type=coding&search=hooks'
    );
    await GET(request);

    expect(mockGetQuestions).toHaveBeenCalledWith({
      technologies: ['react', 'typescript'],
      difficulty: 'intermediate',
      type: 'coding',
      search: 'hooks',
    });
  });

  it('handles empty filter parameters', async () => {
    mockGetQuestions.mockResolvedValue([]);

    const request = new NextRequest('http://localhost/api/questions');
    await GET(request);

    expect(mockGetQuestions).toHaveBeenCalledWith({
      technologies: undefined,
      difficulty: undefined,
      type: undefined,
      search: undefined,
    });
  });

  it('returns 500 on database error', async () => {
    mockGetQuestions.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/questions');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch questions');
  });
});

describe('POST /api/questions', () => {
  const validBody = {
    skill_id: '550e8400-e29b-41d4-a716-446655440000',
    type: 'conceptual',
    format: 'text',
    title: 'What is React?',
    prompt: 'Explain the key concepts of React and how it differs from vanilla JavaScript.',
    difficulty: 'beginner',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates question when authenticated', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockQuestion = { id: 'q-1', ...validBody };

    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as any);
    mockCreateQuestion.mockResolvedValue(mockQuestion as any);

    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.question).toEqual(mockQuestion);
    expect(mockCreateQuestion).toHaveBeenCalledWith(validBody);
  });

  it('returns 401 when not authenticated', async () => {
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as any);

    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
    expect(mockCreateQuestion).not.toHaveBeenCalled();
  });

  it('returns 401 on auth error', async () => {
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Auth failed') }),
      },
    } as any);

    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it('returns 400 for invalid request body', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as any);

    const invalidBody = { title: 'Missing required fields' };
    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(mockCreateQuestion).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid skill_id', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as any);

    const invalidBody = { ...validBody, skill_id: 'not-a-uuid' };
    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('skill_id');
  });

  it('returns 400 for invalid type enum', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as any);

    const invalidBody = { ...validBody, type: 'invalid_type' };
    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(invalidBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('type');
  });

  it('returns 500 on database error', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    } as any);
    mockCreateQuestion.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost/api/questions', {
      method: 'POST',
      body: JSON.stringify(validBody),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to create question');
  });
});
