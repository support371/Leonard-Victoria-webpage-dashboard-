import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const msg = 'CRITICAL ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your environment variables.';
  if (import.meta.env.PROD) {
    console.error(msg);
  } else {
    console.warn(msg);
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://MISSING_SUPABASE_URL.supabase.co',
  supabaseAnonKey || 'MISSING_ANON_KEY',
  {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
