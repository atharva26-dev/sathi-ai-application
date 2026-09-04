import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env, .env.local, and parent directories
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });

// Map potential aliases
const rawSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.saathi.internal';
const rawSupabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';
const rawSupabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key';
const rawAiApiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
const rawAiProvider = process.env.AI_PROVIDER || (rawAiApiKey ? 'gemini' : 'fallback_rule_engine');

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),

  SUPABASE_URL: z.string().default(rawSupabaseUrl),
  SUPABASE_ANON_KEY: z.string().default(rawSupabaseAnonKey),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(rawSupabaseServiceRoleKey),

  AI_PROVIDER: z.enum(['gemini', 'openai', 'fallback_rule_engine']).default(rawAiProvider as any),
  AI_API_KEY: z.string().optional().default(rawAiApiKey || ''),
  AI_MODEL_NAME: z.string().default(process.env.AI_MODEL_NAME || 'gemini-1.5-pro'),
  AI_TEMPERATURE: z.string().default('0.2').transform((val) => parseFloat(val)),
  AI_MAX_OUTPUT_TOKENS: z.string().default('2048').transform((val) => parseInt(val, 10)),
  AI_TIMEOUT_MS: z.string().default('10000').transform((val) => parseInt(val, 10)),
  AI_RETRY_COUNT: z.string().default('2').transform((val) => parseInt(val, 10)),

  VOICE_PROVIDER: z.string().default('ai4bharat'),
  VOICE_PIPELINE_MODE: z.enum(['remote', 'local', 'fallback']).default((process.env.VOICE_PIPELINE_MODE as any) || 'fallback'),
  AI4BHARAT_ASR_URL: z.string().default(process.env.AI4BHARAT_ASR_URL || 'http://localhost:8001/asr'),
  AI4BHARAT_TTS_URL: z.string().default(process.env.AI4BHARAT_TTS_URL || 'http://localhost:8002/tts'),
  AI4BHARAT_API_KEY: z.string().optional().default(process.env.AI4BHARAT_API_KEY || ''),

  RATE_LIMIT_STANDARD_PER_MINUTE: z.string().default('120').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_AI_PER_MINUTE: z.string().default('30').transform((val) => parseInt(val, 10)),
  IDEMPOTENCY_TTL_SECONDS: z.string().default('3600').transform((val) => parseInt(val, 10))
});

export const env = envSchema.parse({
  ...process.env,
  SUPABASE_URL: rawSupabaseUrl,
  SUPABASE_ANON_KEY: rawSupabaseAnonKey,
  SUPABASE_SERVICE_ROLE_KEY: rawSupabaseServiceRoleKey,
  AI_PROVIDER: rawAiProvider,
  AI_API_KEY: rawAiApiKey
});
