import fs from 'fs';
import path from 'path';

// Read .env file to get supabase variables
const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf8');
const SUPABASE_URL = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const SUPABASE_KEY = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function run() {
  console.log("Fetching all companies...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/companies?select=company_id,name,short_name,logo_url`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  console.log(`Fetched ${data.length} companies from Supabase.`);
  
  const names = data.map(d => (d.name || '').trim().toLowerCase());
  const uniqueNames = new Set(names);
  console.log(`Unique names count: ${uniqueNames.size}`);

  const shortNames = data.map(d => (d.short_name || '').trim().toLowerCase());
  const uniqueShortNames = new Set(shortNames);
  console.log(`Unique short_name count: ${uniqueShortNames.size}`);

  // Fetch tables metadata using swagger/openapi from supabase if possible, or try querying 'consolidation'
  const resConsolidation = await fetch(`${SUPABASE_URL}/rest/v1/consolidation?select=company_id,name,logo_url&limit=5`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  console.log(`Consolidation table response status: ${resConsolidation.status}`);
  if (resConsolidation.ok) {
    console.log("Consolidation data:", await resConsolidation.json());
  }

  // Also query 'company' (singular) to see if it exists
  const resCompany = await fetch(`${SUPABASE_URL}/rest/v1/company?select=id,name,logo_url&limit=5`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  console.log(`Company table response status: ${resCompany.status}`);
  if (resCompany.ok) {
    console.log("Company data:", await resCompany.json());
  }
}
run();
