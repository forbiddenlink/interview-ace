/**
 * Input validation utilities for API routes
 * Provides simple, type-safe validation without external dependencies
 */

import type { Technology, QuestionType, QuestionFormat, DifficultyLevel } from '@/types/database';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Create a validation error result
 */
function validationError<T>(error: string): ValidationResult<T> {
  return { success: false, error };
}

/**
 * Validate that a value is a non-empty string
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options?: { minLength?: number; maxLength?: number }
): ValidationResult<string> {
  if (typeof value !== 'string') {
    return validationError(`${fieldName} must be a string`);
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return validationError(`${fieldName} cannot be empty`);
  }

  if (options?.minLength && trimmed.length < options.minLength) {
    return validationError(`${fieldName} must be at least ${options.minLength} characters`);
  }

  if (options?.maxLength && trimmed.length > options.maxLength) {
    return validationError(`${fieldName} must be at most ${options.maxLength} characters`);
  }

  return { success: true, data: trimmed };
}

/**
 * Validate that a value is a valid UUID
 */
export function validateUUID(value: unknown, fieldName: string): ValidationResult<string> {
  const stringResult = validateString(value, fieldName);
  if (!stringResult.success) return stringResult;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(stringResult.data)) {
    return validationError(`${fieldName} must be a valid UUID`);
  }

  return { success: true, data: stringResult.data };
}

/**
 * Validate that a value is one of allowed values
 */
export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): ValidationResult<T> {
  const stringResult = validateString(value, fieldName);
  if (!stringResult.success) return validationError(stringResult.error);

  if (!allowedValues.includes(stringResult.data as T)) {
    return validationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }

  return { success: true, data: stringResult.data as T };
}

/**
 * Validate that a value is a number within range
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): ValidationResult<number> {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (typeof num !== 'number' || isNaN(num)) {
    return validationError(`${fieldName} must be a number`);
  }

  if (options?.min !== undefined && num < options.min) {
    return validationError(`${fieldName} must be at least ${options.min}`);
  }

  if (options?.max !== undefined && num > options.max) {
    return validationError(`${fieldName} must be at most ${options.max}`);
  }

  return { success: true, data: num };
}

/**
 * Validate an array of values
 */
export function validateArray<T>(
  value: unknown,
  fieldName: string,
  itemValidator: (item: unknown, index: number) => ValidationResult<T>,
  options?: { minLength?: number; maxLength?: number }
): ValidationResult<T[]> {
  if (!Array.isArray(value)) {
    return validationError(`${fieldName} must be an array`);
  }

  if (options?.minLength !== undefined && value.length < options.minLength) {
    return validationError(`${fieldName} must have at least ${options.minLength} items`);
  }

  if (options?.maxLength !== undefined && value.length > options.maxLength) {
    return validationError(`${fieldName} must have at most ${options.maxLength} items`);
  }

  const results: T[] = [];
  for (let i = 0; i < value.length; i++) {
    const result = itemValidator(value[i], i);
    if (!result.success) {
      return validationError(`${fieldName}[${i}]: ${result.error}`);
    }
    results.push(result.data);
  }

  return { success: true, data: results };
}

/**
 * Validate evaluate request body
 */
export interface EvaluateRequestBody {
  questionId: string;
  response: string;
  rubric: Record<string, unknown>;
  type: string;
}

export function validateEvaluateRequest(body: unknown): ValidationResult<EvaluateRequestBody> {
  if (!body || typeof body !== 'object') {
    return validationError('Request body must be an object');
  }

  const obj = body as Record<string, unknown>;

  const questionIdResult = validateUUID(obj.questionId, 'questionId');
  if (!questionIdResult.success) {
    return validationError(questionIdResult.error);
  }

  const responseResult = validateString(obj.response, 'response', {
    minLength: 1,
    maxLength: 50000,
  });
  if (!responseResult.success) {
    return validationError(responseResult.error);
  }

  if (!obj.rubric || typeof obj.rubric !== 'object') {
    return validationError('rubric must be an object');
  }

  const typeResult = validateString(obj.type, 'type');
  if (!typeResult.success) {
    return validationError(typeResult.error);
  }

  return {
    success: true,
    data: {
      questionId: questionIdResult.data,
      response: responseResult.data,
      rubric: obj.rubric as Record<string, unknown>,
      type: typeResult.data,
    },
  };
}

/**
 * Evaluation type matching database schema
 */
export interface Evaluation {
  scores: Record<string, {
    score: number;
    justification: string;
  }>;
  overall_score: number;
  strengths: string[];
  improvements: string[];
  follow_up_questions: string[];
}

/**
 * Validate response save request body
 */
export interface SaveResponseBody {
  question_id: string;
  session_id?: string;
  response_text?: string;
  response_code?: string;
  time_spent_seconds?: number;
  evaluation?: Evaluation | null;
  overall_score?: number;
}

