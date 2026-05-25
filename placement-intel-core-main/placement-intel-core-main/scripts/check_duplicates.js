import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const env = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  const { data, error, count } = await supabase
    .from('companies')
    .select('company_id, name, short_name, category', { count: 'exact' });

  if (error) {
    console.error('Error fetching companies:', error);
    process.exit(1);
  }

  console.log('TOTAL RECORDS:', count);
  const normalized = {};
  const shortNames = {};
  for (const row of data || []) {
    const name = String(row.name || '').trim().toLowerCase();
    const shortName = String(row.short_name || '').trim().toLowerCase() || name;
    if (!name) continue;
    normalized[name] = normalized[name] || [];
    normalized[name].push(row);
    shortNames[shortName] = shortNames[shortName] || [];
    shortNames[shortName].push(row);
  }

  const duplicates = Object.entries(normalized).filter(([, rows]) => rows.length > 1);
  const uniqueCount = Object.keys(normalized).length;
  const uniqueShortCount = Object.keys(shortNames).length;
  console.log('UNIQUE COMPANY NAMES:', uniqueCount);
  console.log('UNIQUE SHORT_NAMES:', uniqueShortCount);
  console.log('DUPLICATE NAMES:', duplicates.length);
  duplicates.slice(0, 50).forEach(([name, rows]) => {
    console.log(name, 'count=', rows.length, 'ids=', rows.map(r => r.company_id).join(', '));
  });
  console.log('--- SHORT NAME GROUPS ---');
  Object.entries(shortNames).filter(([, rows]) => rows.length > 1).slice(0, 50).forEach(([shortName, rows]) => {
    console.log(shortName, 'count=', rows.length, 'names=', Array.from(new Set(rows.map(r => r.name))).join(' | '));
  });
}

checkDuplicates();
