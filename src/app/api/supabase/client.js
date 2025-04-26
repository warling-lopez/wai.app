import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    progress.env.SUPABASE_URL, 
    progress.env.SUPABASE_KEY
);
