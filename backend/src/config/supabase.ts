import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Server-side privileged client (for background sync, audit logging, seed data)
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Factory to create a user-scoped client that forwards the user's JWT token for RLS
export const createScopedSupabaseClient = (jwtToken: string): SupabaseClient => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
