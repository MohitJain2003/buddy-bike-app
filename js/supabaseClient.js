const { createClient } = supabase;

const supabaseClient = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
