import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabaseClient;