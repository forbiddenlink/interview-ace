import { NextRequest, NextResponse } from 'next/server';
import { saveResponse, getUserResponses } from '@/lib/db/progress';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { validateSaveResponseRequest } from '@/lib/utils/validation';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId') || undefined;

    const responses = await getUserResponses(user.id, questionId);

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}

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
    const validationResult = validateSaveResponseRequest(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    const responseData = {
      ...validationResult.data,
      user_id: user.id,
    };

    const savedResponse = await saveResponse(responseData);

    return NextResponse.json({ response: savedResponse }, { status: 201 });
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    );
  }
}
