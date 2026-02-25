import { NextRequest, NextResponse } from 'next/server';
import { getQuestionById } from '@/lib/db/questions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const question = await getQuestionById(id);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  _request: NextRequest,
  { params: _params }: { params: Promise<{ id: string }> }
) {
  // Question modification is admin-only functionality
  // This endpoint is disabled for regular users to prevent unauthorized modifications
  // TODO: Implement admin role check when admin system is added
  return NextResponse.json(
    { error: 'Question modification is not allowed' },
    { status: 403 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params: _params }: { params: Promise<{ id: string }> }
) {
  // Question deletion is admin-only functionality
  // This endpoint is disabled for regular users to prevent unauthorized deletions
  // TODO: Implement admin role check when admin system is added
  return NextResponse.json(
    { error: 'Question deletion is not allowed' },
    { status: 403 }
  );
}
