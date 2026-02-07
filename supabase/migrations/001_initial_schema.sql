-- InterviewAce Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DOMAINS (Content Categories)
-- ============================================
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed domains
INSERT INTO domains (name, display_name, description, icon, sort_order) VALUES
  ('frontend', 'Frontend Development', 'HTML, CSS, JavaScript, and frontend frameworks', 'Monitor', 1),
  ('backend', 'Backend Development', 'Server-side programming, APIs, and databases', 'Server', 2),
  ('fullstack', 'Full Stack', 'End-to-end web development', 'Layers', 3),
  ('dsa', 'Data Structures & Algorithms', 'Core CS fundamentals and coding challenges', 'Binary', 4),
  ('system_design', 'System Design', 'Designing scalable distributed systems', 'Network', 5),
  ('devops', 'DevOps & Cloud', 'CI/CD, containers, and cloud infrastructure', 'Cloud', 6),
  ('behavioral', 'Behavioral', 'Soft skills and STAR method interviews', 'Users', 7),
  ('ux_ui', 'UX/UI Design', 'User experience and interface design principles', 'Palette', 8);

-- ============================================
-- SKILLS (Topics within Domains)
-- ============================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  parent_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  difficulty_tier INT DEFAULT 1 CHECK (difficulty_tier BETWEEN 1 AND 5),
  xp_to_master INT DEFAULT 1000,
  technologies TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain_id, name)
);

-- ============================================
-- QUESTIONS
-- ============================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('conceptual', 'coding', 'system_design', 'behavioral', 'practical')),
  format TEXT NOT NULL CHECK (format IN ('text', 'voice', 'code', 'whiteboard')),
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  hints JSONB DEFAULT '[]',
  solution JSONB,
  rubric JSONB NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  technologies TEXT[] DEFAULT '{}',
  company_tags TEXT[] DEFAULT '{}',
  topic_tags TEXT[] DEFAULT '{}',
  time_estimate_minutes INT DEFAULT 10,
  -- IRT Parameters
  irt_difficulty FLOAT DEFAULT 0,
  irt_discrimination FLOAT DEFAULT 1,
  irt_guessing FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Indexes for efficient filtering
CREATE INDEX idx_questions_skill ON questions(skill_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_technologies ON questions USING GIN(technologies);
CREATE INDEX idx_questions_company_tags ON questions USING GIN(company_tags);

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  target_role TEXT,
  target_company TEXT,
  target_level TEXT CHECK (target_level IN ('junior', 'mid', 'senior', 'staff')),
  preferred_technologies TEXT[] DEFAULT '{}',
  daily_session_limit_minutes INT DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER SKILLS (Progress tracking)
-- ============================================
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  xp_earned INT DEFAULT 0,
  mastery_level INT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  is_unlocked BOOLEAN DEFAULT false,
  ability_theta FLOAT DEFAULT 0,
  ability_se FLOAT DEFAULT 1,
  -- Spaced repetition (SM-2)
  next_review_at TIMESTAMPTZ,
  easiness_factor FLOAT DEFAULT 2.5,
  interval_days INT DEFAULT 1,
  repetitions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- ============================================
-- SESSIONS (Practice sessions)
-- ============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('quick_practice', 'mock_interview', 'review', 'assessment')),
  domain_id UUID REFERENCES domains(id),
  technologies TEXT[] DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  questions_attempted INT DEFAULT 0,
  questions_correct INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  mood_before INT CHECK (mood_before BETWEEN 1 AND 5),
  mood_after INT CHECK (mood_after BETWEEN 1 AND 5),
  notes TEXT
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_started ON sessions(started_at);

-- ============================================
-- RESPONSES (Answers to questions)
-- ============================================
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  response_text TEXT,
  response_code TEXT,
  response_audio_url TEXT,
  transcript TEXT,
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  time_spent_seconds INT,
  evaluation JSONB,
  overall_score FLOAT CHECK (overall_score BETWEEN 0 AND 1),
  is_correct BOOLEAN,
  irt_response INT CHECK (irt_response IN (0, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_responses_user ON responses(user_id);
CREATE INDEX idx_responses_question ON responses(question_id);

-- ============================================
-- STORIES (Behavioral STAR stories)
-- ============================================
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  situation TEXT NOT NULL,
  task TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  applicable_questions UUID[] DEFAULT '{}',
  strength_score INT CHECK (strength_score BETWEEN 1 AND 5),
  feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT CHECK (category IN ('mastery', 'exploration', 'consistency', 'milestone')),
  requirement JSONB NOT NULL,
  xp_reward INT DEFAULT 0,
  is_secret BOOLEAN DEFAULT false
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User skills: Users can only manage their own
CREATE POLICY "Users can manage own skills"
  ON user_skills FOR ALL
  USING (auth.uid() = user_id);

-- Sessions: Users can only manage their own
CREATE POLICY "Users can manage own sessions"
  ON sessions FOR ALL
  USING (auth.uid() = user_id);

-- Responses: Users can only manage their own
CREATE POLICY "Users can manage own responses"
  ON responses FOR ALL
  USING (auth.uid() = user_id);

-- Stories: Users can only manage their own
CREATE POLICY "Users can manage own stories"
  ON stories FOR ALL
  USING (auth.uid() = user_id);

-- User achievements: Users can only view their own
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Content tables: Authenticated users can read
CREATE POLICY "Authenticated can view domains"
  ON domains FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp on profile changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_skills_updated_at
  BEFORE UPDATE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
