import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);
const summary = JSON.parse(fs.readFileSync('public/data/summary.json', 'utf8'));
function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function simplify(value) {
  return normalize(value).replace(/\b(inc|incorporated|ltd|limited|plc|corporation|corp|company|private|group|se|llc|technologies|technology|services|solutions|systems|india|inc\b)/g, ' ').replace(/\s+/g, ' ').trim();
}
function score(row, item) {
  const rn = normalize(row.name || '');
  const rs = normalize(row.short_name || row.name || '');
  const cn = normalize(item.name || '');
  const cs = normalize(item.short_name || item.name || '');
  if (rn === cn || rs === cs) return 100;
  if (rn === cs || rs === cn) return 95;
  if (rn.includes(cs) || cs.includes(rn)) return 90;
  if (rs.includes(cn) || cn.includes(rs)) return 85;
  if (rn.includes(cn) || cn.includes(rn)) return 80;
  const sn = simplify(rn);
  const sc = simplify(cn);
  if (sn === sc) return 75;
  if (sn.includes(sc) || sc.includes(sn)) return 70;
  return 0;
}
function findBest(row) {
  let best = null;
  let bestScore = 0;
  for (const item of summary) {
    const s = score(row, item);
    if (s > bestScore) {
      bestScore = s;
      best = item;
    }
  }
  return bestScore >= 70 ? { item: best, score: bestScore } : null;
}
(async () => {
  const { data, error } = await supabase.from('companies').select('company_id,name,short_name');
  if (error) { console.error(error); process.exit(1); }
  const rows = data || [];
  const groups = new Map();
  const unmatched = [];
  for (const row of rows) {
    const match = findBest(row);
    if (!match) {
      unmatched.push(row);
      continue;
    }
    const key = normalize(match.item.name || match.item.short_name || '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ row, score: match.score, canonical: match.item });
  }
  const duplicates = Array.from(groups.entries()).filter(([, rows]) => rows.length > 1);
  duplicates.sort((a, b) => b[1].length - a[1].length);
  console.log('TOTAL ROWS', rows.length);
  console.log('MATCHED GROUPS', groups.size);
  console.log('DUPLICATE GROUPS', duplicates.length);
  duplicates.slice(0, 50).forEach(([key, entries]) => {
    console.log('===', key, 'count=', entries.length);
    entries.forEach(e => console.log(' ', e.row.company_id, e.row.name, e.row.short_name, 'score', e.score));
  });
  console.log('UNMATCHED', unmatched.length);
  if (unmatched.length > 0) console.log('UNMATCHED IDS', unmatched.map(r => r.company_id).slice(0, 50));
})();
