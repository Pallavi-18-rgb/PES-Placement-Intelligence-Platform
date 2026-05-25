import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking consolidation table...');
  const res1 = await supabase.from('consolidation').select('*').limit(5);
  console.log('consolidation table:', res1.error ? res1.error.message : `Found ${res1.data?.length} rows. keys: ${res1.data?.[0] ? Object.keys(res1.data[0]).join(', ') : 'none'}`);

  console.log('Checking consolidation_sheet table...');
  const res2 = await supabase.from('consolidation_sheet').select('*').limit(5);
  console.log('consolidation_sheet table:', res2.error ? res2.error.message : `Found ${res2.data?.length} rows. keys: ${res2.data?.[0] ? Object.keys(res2.data[0]).join(', ') : 'none'}`);
  
  console.log('Checking companies table count...');
  const res3 = await supabase.from('companies').select('name');
  if (res3.data) {
     const names = res3.data.map(d => d.name).filter(Boolean);
     const uniqueNames = new Set(names.map(n => n.trim().toLowerCase()));
     console.log(`Total companies: ${names.length}, Unique lowercase names: ${uniqueNames.size}`);
  }
}
check();
