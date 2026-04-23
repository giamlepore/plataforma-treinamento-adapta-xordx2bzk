-- Add score column to track proportional grades for quizzes
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS score NUMERIC(5,2);

-- Table for Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Quiz Options
CREATE TABLE IF NOT EXISTS public.quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Settings
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;

-- Admins can manage quiz_questions
DROP POLICY IF EXISTS "Admins can manage quiz_questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage quiz_questions" ON public.quiz_questions
  FOR ALL TO public
  USING (
    lesson_id IN (
      SELECT l.id FROM public.lessons l
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can read quiz_questions
DROP POLICY IF EXISTS "Users can read quiz_questions" ON public.quiz_questions;
CREATE POLICY "Users can read quiz_questions" ON public.quiz_questions
  FOR SELECT TO public
  USING (
    lesson_id IN (
      SELECT l.id FROM public.lessons l
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid()
    )
  );

-- Admins can manage quiz_options
DROP POLICY IF EXISTS "Admins can manage quiz_options" ON public.quiz_options;
CREATE POLICY "Admins can manage quiz_options" ON public.quiz_options
  FOR ALL TO public
  USING (
    question_id IN (
      SELECT q.id FROM public.quiz_questions q
      JOIN public.lessons l ON l.id = q.lesson_id
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Users can read quiz_options
DROP POLICY IF EXISTS "Users can read quiz_options" ON public.quiz_options;
CREATE POLICY "Users can read quiz_options" ON public.quiz_options
  FOR SELECT TO public
  USING (
    question_id IN (
      SELECT q.id FROM public.quiz_questions q
      JOIN public.lessons l ON l.id = q.lesson_id
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      JOIN public.profiles p ON p.organization_id = c.organization_id
      WHERE p.id = auth.uid()
    )
  );
