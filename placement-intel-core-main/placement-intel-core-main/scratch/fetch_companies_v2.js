import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const env = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompanies() {
  const { data, count, error } = await supabase
    .from('companies')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total companies: ${count}`);
  if (data && data.length > 0) {
    console.log('Sample data (first company):', JSON.stringify(data[0], null, 2));
  }
}

checkCompanies();
