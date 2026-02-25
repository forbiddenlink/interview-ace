import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Response as QuestionResponse, UserSkill } from '@/types/database';

export type Response = QuestionResponse;
export type ResponseInsert = Partial<QuestionResponse> & { user_id: string; question_id: string };

export type UserProgress = UserSkill;
export type UserProgressInsert = Partial<UserSkill> & { user_id: string; skill_id: string };
export type UserProgressUpdate = Partial<UserSkill>;

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
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
}

export async function saveResponse(response: ResponseInsert) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('responses')
    .insert(response)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserResponses(userId: string, questionId?: string) {
  const supabase = await createServerSupabase();

  let query = supabase
    .from('responses')
    .select('*, questions(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (questionId) {
    query = query.eq('question_id', questionId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getUserProgress(userId: string, skillId?: string) {
  const supabase = await createServerSupabase();

  let query = supabase
    .from('user_progress')
    .select('*, skills(*)')
    .eq('user_id', userId);

  if (skillId) {
    query = query.eq('skill_id', skillId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function updateUserProgress(userId: string, skillId: string, updates: UserProgressUpdate) {
  const supabase = await createServerSupabase();

  // Try to update existing progress
  const { data: existing } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('skill_id', skillId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .eq('skill_id', skillId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new progress record
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        skill_id: skillId,
        ...updates,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function getSkillMastery(userId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('user_progress')
    .select('*, skills(*)')
    .eq('user_id', userId)
    .order('mastery_level', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTodayStats(userId: string) {
  const supabase = await createServerSupabase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString());

  if (error) throw error;

  const totalQuestions = data?.length || 0;
  const totalTime = data?.reduce((sum, r) => sum + (r.time_spent_seconds || 0), 0) || 0;
  const avgScore = data?.length 
    ? data.reduce((sum, r) => sum + (r.score || 0), 0) / data.length 
    : 0;

  return {
    questions_attempted: totalQuestions,
    time_spent_minutes: Math.round(totalTime / 60),
    average_score: Math.round(avgScore * 100) / 100,
  };
}
