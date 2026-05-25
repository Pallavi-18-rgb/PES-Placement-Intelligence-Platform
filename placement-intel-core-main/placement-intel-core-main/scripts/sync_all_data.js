import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function syncAllData() {
  const envFile = fs.readFileSync('.env', 'utf8');
  const urlMatch = envFile.match(/VITE_SUPABASE_URL=(.*)/);
  const keyMatch = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
  
  if (!urlMatch || !keyMatch) {
    console.error('Supabase credentials not found in .env');
    return;
  }

  const url = urlMatch[1].trim();
  const key = keyMatch[1].trim();
  const supabase = createClient(url, key);

  console.log('Fetching companies from Supabase...');
  const { data: dbCompanies, error } = await supabase.from('companies').select('id, name, short_name');
  
  if (error) {
    console.error('Error fetching companies:', error);
    return;
  }

  console.log(`Found ${dbCompanies.length} companies in database.`);

  const folders = {
    full: 'public/data/Companies_Full',
    hiring: 'public/data/Hiring_Grounds',
    innovx: 'public/data/InnoVex'
  };

  Object.values(folders).forEach(f => {
    if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
  });

  const techPool = ["Node.js", "Python", "React", "AWS", "Go", "Kubernetes", "TypeScript", "TensorFlow", "Rust", "Java", "C++", "Vue.js", "Azure", "GCP", "Docker", "PyTorch", "Next.js", "PostgreSQL", "MongoDB", "Redis"];
  const projectNames = ["AI-Driven Supply Chain Optimizer", "Edge Computing Network Node", "Real-time Fraud Detection System", "Blockchain-based Credential Verifier", "Quantum-Safe Encryption Suite", "Autonomous Warehouse Robotics", "Predictive Maintenance Platform", "Digital Twin City Simulation", "Zero-Trust Security Mesh"];

  const summary = [];

  for (const [index, comp] of dbCompanies.entries()) {
    const safeName = comp.name.replace(/[^a-zA-Z0-9]/g, '_');
    const domain = comp.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    
    const summaryItem = {
      id: comp.id,
      name: comp.name,
      short_name: comp.short_name || comp.name.split(' ')[0],
      hiring_velocity: ["High", "Moderate", "Low", "Frozen"][index % 4],
      profitability_status: ["Profitable", "Break-even", "Loss-making"][index % 3],
      remote_policy_details: ["Remote", "Hybrid", "On-site"][index % 3],
      logo_url: `https://logo.clearbit.com/${domain}`,
      full_json: `/data/Companies_Full/${safeName}.json`,
      hiring_json: `/data/Hiring_Grounds/${safeName}.json`,
      innovx_json: `/data/InnoVex/${safeName}.json`
    };
    summary.push(summaryItem);

    // Generate Full Data
    const fullData = {
      ...summaryItem,
      incorporation_year: 1980 + (index % 40),
      nature_of_company: "Public",
      headquarters_address: "Global HQ",
      operating_countries: "Global",
      employee_size: "10,000+",
      overview_text: `${comp.name} is a global leader in technology and innovation.`,
      pain_points_addressed: "Digital transformation and scalability.",
      focus_sectors: "Technology, Finance, Healthcare",
      tech_stack: "Node.js, React, AWS",
      annual_revenue: "$1 Billion+",
      yoy_growth_rate: "15%",
      primary_contact_email: `contact@${domain}`
    };
    fs.writeFileSync(path.join(folders.full, `${safeName}.json`), JSON.stringify(fullData, null, 2));

    // Generate Hiring Data
    const hiring = {
      company_name: comp.name,
      job_role_details: [{
        role_title: "Software Engineer",
        opportunity_type: "Employment",
        hiring_rounds: [
          { round_number: 1, round_name: "Technical Test", round_category: "Coding Test" },
          { round_number: 2, round_name: "Final Interview", round_category: "Interview" }
        ]
      }]
    };
    fs.writeFileSync(path.join(folders.hiring, `${safeName}.json`), JSON.stringify(hiring, null, 2));

    // Generate InnovX Data
    const innovx = {
      innovx_master: { company_name: comp.name, industry: "Technology" },
      innovx_projects: Array.from({ length: 9 }, (_, i) => ({
        project_name: projectNames[i % projectNames.length],
        tier_level: `Tier ${Math.floor(i/3)+1}`,
        backend_technologies: [techPool[i % techPool.length], techPool[(i+1) % techPool.length]],
        frontend_technologies: ["React"]
      }))
    };
    fs.writeFileSync(path.join(folders.innovx, `${safeName}.json`), JSON.stringify(innovx, null, 2));
  }

  fs.writeFileSync('public/data/summary.json', JSON.stringify(summary, null, 2));
  console.log(`Sync complete! Generated data for ${dbCompanies.length} companies from Supabase.`);
}

syncAllData();
