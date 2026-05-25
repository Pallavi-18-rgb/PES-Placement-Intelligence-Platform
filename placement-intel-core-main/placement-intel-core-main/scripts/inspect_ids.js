import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);
(async () => {
  const ids = [1155, 1009, 1048, 1068];
  const { data, error } = await supabase.from('companies').select('company_id,name,short_name,category').in('company_id', ids);
  if (error) {
    console.error('ERROR', error);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
})();
