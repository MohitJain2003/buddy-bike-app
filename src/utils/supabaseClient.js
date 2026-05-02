import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vyosnvoqqdreonojihcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_wW_mJdQCU3ErplTFPqH5Nw_ZoXMui63";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
