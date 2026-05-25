import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "public-anon-key";

let supabaseClient;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials not set; using local JSON fallback.");
  const dummyError = new Error('Dummy Supabase – no credentials set');
  const dummyQuery = {
    select: () => dummyQuery,
    eq: () => dummyQuery,
    single: () => Promise.resolve({ data: null, error: dummyError }),
    then: (cb, eb) => Promise.resolve({ data: null, error: dummyError }).then(cb, eb),
  };
  supabaseClient = { from: () => dummyQuery };
} else {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseClient;
