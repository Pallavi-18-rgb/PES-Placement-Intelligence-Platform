import fs from 'fs';
import path from 'path';

const companies = [
  "Accenture", "Fractal Analytics", "Oracle India", "Google LLC", "Apple Inc.", 
  "Mitsubishi UFJ", "Commonwealth Bank", "KALVI CAREER", "Larsen & Toubro", 
  "Tata Consultancy Services", "Infosys Limited", "Cloudera", "Guidewire", 
  "Amazon.com", "Llama Logisol", "Swiggy", "Leap Finance", "Cisco Systems", 
  "Volvo Group", "Amadeus", "NielsenIQ", "Snowflake", "Palantir", 
  "Oracle Financial", "IBM", "Barclays", "Schneider Electric", 
  "Blink Commerce", "Zerodha", "Myntra", "Nurix", "Citigroup", 
  "ZS Associates", "FLAM Gaming", "SAP Labs", "Xperi", "Consilio", 
  "BT Group", "Capgemini", "BNY Mellon", "Fidelity", "JPMorgan", 
  "Airbus", "Wells Fargo", "Atlassian", "Nutanix", "DeepMind", 
  "Akamai", "Adobe", "Genpact", "Uber", "Dell", "Even Healthcare", 
  "Groww", "MintAir", "OpenAI", "Skyhigh Security", "SpaceX", 
  "Walmart", "Zepto", "DevRev", "Increff", "MoveInSync", "NVIDIA", 
  "ServiceNow", "Tredence", "CME Group", "HCL", "Freshworks", "HP", 
  "Philips", "Warner Bros", "HyperVerge", "Motorq", "Autodesk", "EA", 
  "Morgan Stanley", "Microsoft", "Darwinbox", "Epifi", "Juspay", 
  "Flipkart", "Optum", "PayPal", "Bajaj Finserv", "Bain", 
  "Proactively", "Samsung PRISM", "Acko", "Robert Bosch", 
  "Concentrix", "Dunzo", "Byju's", "Cleartrip", "Cognizant", 
  "DXC", "PhysicsWallah", "Udemy", "NTT DATA", "Virtusa", "upGrad", 
  "ZS Associates", "Wipro", "Paytm Money", "Hexagon", "INDmoney", 
  "Tech Mahindra", "Simplilearn", "BigBasket", "Ecom Express", 
  "Kyndryl", "MobiKwik", "Shadowfax", "Rupeek", "3i Infotech", 
  "BharatPe", "HighRadius"
];

const folders = {
  full: 'data/Companies_Full',
  hiring: 'data/Hiring_Grounds',
  innovx: 'data/InnoVex'
};

// Create folders if they don't exist
Object.values(folders).forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

function getLogo(name) {
  const n = name.toLowerCase();
  if (n.includes('accenture')) return "https://www.accenture.com/_acnmedia/Accenture/Dev/RedesigNAcc_Logo_Black.svg";
  if (n.includes('google')) return "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png";
  if (n.includes('apple')) return "https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png";
  if (n.includes('microsoft')) return "https://www.microsoft.com/en-us/cms/api/am/image?id=RE4OBCq";
  if (n.includes('amazon')) return "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg";
  return `https://logo.clearbit.com/${n.replace(/\s+/g, '')}.com`; // Fallback
}

function generateData() {
  companies.forEach((compName, index) => {
    const safeName = compName.replace(/[^a-zA-Z0-9]/g, '_');
    
    // 1. Short Schema
    const shortSchema = {
      company_id: 1000 + index,
      name: compName,
      short_name: compName.split(' ')[0],
      logo_url: getLogo(compName),
      category: index % 4 === 0 ? "Tech Giants" : index % 4 === 1 ? "Product Companies" : index % 4 === 2 ? "Service Companies" : "Startups / Scale-ups",
      operating_countries: "Global",
      office_locations: "Bangalore, India; New York, USA",
      employee_size: "10,000+",
      yoy_growth_rate: "15%",
      hiring_velocity: ["High", "Moderate", "Low", "Frozen"][index % 4],
      profitability_status: ["Profitable", "Break-even", "Loss-making"][index % 3],
      remote_policy_details: ["Remote", "Hybrid", "On-site"][index % 3]
    };
    fs.writeFileSync(path.join('data', `${safeName}_short.json`), JSON.stringify(shortSchema, null, 2));

    // 2. Full Schema (Simulating 163 fields with a generic structure)
    const fullSchema = { ...shortSchema };
    // Adding dummy 163 fields
    for (let i = 1; i <= 150; i++) {
        fullSchema[`param_${i}`] = `Detailed data point ${i} for ${compName}`;
    }
    fs.writeFileSync(path.join(folders.full, `${safeName}.json`), JSON.stringify(fullSchema, null, 2));

    // 3. Hiring Grounds
    const hiring = {
      company_name: compName,
      job_role_details: [
        {
          opportunity_type: "Employment",
          role_title: "Software Development Engineer",
          role_category: "SDE",
          job_description: `Building scalable systems at ${compName}.`,
          compensation: "CTC",
          ctc_or_stipend: 1200000,
          hiring_rounds: [
            { round_number: 1, round_name: "OA", round_category: "Coding Test", evaluation_type: "Technical", assessment_mode: "Online", skill_sets: [{ skill_set_code: "COD", typical_questions: "Q1; Q2; Q3" }] },
            { round_number: 2, round_name: "Technical Interview", round_category: "Interview", evaluation_type: "Technical", assessment_mode: "Online", skill_sets: [{ skill_set_code: "DSA", typical_questions: "Q1; Q2; Q3" }] }
          ]
        }
      ]
    };
    fs.writeFileSync(path.join(folders.hiring, `${safeName}.json`), JSON.stringify(hiring, null, 2));

    // 4. InnovX
    const innovx = {
      innovx_master: { company_name: compName, industry: "Technology" },
      innovx_projects: Array.from({ length: 9 }, (_, i) => ({
        project_name: `Project ${i+1}`,
        tier_level: `Tier ${Math.floor(i/3)+1}`,
        backend_technologies: ["Node.js", "Python"],
        frontend_technologies: ["React"]
      }))
    };
    fs.writeFileSync(path.join(folders.innovx, `${safeName}.json`), JSON.stringify(innovx, null, 2));
  });
  console.log(`Successfully generated data for ${companies.length} companies.`);
}

generateData();
