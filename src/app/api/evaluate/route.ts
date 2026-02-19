import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { validateEvaluateRequest } from '@/lib/utils/validation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = validateEvaluateRequest(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const { questionId, response, rubric, type } = validationResult.data;

    // Fetch the question
    const { data: question } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Build evaluation prompt based on question type
    const systemPrompt = buildEvaluationPrompt(type, question, rubric);

    // Call OpenAI for evaluation
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `User's response:\n\n${response}` },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const evaluation = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      evaluation: {
        score: evaluation.score || 0,
        strengths: evaluation.strengths || [],
        improvements: evaluation.improvements || [],
        detailedFeedback: evaluation.feedback || '',
        rubricScores: evaluation.rubricScores || {},
      },
    });
  } catch (error) {
    console.error('Error evaluating response:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate response' },
      { status: 500 }
    );
  }
}

function buildEvaluationPrompt(type: string, question: any, rubric: any): string {
  const basePrompt = `You are an expert technical interviewer evaluating a candidate's response to an interview question.

Question: ${question.title}
Prompt: ${question.prompt}
Type: ${type}
Difficulty: ${question.difficulty}

Evaluation Criteria:
${JSON.stringify(rubric, null, 2)}

Evaluate the candidate's response and provide:
1. An overall score (0-5 scale)
2. Key strengths (2-3 points)
3. Areas for improvement (2-3 points)
4. Detailed feedback (2-3 paragraphs)
5. Individual scores for each rubric criterion

Return your evaluation as a JSON object with this structure:
{
  "score": 3.5,
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "feedback": "detailed feedback...",
  "rubricScores": {
    "accuracy": 4,
    "clarity": 3,
    "depth": 3
  }
}

Be constructive, specific, and encouraging. Focus on helping the candidate improve.`;

  return basePrompt;
}
