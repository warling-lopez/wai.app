import { createClient } from "@supabase/supabase-js";

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
