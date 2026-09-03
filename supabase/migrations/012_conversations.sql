-- ==========================================================================
-- SAATHI Database Foundation: 012_conversations.sql
-- Conversational AI Interactions, Structured Output Cards, and Voice Session Metadata
-- ==========================================================================

-- Conversations Container Table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'नवीन संवाद',
    language public.language_code NOT NULL DEFAULT 'mr',
    context_type TEXT, -- e.g. 'BUSINESS_DISCOVERY', 'MARKET_GAP', 'LOAN_GUIDANCE', 'GENERAL'
    context_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conversations_user ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_context ON public.conversations(context_type, context_id);
CREATE TRIGGER set_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Conversation Messages Table (Stores clean dialogue and structured cards, NO hidden reasoning)
CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    language public.language_code NOT NULL DEFAULT 'mr',
    message_type TEXT NOT NULL DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'VOICE_TRANSCRIPT', 'STRUCTURED_CARD', 'AUDIO_EXPLANATION')),
    structured_data JSONB DEFAULT '{}'::jsonb, -- Structured payloads for interactive frontend cards
    model_metadata JSONB DEFAULT '{}'::jsonb, -- Model ID, token counts, latency (NO chain-of-thought)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conv_msgs_conversation ON public.conversation_messages(conversation_id, created_at ASC);

-- Voice Sessions Metadata Table (Data minimization: transient audio reference with duration)
CREATE TABLE IF NOT EXISTS public.voice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    language public.language_code NOT NULL DEFAULT 'mr',
    duration_seconds NUMERIC(6,2),
    transcription_status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (transcription_status IN ('COMPLETED', 'FAILED', 'PARTIAL')),
    audio_storage_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_sessions_user ON public.voice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_conv ON public.voice_sessions(conversation_id);
