import fs from 'fs';
const summary = JSON.parse(fs.readFileSync('public/data/summary.json','utf8'));
const normalize = s => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
const map = {};
const shorts = {};
summary.forEach(item => {
  const n = normalize(item.name);
  const s = normalize(item.short_name || item.name);
  map[n] = (map[n] || 0) + 1;
  shorts[s] = (shorts[s] || 0) + 1;
});
console.log('summary length', summary.length);
console.log('name duplicates', Object.entries(map).filter(([k, v]) => v > 1).length);
console.log(Object.entries(map).filter(([k, v]) => v > 1).slice(0, 20));
console.log('short duplicates', Object.entries(shorts).filter(([k, v]) => v > 1).length);
console.log(Object.entries(shorts).filter(([k, v]) => v > 1).slice(0, 20));
