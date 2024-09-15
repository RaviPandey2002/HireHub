import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mlrcuztzocwewzkujmtf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmN1enR6b2N3ZXd6a3VqbXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5MzA5MTIsImV4cCI6MjA0MDUwNjkxMn0.JGyDm2y1_m6e7zWVJs7IwpetN24Ybzm8bmjVxIwplpw";

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabaseClient;