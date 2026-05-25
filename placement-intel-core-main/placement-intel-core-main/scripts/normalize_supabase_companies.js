import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envPath = path.resolve('.env');
const env = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

const summaryPath = path.resolve('public/data/summary.json');
const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[’'"“”]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function simplifyName(value) {
  const normalized = normalize(value);
  return normalized
    .replace(/\b(inc|incorporated|ltd|limited|plc|corporation|corp|company|private|group|se|llc|technologies|technology|services|solutions|systems|india|inc\b)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreMatch(row, canonical) {
  const rowName = normalize(row.name || '');
  const rowShort = normalize(row.short_name || row.name || '');
  const canonicalName = normalize(canonical.name || '');
  const canonicalShort = normalize(canonical.short_name || canonical.name || '');
  if (rowShort === canonicalShort || rowName === canonicalName) return 100;
  if (rowName === canonicalShort || rowShort === canonicalName) return 95;
  if (rowName.includes(canonicalShort) || canonicalShort.includes(rowName)) return 90;
  if (rowShort.includes(canonicalName) || canonicalName.includes(rowShort)) return 85;
  if (rowName.includes(canonicalName) || canonicalName.includes(rowName)) return 80;
  const simpleRowName = simplifyName(rowName);
  const simpleCanonicalName = simplifyName(canonicalName);
  if (simpleRowName === simpleCanonicalName) return 75;
  if (simpleRowName.includes(simpleCanonicalName) || simpleCanonicalName.includes(simpleRowName)) return 70;
  return 0;
}

function findBestCanonical(row) {
  const exactName = summaryData.find(item => normalize(item.name || '') === normalize(row.name || ''));
  if (exactName) return exactName;
  const exactShort = summaryData.find(item => normalize(item.short_name || item.name || '') === normalize(row.short_name || row.name || ''));
  if (exactShort) return exactShort;
  let best = null;
  let bestScore = 0;
  for (const item of summaryData) {
    const score = scoreMatch(row, item);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore >= 70 ? best : null;
}

function chooseBestRow(rows, canonical) {
  rows.sort((a, b) => {
    const scoreA = scoreMatch(a, canonical);
    const scoreB = scoreMatch(b, canonical);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return Number(a.company_id || 0) - Number(b.company_id || 0);
  });
  return rows[0];
}

async function loadFullJson(item) {
  if (!item.full_json) return {};
  const fullPath = path.resolve(item.full_json.replace(/^\//, ''));
  if (!fs.existsSync(fullPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (err) {
    console.warn('Failed to parse full JSON for', item.name, err.message);
    return {};
  }
}

(async () => {
  console.log('Loading current Supabase companies...');
  const { data, error } = await supabase.from('companies').select('*');
  if (error) {
    console.error('Supabase fetch error:', error);
    process.exit(1);
  }
  const rows = data || [];
  console.log('Supabase total rows:', rows.length);

  const availableColumns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const allowedColumns = new Set(availableColumns);

  const groups = new Map();
  const unmatchedRows = [];

  for (const row of rows) {
    const canonical = findBestCanonical(row);
    if (!canonical) {
      unmatchedRows.push(row);
      continue;
    }
    const key = normalize(canonical.name || canonical.short_name || '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const missingCanonicals = [];
  const chosenRows = new Map();
  const deleteIds = [];

  for (const item of summaryData) {
    const key = normalize(item.name || item.short_name || '');
    const groupRows = groups.get(key) || [];
    if (groupRows.length === 0) {
      missingCanonicals.push(item);
      continue;
    }
    const best = chooseBestRow(groupRows, item);
    chosenRows.set(key, best);
    for (const row of groupRows) {
      if (row.company_id !== best.company_id) deleteIds.push(row.company_id);
    }
  }

  console.log('Canonical matches:', chosenRows.size);
  console.log('Missing canonical companies:', missingCanonicals.length);
  console.log('Duplicate rows to delete:', deleteIds.length);
  console.log('Unmatched rows:', unmatchedRows.length);

  if (deleteIds.length > 0) {
    console.log('Deleting duplicate company rows one by one...');
    const failedDeletes = [];
    for (const id of deleteIds) {
      const { error: deleteError } = await supabase.from('companies').delete().eq('company_id', id);
      if (deleteError) {
        console.warn(`Could not delete duplicate company_id=${id}:`, deleteError.message || deleteError);
        failedDeletes.push(id);
      }
    }
    if (failedDeletes.length > 0) {
      console.warn('Some duplicate rows could not be deleted due to foreign key constraints. Preserving them for now:', failedDeletes.length);
    }
  }

  for (const [key, row] of chosenRows.entries()) {
    const canonical = summaryData.find(item => normalize(item.short_name || item.name || '') === key);
    if (!canonical) continue;
    const fullData = await loadFullJson(canonical);
    const payload = {};
    const source = { ...fullData, ...canonical };
    for (const [k, v] of Object.entries(source)) {
      if (allowedColumns.has(k) && k !== 'company_id') {
        payload[k] = v;
      }
    }
    if (Object.keys(payload).length > 0) {
      const { error: updateError } = await supabase
        .from('companies')
        .update(payload)
        .eq('company_id', row.company_id);
      if (updateError) {
        console.error('Update error for', canonical.name, updateError);
      }
    }
  }

  if (missingCanonicals.length > 0) {
    console.log('Inserting missing canonical companies...');
    for (const item of missingCanonicals) {
      const fullData = await loadFullJson(item);
      const payload = {};
      const source = { ...fullData, ...item };
      for (const [k, v] of Object.entries(source)) {
        if (allowedColumns.has(k) && k !== 'company_id') {
          payload[k] = v;
        }
      }
      const { error: insertError } = await supabase.from('companies').insert([payload]);
      if (insertError) {
        console.error('Insert error for', item.name, insertError);
      }
    }
  }

  console.log('Normalization complete.');
  console.log('Run the check script again to confirm the final row count.');
})();