export function validateSaveResponseRequest(body: unknown): ValidationResult<SaveResponseBody> {
  if (!body || typeof body !== 'object') {
    return validationError('Request body must be an object');
  }

  const obj = body as Record<string, unknown>;

  const questionIdResult = validateUUID(obj.question_id, 'question_id');
  if (!questionIdResult.success) {
    return validationError(questionIdResult.error);
  }

  const result: SaveResponseBody = {
    question_id: questionIdResult.data,
  };

  // Optional fields
  if (obj.session_id !== undefined) {
    const sessionResult = validateUUID(obj.session_id, 'session_id');
    if (!sessionResult.success) {
      return validationError(sessionResult.error);
    }
    result.session_id = sessionResult.data;
  }

  if (obj.response_text !== undefined) {
    const textResult = validateString(obj.response_text, 'response_text', { maxLength: 100000 });
    if (!textResult.success) {
      return validationError(textResult.error);
    }
    result.response_text = textResult.data;
  }

  if (obj.response_code !== undefined) {
    const codeResult = validateString(obj.response_code, 'response_code', { maxLength: 100000 });
    if (!codeResult.success) {
      return validationError(codeResult.error);
    }
    result.response_code = codeResult.data;
  }

  if (obj.time_spent_seconds !== undefined) {
    const timeResult = validateNumber(obj.time_spent_seconds, 'time_spent_seconds', {
      min: 0,
      max: 86400,
    });
    if (!timeResult.success) {
      return validationError(timeResult.error);
    }
    result.time_spent_seconds = timeResult.data;
  }

  if (obj.overall_score !== undefined) {
    const scoreResult = validateNumber(obj.overall_score, 'overall_score', { min: 0, max: 1 });
    if (!scoreResult.success) {
      return validationError(scoreResult.error);
    }
    result.overall_score = scoreResult.data;
  }

  if (obj.evaluation !== undefined && obj.evaluation !== null) {
    if (typeof obj.evaluation !== 'object') {
      return validationError('evaluation must be an object');
    }
    // Cast to Evaluation - the full validation would be complex
    // The database will enforce the proper structure
    result.evaluation = obj.evaluation as Evaluation;
  }

  return { success: true, data: result };
}

/**
 * Allowed values for question fields
 */
const QUESTION_TYPES = ['conceptual', 'coding', 'system_design', 'behavioral', 'practical'] as const;
const QUESTION_FORMATS = ['text', 'voice', 'code', 'whiteboard'] as const;
const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

/**
 * Validate question creation request body
 */
export interface CreateQuestionBody {
  skill_id: string;
  type: QuestionType;
  format: QuestionFormat;
  title: string;
  prompt: string;
  difficulty: DifficultyLevel;
  hints?: string[];
  solution?: {
    explanation: string;
    code?: string;
    key_points: string[];
  } | null;
  rubric?: Array<{
    name: string;
    weight: number;
    anchors: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
  }>;
  technologies?: Technology[];
  company_tags?: string[];
  topic_tags?: string[];
  time_estimate_minutes?: number;
}

