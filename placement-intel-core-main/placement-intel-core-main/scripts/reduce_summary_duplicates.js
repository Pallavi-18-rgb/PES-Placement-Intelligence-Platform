import fs from 'fs';
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

function findMatch(row) {
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
  const { data, error } = await supabase.from('companies').select('company_id,name,short_name,category');
  if (error) {
    console.error('Fetch error:', error);
    process.exit(1);
  }
  const rows = data || [];
  const groups = new Map();
  const unmatched = [];

  for (const row of rows) {
    const match = findMatch(row);
    if (!match) {
      unmatched.push(row);
      continue;
    }
    const key = normalize(match.item.name || match.item.short_name || '');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ row, score: match.score });
  }

  let deletedCount = 0;
  const deleteFailures = [];

  for (const [key, entries] of groups.entries()) {
    if (entries.length <= 1) continue;
    entries.sort((a, b) => b.score - a.score || Number(a.row.company_id) - Number(b.row.company_id));
    const remaining = new Map(entries.map(e => [e.row.company_id, e]));
    const preferKeep = entries[0].row.company_id;

    const tryDelete = async id => {
      const { error: deleteError } = await supabase.from('companies').delete().eq('company_id', id);
      if (deleteError) {
        deleteFailures.push({ company_id: id, error: deleteError.message || deleteError });
        return false;
      }
      deletedCount += 1;
      remaining.delete(id);
      return true;
    };

    for (let i = entries.length - 1; i >= 0 && remaining.size > 1; i -= 1) {
      const id = entries[i].row.company_id;
      if (id === preferKeep) continue;
      await tryDelete(id);
    }

    if (remaining.size > 1) {
      const keepId = Array.from(remaining.keys()).sort((a, b) => {
        const sa = remaining.get(a).score;
        const sb = remaining.get(b).score;
        return sb - sa;
      })[0];
      for (const id of Array.from(remaining.keys())) {
        if (id === keepId) continue;
        await tryDelete(id);
      }
    }
  }

  const unmatchedResults = [];
  for (const row of unmatched) {
    const { error: deleteError } = await supabase.from('companies').delete().eq('company_id', row.company_id);
    if (deleteError) {
      deleteFailures.push({ company_id: row.company_id, error: deleteError.message || deleteError });
      unmatchedResults.push({ company_id: row.company_id, status: 'failed' });
    } else {
      deletedCount += 1;
      unmatchedResults.push({ company_id: row.company_id, status: 'deleted' });
    }
  }

  console.log('Total rows initially:', rows.length);
  console.log('Duplicate canonical groups:', Array.from(groups.values()).filter(g => g.length > 1).length);
  console.log('Deleted duplicates:', deletedCount);
  console.log('Unmatched deleted:', unmatchedResults.filter(r => r.status === 'deleted').length);
  console.log('Failed delete attempts:', deleteFailures.length);
  if (deleteFailures.length > 0) {
    console.log(JSON.stringify(deleteFailures, null, 2));
  }
})();
