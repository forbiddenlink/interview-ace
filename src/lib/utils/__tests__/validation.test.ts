import { describe, it, expect } from 'vitest';
import {
  validateString,
  validateUUID,
  validateEnum,
  validateNumber,
  validateArray,
  validateEvaluateRequest,
  validateSaveResponseRequest,
  validateCreateQuestionRequest,
} from '../validation';

describe('validateString', () => {
  it('accepts valid strings', () => {
    const result = validateString('hello', 'test');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('hello');
    }
  });

  it('trims whitespace', () => {
    const result = validateString('  hello  ', 'test');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('hello');
    }
  });

  it('rejects non-strings', () => {
    expect(validateString(123, 'test').success).toBe(false);
    expect(validateString(null, 'test').success).toBe(false);
    expect(validateString(undefined, 'test').success).toBe(false);
    expect(validateString({}, 'test').success).toBe(false);
  });

  it('rejects empty strings', () => {
    const result = validateString('', 'test');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('cannot be empty');
    }
  });

  it('enforces minLength', () => {
    const result = validateString('ab', 'test', { minLength: 3 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('at least 3');
    }
  });

  it('enforces maxLength', () => {
    const result = validateString('abcdef', 'test', { maxLength: 3 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('at most 3');
    }
  });
});

describe('validateUUID', () => {
  it('accepts valid UUIDs', () => {
    const result = validateUUID('550e8400-e29b-41d4-a716-446655440000', 'test');
    expect(result.success).toBe(true);
  });

  it('accepts uppercase UUIDs', () => {
    const result = validateUUID('550E8400-E29B-41D4-A716-446655440000', 'test');
    expect(result.success).toBe(true);
  });

  it('rejects invalid UUIDs', () => {
    expect(validateUUID('not-a-uuid', 'test').success).toBe(false);
    expect(validateUUID('550e8400-e29b-41d4-a716', 'test').success).toBe(false);
    expect(validateUUID('550e8400e29b41d4a716446655440000', 'test').success).toBe(false);
  });
});

describe('validateEnum', () => {
  const allowed = ['apple', 'banana', 'cherry'] as const;

  it('accepts valid enum values', () => {
    const result = validateEnum('apple', 'fruit', allowed);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('apple');
    }
  });

  it('rejects invalid enum values', () => {
    const result = validateEnum('orange', 'fruit', allowed);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('must be one of');
    }
  });
});

