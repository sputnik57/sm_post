import { createClient } from '@supabase/supabase-js';

export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('Missing Supabase environment variables');
  }

  return createClient(url!, key!);
};