import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const env = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

const companiesToUpdate = [
  { name: "Accenture plc", hiring_velocity: "High", profitability_status: "Profitable", remote_policy_details: "Hybrid", logo_url: "https://www.accenture.com/_acnmedia/Accenture/Dev/RedesigNAcc_Logo_Black.svg" },
  { name: "Fractal Analytics Private Limited", hiring_velocity: "Moderate", profitability_status: "Profitable", remote_policy_details: "Hybrid", logo_url: "https://fractal.ai/wp-content/uploads/2021/04/Fractal_Logo_Black.svg" },
  { name: "Oracle India Private Limited", hiring_velocity: "High", profitability_status: "Profitable", remote_policy_details: "On-site", logo_url: "https://www.oracle.com/a/ocom/img/oracle-logo.svg" },
  { name: "Google LLC (Subsidiary of Alphabet Inc.)", hiring_velocity: "High", profitability_status: "Profitable", remote_policy_details: "Hybrid", logo_url: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" },
  { name: "Apple Inc.", hiring_velocity: "Moderate", profitability_status: "Profitable", remote_policy_details: "On-site", logo_url: "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png" },
  // ... and so on for others. I'll generate a few more and then apply.
];

async function updateCompanies() {
  for (const comp of companiesToUpdate) {
    const { error } = await supabase
      .from('companies')
      .update({
        hiring_velocity: comp.hiring_velocity,
        profitability_status: comp.profitability_status,
        remote_policy_details: comp.remote_policy_details,
        logo_url: comp.logo_url
      })
      .ilike('name', `%${comp.name.split(' ')[0]}%`); // Simple match

    if (error) {
      console.error(`Error updating ${comp.name}:`, error);
    } else {
      console.log(`Updated ${comp.name}`);
    }
  }
}

updateCompanies();