export function validateCreateQuestionRequest(body: unknown): ValidationResult<CreateQuestionBody> {
  if (!body || typeof body !== 'object') {
    return validationError('Request body must be an object');
  }

  const obj = body as Record<string, unknown>;

  // Required fields
  const skillIdResult = validateUUID(obj.skill_id, 'skill_id');
  if (!skillIdResult.success) {
    return validationError(skillIdResult.error);
  }

  const typeResult = validateEnum(obj.type, 'type', QUESTION_TYPES);
  if (!typeResult.success) {
    return validationError(typeResult.error);
  }

  const formatResult = validateEnum(obj.format, 'format', QUESTION_FORMATS);
  if (!formatResult.success) {
    return validationError(formatResult.error);
  }

  const titleResult = validateString(obj.title, 'title', { minLength: 3, maxLength: 500 });
  if (!titleResult.success) {
    return validationError(titleResult.error);
  }

  const promptResult = validateString(obj.prompt, 'prompt', { minLength: 10, maxLength: 50000 });
  if (!promptResult.success) {
    return validationError(promptResult.error);
  }

  const difficultyResult = validateEnum(obj.difficulty, 'difficulty', DIFFICULTY_LEVELS);
  if (!difficultyResult.success) {
    return validationError(difficultyResult.error);
  }

  const result: CreateQuestionBody = {
    skill_id: skillIdResult.data,
    type: typeResult.data,
    format: formatResult.data,
    title: titleResult.data,
    prompt: promptResult.data,
    difficulty: difficultyResult.data,
  };

  // Optional: hints array
  if (obj.hints !== undefined) {
    const hintsResult = validateArray(
      obj.hints,
      'hints',
      (item, i) => validateString(item, `hints[${i}]`, { maxLength: 1000 }),
      { maxLength: 10 }
    );
    if (!hintsResult.success) {
      return validationError(hintsResult.error);
    }
    result.hints = hintsResult.data;
  }

  // Optional: solution object
  if (obj.solution !== undefined && obj.solution !== null) {
    if (typeof obj.solution !== 'object') {
      return validationError('solution must be an object');
    }
    const sol = obj.solution as Record<string, unknown>;

    const explanationResult = validateString(sol.explanation, 'solution.explanation', { maxLength: 50000 });
    if (!explanationResult.success) {
      return validationError(explanationResult.error);
    }

    const keyPointsResult = validateArray(
      sol.key_points,
      'solution.key_points',
      (item, i) => validateString(item, `key_points[${i}]`, { maxLength: 1000 }),
      { minLength: 1, maxLength: 20 }
    );
    if (!keyPointsResult.success) {
      return validationError(keyPointsResult.error);
    }

    result.solution = {
      explanation: explanationResult.data,
      key_points: keyPointsResult.data,
    };

    if (sol.code !== undefined) {
      const codeResult = validateString(sol.code, 'solution.code', { maxLength: 100000 });
      if (!codeResult.success) {
        return validationError(codeResult.error);
      }
      result.solution.code = codeResult.data;
    }
  }

  // Optional: technologies array
  if (obj.technologies !== undefined) {
    const techResult = validateArray(
      obj.technologies,
      'technologies',
      (item, i) => validateString(item, `technologies[${i}]`, { maxLength: 50 }),
      { maxLength: 20 }
    );
    if (!techResult.success) {
      return validationError(techResult.error);
    }
    // Cast to Technology[] - database constraints will validate actual values
    result.technologies = techResult.data as Technology[];
  }

  // Optional: company_tags array
  if (obj.company_tags !== undefined) {
    const tagsResult = validateArray(
      obj.company_tags,
      'company_tags',
      (item, i) => validateString(item, `company_tags[${i}]`, { maxLength: 100 }),
      { maxLength: 50 }
    );
    if (!tagsResult.success) {
      return validationError(tagsResult.error);
    }
    result.company_tags = tagsResult.data;
  }

  // Optional: topic_tags array
  if (obj.topic_tags !== undefined) {
    const tagsResult = validateArray(
      obj.topic_tags,
      'topic_tags',
      (item, i) => validateString(item, `topic_tags[${i}]`, { maxLength: 100 }),
      { maxLength: 50 }
    );
    if (!tagsResult.success) {
      return validationError(tagsResult.error);
    }
    result.topic_tags = tagsResult.data;
  }

  // Optional: time_estimate_minutes
  if (obj.time_estimate_minutes !== undefined) {
    const timeResult = validateNumber(obj.time_estimate_minutes, 'time_estimate_minutes', {
      min: 1,
      max: 480, // Max 8 hours
    });
    if (!timeResult.success) {
      return validationError(timeResult.error);
    }
    result.time_estimate_minutes = timeResult.data;
  }

  // Optional: rubric array
  if (obj.rubric !== undefined) {
    if (!Array.isArray(obj.rubric)) {
      return validationError('rubric must be an array');
    }
    const rubricItems: CreateQuestionBody['rubric'] = [];
    for (let i = 0; i < obj.rubric.length; i++) {
      const item = obj.rubric[i];
      if (!item || typeof item !== 'object') {
        return validationError(`rubric[${i}] must be an object`);
      }
      const rubricItem = item as Record<string, unknown>;

      const nameResult = validateString(rubricItem.name, `rubric[${i}].name`, { maxLength: 100 });
      if (!nameResult.success) {
        return validationError(nameResult.error);
      }

      const weightResult = validateNumber(rubricItem.weight, `rubric[${i}].weight`, { min: 0, max: 1 });
      if (!weightResult.success) {
        return validationError(weightResult.error);
      }

      if (!rubricItem.anchors || typeof rubricItem.anchors !== 'object') {
        return validationError(`rubric[${i}].anchors must be an object`);
      }

      const anchorsObj = rubricItem.anchors as Record<string, unknown>;
      const anchorKeys = ['1', '2', '3', '4', '5'] as const;
      const validatedAnchors: { 1: string; 2: string; 3: string; 4: string; 5: string } = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
      };

      for (const key of anchorKeys) {
        const anchorResult = validateString(anchorsObj[key], `rubric[${i}].anchors.${key}`, { maxLength: 500 });
        if (!anchorResult.success) {
          return validationError(anchorResult.error);
        }
        validatedAnchors[parseInt(key) as 1 | 2 | 3 | 4 | 5] = anchorResult.data;
      }

      rubricItems.push({
        name: nameResult.data,
        weight: weightResult.data,
        anchors: validatedAnchors,
      });
    }
    result.rubric = rubricItems;
  }

  return { success: true, data: result };
}
