import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded credentials if environment variables are not populated
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vyosnvoqqdreonojihcm.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_wW_mJdQCU3ErplTFPqH5Nw_ZoXMui63";

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing. ' +
    'Falling back to default credentials.'
  );
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
