import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Question as QuestionType } from '@/types/database';

export type Question = QuestionType;
export type QuestionInsert = Partial<QuestionType>;
export type QuestionUpdate = Partial<QuestionType>;

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

export async function getQuestions(filters?: {
  technologies?: string[];
  difficulty?: string;
  type?: string;
  search?: string;
}) {
  const supabase = await createServerSupabase();

  let query = supabase
    .from('questions')
    .select('*')
    .eq('is_active', true);

  if (filters?.technologies && filters.technologies.length > 0) {
    query = query.overlaps('technologies', filters.technologies);
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,prompt.ilike.%${filters.search}%,topic_tags.cs.{${filters.search}}`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getQuestionById(id: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createQuestion(question: QuestionInsert) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('questions')
    .insert(question)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuestion(id: string, updates: QuestionUpdate) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestion(id: string) {
  const supabase = await createServerSupabase();

  // Soft delete by setting is_active to false
  const { error } = await supabase
    .from('questions')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

export async function getQuestionsBySkill(skillId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('skill_id', skillId)
    .eq('is_active', true)
    .order('difficulty');

  if (error) throw error;
  return data;
}

export async function getRandomQuestions(filters?: {
  technologies?: string[];
  difficulty?: string;
  limit?: number;
}) {
  const supabase = await createServerSupabase();

  let query = supabase
    .from('questions')
    .select('*')
    .eq('is_active', true);

  if (filters?.technologies && filters.technologies.length > 0) {
    query = query.overlaps('technologies', filters.technologies);
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  const { data, error } = await query.limit(filters?.limit || 10);

  if (error) throw error;

  // Shuffle results
  return data?.sort(() => Math.random() - 0.5) || [];
}
