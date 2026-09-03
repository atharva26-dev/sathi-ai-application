-- ==========================================================================
-- SAATHI Database Foundation: 011_mentor.sql
-- Step-by-Step Mentorship System, Action Checklists, and Task Tracking
-- ==========================================================================

-- Mentor Plans Table
CREATE TABLE IF NOT EXISTS public.mentor_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_idea_id UUID NOT NULL REFERENCES public.business_ideas(id) ON DELETE CASCADE,
    current_stage TEXT NOT NULL DEFAULT 'STAGE_1_PREPARATION',
    overall_progress NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (overall_progress >= 0 AND overall_progress <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_plans_user ON public.mentor_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_plans_idea ON public.mentor_plans(business_idea_id);
CREATE TRIGGER set_mentor_plans_updated_at
BEFORE UPDATE ON public.mentor_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Mentor Tasks Table (Granular actionable tasks for Today, Week, Month, 90 Days)
CREATE TABLE IF NOT EXISTS public.mentor_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_plan_id UUID NOT NULL REFERENCES public.mentor_plans(id) ON DELETE CASCADE,
    timeframe TEXT NOT NULL CHECK (timeframe IN ('TODAY', 'THIS_WEEK', 'THIS_MONTH', 'NEXT_90_DAYS')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('MARKET', 'SUPPLIER', 'FINANCE', 'DOCUMENT', 'OPERATION')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    due_date DATE,
    status public.task_status NOT NULL DEFAULT 'pending',
    completion_note TEXT,
    completed_at TIMESTAMPTZ,
    voice_action_prompt TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_tasks_plan ON public.mentor_tasks(mentor_plan_id);
CREATE INDEX IF NOT EXISTS idx_mentor_tasks_timeframe ON public.mentor_tasks(timeframe);
CREATE INDEX IF NOT EXISTS idx_mentor_tasks_status ON public.mentor_tasks(status);
CREATE TRIGGER set_mentor_tasks_updated_at
BEFORE UPDATE ON public.mentor_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