describe('validateNumber', () => {
  it('accepts valid numbers', () => {
    const result = validateNumber(42, 'count');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it('accepts string numbers', () => {
    const result = validateNumber('42', 'count');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it('accepts decimals', () => {
    const result = validateNumber(3.14, 'pi');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(3.14);
    }
  });

  it('rejects non-numbers', () => {
    expect(validateNumber('abc', 'test').success).toBe(false);
    expect(validateNumber(NaN, 'test').success).toBe(false);
    expect(validateNumber(null, 'test').success).toBe(false);
  });

  it('enforces min', () => {
    const result = validateNumber(5, 'test', { min: 10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('at least 10');
    }
  });

  it('enforces max', () => {
    const result = validateNumber(15, 'test', { max: 10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('at most 10');
    }
  });
});

describe('validateArray', () => {
  it('accepts valid arrays', () => {
    const result = validateArray(
      ['a', 'b', 'c'],
      'items',
      (item) => validateString(item, 'item')
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(['a', 'b', 'c']);
    }
  });

  it('rejects non-arrays', () => {
    const result = validateArray('not array', 'items', () => ({ success: true, data: '' }));
    expect(result.success).toBe(false);
  });

  it('validates each item', () => {
    const result = validateArray(
      ['a', 123, 'c'],
      'items',
      (item) => validateString(item, 'item')
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('items[1]');
    }
  });

  it('enforces minLength', () => {
    const result = validateArray([], 'items', () => ({ success: true, data: '' }), { minLength: 1 });
    expect(result.success).toBe(false);
  });

  it('enforces maxLength', () => {
    const result = validateArray(
      [1, 2, 3, 4, 5],
      'items',
      (item) => validateNumber(item, 'item'),
      { maxLength: 3 }
    );
    expect(result.success).toBe(false);
  });
});

describe('validateEvaluateRequest', () => {
  const validBody = {
    questionId: '550e8400-e29b-41d4-a716-446655440000',
    response: 'My answer to the question',
    rubric: { accuracy: 1, clarity: 1 },
    type: 'conceptual',
  };

  it('accepts valid request body', () => {
    const result = validateEvaluateRequest(validBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.questionId).toBe(validBody.questionId);
      expect(result.data.response).toBe(validBody.response);
    }
  });

  it('rejects missing questionId', () => {
    const result = validateEvaluateRequest({ ...validBody, questionId: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects invalid questionId', () => {
    const result = validateEvaluateRequest({ ...validBody, questionId: 'not-uuid' });
    expect(result.success).toBe(false);
  });

  it('rejects empty response', () => {
    const result = validateEvaluateRequest({ ...validBody, response: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing rubric', () => {
    const result = validateEvaluateRequest({ ...validBody, rubric: undefined });
    expect(result.success).toBe(false);
  });

  it('rejects non-object body', () => {
    expect(validateEvaluateRequest(null).success).toBe(false);
    expect(validateEvaluateRequest('string').success).toBe(false);
  });
});

describe('validateSaveResponseRequest', () => {
  const validBody = {
    question_id: '550e8400-e29b-41d4-a716-446655440000',
    response_text: 'My answer',
    time_spent_seconds: 120,
  };

  it('accepts valid request body', () => {
    const result = validateSaveResponseRequest(validBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.question_id).toBe(validBody.question_id);
    }
  });

  it('accepts minimal body with just question_id', () => {
    const result = validateSaveResponseRequest({ question_id: validBody.question_id });
    expect(result.success).toBe(true);
  });

  it('rejects missing question_id', () => {
    const result = validateSaveResponseRequest({ response_text: 'test' });
    expect(result.success).toBe(false);
  });

  it('validates time_spent_seconds range', () => {
    const negative = validateSaveResponseRequest({ ...validBody, time_spent_seconds: -1 });
    expect(negative.success).toBe(false);

    const tooLarge = validateSaveResponseRequest({ ...validBody, time_spent_seconds: 100000 });
    expect(tooLarge.success).toBe(false);
  });

  it('validates overall_score range', () => {
    const negative = validateSaveResponseRequest({ ...validBody, overall_score: -0.1 });
    expect(negative.success).toBe(false);

    const tooLarge = validateSaveResponseRequest({ ...validBody, overall_score: 1.1 });
    expect(tooLarge.success).toBe(false);

    const valid = validateSaveResponseRequest({ ...validBody, overall_score: 0.75 });
    expect(valid.success).toBe(true);
  });
});

describe('validateCreateQuestionRequest', () => {
  const validBody = {
    skill_id: '550e8400-e29b-41d4-a716-446655440000',
    type: 'conceptual',
    format: 'text',
    title: 'What is React?',
    prompt: 'Explain the key concepts of React and how it differs from vanilla JavaScript.',
    difficulty: 'beginner',
  };

  it('accepts valid minimal request body', () => {
    const result = validateCreateQuestionRequest(validBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skill_id).toBe(validBody.skill_id);
      expect(result.data.type).toBe('conceptual');
      expect(result.data.format).toBe('text');
      expect(result.data.title).toBe(validBody.title);
    }
  });

  it('accepts valid request with all optional fields', () => {
    const fullBody = {
      ...validBody,
      hints: ['Think about components', 'Consider virtual DOM'],
      technologies: ['react', 'javascript'],
      company_tags: ['Meta', 'Netflix'],
      topic_tags: ['fundamentals', 'library'],
      time_estimate_minutes: 15,
      solution: {
        explanation: 'React is a library...',
        key_points: ['Components', 'Virtual DOM', 'Unidirectional flow'],
        code: 'const App = () => <div>Hello</div>;',
      },
      rubric: [
        {
          name: 'accuracy',
          weight: 0.5,
          anchors: {
            '1': 'Incorrect',
            '2': 'Mostly incorrect',
            '3': 'Partially correct',
            '4': 'Mostly correct',
            '5': 'Completely correct',
          },
        },
      ],
    };
    const result = validateCreateQuestionRequest(fullBody);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hints).toEqual(fullBody.hints);
      expect(result.data.technologies).toEqual(fullBody.technologies);
      expect(result.data.time_estimate_minutes).toBe(15);
      expect(result.data.solution?.key_points).toHaveLength(3);
      expect(result.data.rubric).toHaveLength(1);
    }
  });

  it('rejects missing required fields', () => {
    expect(validateCreateQuestionRequest({}).success).toBe(false);
    expect(validateCreateQuestionRequest({ ...validBody, skill_id: undefined }).success).toBe(false);
    expect(validateCreateQuestionRequest({ ...validBody, type: undefined }).success).toBe(false);
    expect(validateCreateQuestionRequest({ ...validBody, format: undefined }).success).toBe(false);
    expect(validateCreateQuestionRequest({ ...validBody, title: undefined }).success).toBe(false);
    expect(validateCreateQuestionRequest({ ...validBody, prompt: undefined }).success).toBe(false);
    expect(validateCreateQuestionRequest({ ...validBody, difficulty: undefined }).success).toBe(false);
  });

  it('rejects invalid skill_id', () => {
    const result = validateCreateQuestionRequest({ ...validBody, skill_id: 'not-a-uuid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('skill_id');
    }
  });

  it('rejects invalid type enum', () => {
    const result = validateCreateQuestionRequest({ ...validBody, type: 'invalid_type' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('type');
      expect(result.error).toContain('must be one of');
    }
  });

  it('rejects invalid format enum', () => {
    const result = validateCreateQuestionRequest({ ...validBody, format: 'invalid_format' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('format');
    }
  });

  it('rejects invalid difficulty enum', () => {
    const result = validateCreateQuestionRequest({ ...validBody, difficulty: 'super_hard' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('difficulty');
    }
  });

  it('enforces title length constraints', () => {
    const tooShort = validateCreateQuestionRequest({ ...validBody, title: 'Hi' });
    expect(tooShort.success).toBe(false);

    const tooLong = validateCreateQuestionRequest({ ...validBody, title: 'x'.repeat(501) });
    expect(tooLong.success).toBe(false);
  });

  it('enforces prompt length constraints', () => {
    const tooShort = validateCreateQuestionRequest({ ...validBody, prompt: 'Short' });
    expect(tooShort.success).toBe(false);
    if (!tooShort.success) {
      expect(tooShort.error).toContain('at least 10');
    }
  });

  it('validates hints array items', () => {
    const invalidHints = validateCreateQuestionRequest({
      ...validBody,
      hints: ['valid', 123, 'also valid'],
    });
    expect(invalidHints.success).toBe(false);
    if (!invalidHints.success) {
      expect(invalidHints.error).toContain('hints[1]');
    }
  });

  it('validates time_estimate_minutes range', () => {
    const tooLow = validateCreateQuestionRequest({ ...validBody, time_estimate_minutes: 0 });
    expect(tooLow.success).toBe(false);

    const tooHigh = validateCreateQuestionRequest({ ...validBody, time_estimate_minutes: 500 });
    expect(tooHigh.success).toBe(false);

    const valid = validateCreateQuestionRequest({ ...validBody, time_estimate_minutes: 30 });
    expect(valid.success).toBe(true);
  });

  it('validates solution structure', () => {
    const noExplanation = validateCreateQuestionRequest({
      ...validBody,
      solution: { key_points: ['point'] },
    });
    expect(noExplanation.success).toBe(false);

    const noKeyPoints = validateCreateQuestionRequest({
      ...validBody,
      solution: { explanation: 'explained' },
    });
    expect(noKeyPoints.success).toBe(false);

    const emptyKeyPoints = validateCreateQuestionRequest({
      ...validBody,
      solution: { explanation: 'explained', key_points: [] },
    });
    expect(emptyKeyPoints.success).toBe(false);
  });

  it('validates rubric structure', () => {
    const missingAnchors = validateCreateQuestionRequest({
      ...validBody,
      rubric: [{ name: 'test', weight: 0.5 }],
    });
    expect(missingAnchors.success).toBe(false);

    const incompleteAnchors = validateCreateQuestionRequest({
      ...validBody,
      rubric: [{
        name: 'test',
        weight: 0.5,
        anchors: { '1': 'one', '2': 'two' }, // Missing 3, 4, 5
      }],
    });
    expect(incompleteAnchors.success).toBe(false);
  });

  it('rejects non-object body', () => {
    expect(validateCreateQuestionRequest(null).success).toBe(false);
    expect(validateCreateQuestionRequest('string').success).toBe(false);
    expect(validateCreateQuestionRequest([]).success).toBe(false);
  });
});
