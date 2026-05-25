import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompanies() {
  const { data, count, error } = await supabase
    .from('companies')
    .select('name', { count: 'exact' });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total companies: ${count}`);
  console.log('Sample names:', data.slice(0, 5).map(c => c.name));
}

checkCompanies();
