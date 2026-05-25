import fs from 'fs';

function parseCSV(text) {
  const result = [];
  let row = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '"') {
      if (inQuotes && text[i+1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(current.replace(/\r$/, ''));
      result.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current || text[text.length-1] === ',') {
    row.push(current.replace(/\r$/, ''));
  }
  if (row.length > 0) result.push(row);
  
  return result;
}

const csvText = fs.readFileSync('C:\\Users\\PALLAVI N\\OneDrive\\Documents\\INTERNSHIP\\pytest_project\\Consolidation(Final).csv', 'utf8');
const rows = parseCSV(csvText);

const headers = rows[0];
const data = rows.slice(1).map(row => {
  const obj = {};
  headers.forEach((h, i) => {
    if (h) {
      obj[h.trim()] = row[i];
    }
  });
  return obj;
});

const cleanData = data.filter(d => d.name).map((d) => {
  // Clean up hiring velocity
  let hv = 'Moderate';
  const rawHv = (d.hiring_velocity || '').toLowerCase();
  if (rawHv.includes('high') || rawHv.includes('fast') || parseInt(rawHv) > 1000) hv = 'High';
  else if (rawHv.includes('low') || rawHv.includes('slow') || rawHv.includes('frozen')) hv = 'Low';

  // Clean up profitability
  let prof = 'Profitable';
  const rawProf = (d.profitability_status || '').toLowerCase();
  if (rawProf.includes('loss') || rawProf.includes('burn')) prof = 'Loss-making';
  else if (rawProf.includes('break') || rawProf.includes('even')) prof = 'Break-even';

  // Clean up remote policy
  let remote = 'On-site';
  const rawRem = (d.remote_policy_details || '').toLowerCase();
  if (rawRem.includes('hybrid')) remote = 'Hybrid';
  else if (rawRem.includes('remote') || rawRem.includes('wfh') || rawRem.includes('flexible')) remote = 'Remote';

  return {
    ...d,
    company_id: d.Column1 || d.company_id || d.id || '',
    hiring_velocity: hv,
    profitability_status: prof,
    remote_policy_details: remote,
  };
});

fs.writeFileSync('C:\\Users\\PALLAVI N\\OneDrive\\Documents\\INTERNSHIP\\placement-intel-core-main\\src\\data\\consolidation.json', JSON.stringify(cleanData, null, 2));
console.log('Successfully created consolidation.json with ' + cleanData.length + ' records.');
