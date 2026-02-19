/**
 * Database types for InterviewAce
 * Maps to Supabase PostgreSQL schema
 */

// Core domain types
export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type QuestionType = "conceptual" | "coding" | "system_design" | "behavioral" | "practical";
export type QuestionFormat = "text" | "voice" | "code" | "whiteboard";
export type SessionType = "quick_practice" | "mock_interview" | "review" | "assessment";

// Technology domains
export type TechDomain =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "system_design"
  | "dsa"
  | "behavioral"
  | "ux_ui";

// Specific technologies for filtering
export type Technology =
  // Frontend
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "react"
  | "nextjs"
  | "vue"
  | "angular"
  | "svelte"
  // Backend
  | "nodejs"
  | "python"
  | "java"
  | "go"
  | "rust"
  | "php"
  // Databases
  | "sql"
  | "postgresql"
  | "mongodb"
  | "redis"
  // DevOps
  | "docker"
  | "kubernetes"
  | "aws"
  | "gcp"
  | "azure"
  | "ci_cd"
  | "terraform"
  // Other
  | "graphql"
  | "rest_api"
  | "testing"
  | "security"
  | "accessibility"
  | "performance"
  | "general";

// Profile (extends Supabase auth.users)
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  target_role: TechDomain | null;
  target_company: string | null;
  target_level: "junior" | "mid" | "senior" | "staff" | null;
  preferred_technologies: Technology[];
  daily_session_limit_minutes: number;
  created_at: string;
  updated_at: string;
}

// Content domain (e.g., "Frontend Development", "System Design")
export interface Domain {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

// Skill within a domain (e.g., "React Hooks", "Binary Trees")
export interface Skill {
  id: string;
  domain_id: string;
  parent_skill_id: string | null;
  name: string;
  display_name: string;
  description: string | null;
  difficulty_tier: number; // 1-5
  xp_to_master: number;
  technologies: Technology[];
  is_active: boolean;
}

// Interview question
export interface Question {
  id: string;
  skill_id: string;
  type: QuestionType;
  format: QuestionFormat;
  title: string;
  prompt: string;
  hints: string[];
  solution: {
    explanation: string;
    code?: string;
    key_points: string[];
  } | null;
  rubric: RubricDimension[];
  difficulty: DifficultyLevel;
  technologies: Technology[];
  company_tags: string[];
  topic_tags: string[];
  time_estimate_minutes: number;
  // IRT parameters
  irt_difficulty: number;
  irt_discrimination: number;
  irt_guessing: number;
  created_at: string;
  is_active: boolean;
}

// Rubric for evaluating answers
export interface RubricDimension {
  name: string;
  weight: number;
  anchors: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

// User's progress on a skill
export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  xp_earned: number;
  mastery_level: number; // 0-5
  is_unlocked: boolean;
  ability_theta: number; // IRT ability estimate
  ability_se: number; // Standard error
  // Spaced repetition
  next_review_at: string | null;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  created_at: string;
  updated_at: string;
}

// Practice session
export interface Session {
  id: string;
  user_id: string;
  session_type: SessionType;
  domain_id: string | null;
  technologies: Technology[];
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  questions_attempted: number;
  questions_correct: number;
  xp_earned: number;
  mood_before: number | null; // 1-5
  mood_after: number | null;
  notes: string | null;
}

// Individual response to a question
export interface Response {
  id: string;
  session_id: string;
  user_id: string;
  question_id: string;
  response_text: string | null;
  response_code: string | null;
  response_audio_url: string | null;
  transcript: string | null;
  started_at: string;
  submitted_at: string | null;
  time_spent_seconds: number | null;
  evaluation: Evaluation | null;
  overall_score: number | null; // 0-1
  is_correct: boolean | null;
  irt_response: 0 | 1 | null;
  created_at: string;
}

// AI evaluation of a response
export interface Evaluation {
  scores: Record<string, {
    score: number; // 1-5
    justification: string;
  }>;
  overall_score: number; // 0-1
  strengths: string[];
  improvements: string[];
  follow_up_questions: string[];
}

// Behavioral story for STAR method
export interface Story {
  id: string;
  user_id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  applicable_questions: string[];
  strength_score: number | null; // 1-5
  feedback: StoryFeedback | null;
  created_at: string;
  updated_at: string;
}

export interface StoryFeedback {
  overall_strength: string;
  suggestions: string[];
  missing_elements: string[];
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  category: "mastery" | "exploration" | "consistency" | "milestone";
  requirement: AchievementRequirement;
  xp_reward: number;
  is_secret: boolean;
}

export interface AchievementRequirement {
  type: "skill_mastery" | "questions_answered" | "sessions_completed" | "streak_days" | "custom";
  target: number;
  skill_id?: string;
  domain_id?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

// View types for the UI
export interface QuestionWithSkill extends Question {
  skill: Skill;
}

export interface SessionWithResponses extends Session {
  responses: Response[];
}

export interface SkillProgress extends Skill {
  user_progress: UserSkill | null;
}

// Alias for Response to avoid conflict with global Fetch API Response
export type QuestionResponse = Response;

// Supabase Database type placeholder
// In production, generate with: npx supabase gen types typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      questions: {
        Row: Question;
        Insert: Partial<Question>;
        Update: Partial<Question>;
      };
      responses: {
        Row: QuestionResponse;
        Insert: Partial<QuestionResponse> & { user_id: string; question_id: string };
        Update: Partial<QuestionResponse>;
      };
      user_progress: {
        Row: UserSkill;
        Insert: Partial<UserSkill> & { user_id: string; skill_id: string };
        Update: Partial<UserSkill>;
      };
      skills: {
        Row: Skill;
        Insert: Partial<Skill>;
        Update: Partial<Skill>;
      };
      domains: {
        Row: Domain;
        Insert: Partial<Domain>;
        Update: Partial<Domain>;
      };
      sessions: {
        Row: Session;
        Insert: Partial<Session> & { user_id: string };
        Update: Partial<Session>;
      };
      stories: {
        Row: Story;
        Insert: Partial<Story> & { user_id: string };
        Update: Partial<Story>;
      };
      achievements: {
        Row: Achievement;
        Insert: Partial<Achievement>;
        Update: Partial<Achievement>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Partial<UserAchievement> & { user_id: string; achievement_id: string };
        Update: Partial<UserAchievement>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
