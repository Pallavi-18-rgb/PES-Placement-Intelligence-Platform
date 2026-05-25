import fs from 'fs';
import path from 'path';

// Full list of 118 company names (extracted from generate_118_companies.js)
const companies = [
  "Accenture", "Fractal Analytics", "Oracle India", "Google LLC", "Apple Inc.", "Mitsubishi UFJ", "Commonwealth Bank", "KALVI CAREER",
  "Larsen & Toubro", "Tata Consultancy Services", "Infosys Limited", "Cloudera", "Guidewire", "Amazon.com", "Llama Logisol", "Swiggy",
  "Leap Finance", "Cisco Systems", "Volvo Group", "Amadeus", "NielsenIQ", "Snowflake", "Palantir", "Oracle Financial", "IBM", "Barclays",
  "Schneider Electric", "Blink Commerce", "Zerodha", "Myntra", "Nurix", "Citigroup", "ZS Associates", "FLAM Gaming", "SAP Labs", "Xperi",
  "Consilio", "BT Group", "Capgemini", "BNY Mellon", "Fidelity", "JPMorgan", "Airbus", "Wells Fargo", "Atlassian", "Nutanix",
  "DeepMind", "Akamai", "Adobe", "Genpact", "Uber", "Dell", "Even Healthcare", "Groww", "MintAir", "OpenAI",
  "Skyhigh Security", "SpaceX", "Walmart", "Zepto", "DevRev", "Increff", "MoveInSync", "NVIDIA", "ServiceNow", "Tredence",
  "CME Group", "HCL", "Freshworks", "HP", "Philips", "Warner Bros", "HyperVerge", "Motorq", "Autodesk", "EA",
  "Morgan Stanley", "Microsoft", "Darwinbox", "Epifi", "Juspay", "Flipkart", "Optum", "PayPal", "Bajaj Finserv",
  "Bain", "Proactively", "Samsung PRISM", "Acko", "Robert Bosch", "Concentrix", "Dunzo", "Byju's", "Cleartrip", "Cognizant",
  "DXC", "PhysicsWallah", "Udemy", "NTT DATA", "Virtusa", "upGrad", "Wipro", "Paytm Money", "Hexagon", "INDmoney",
  "Tech Mahindra", "Simplilearn", "BigBasket", "Ecom Express", "Kyndryl", "MobiKwik", "Shadowfax", "Rupeek", "3i Infotech", "BharatPe", "HighRadius"
];

const folders = {
  full: 'public/data/Companies_Full',
  hiring: 'public/data/Hiring_Grounds',
  innovx: 'public/data/InnoVex'
};

// Ensure output folders exist
Object.values(folders).forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

function getLogo(name) {
  const n = name.toLowerCase();
  const domainMap = {
    'accenture': 'accenture.com',
    'google': 'google.com',
    'apple': 'apple.com',
    'microsoft': 'microsoft.com',
    'amazon': 'amazon.com',
    'atlassian': 'atlassian.com',
    'meta': 'meta.com',
    'facebook': 'meta.com',
    'netflix': 'netflix.com',
    'oracle': 'oracle.com',
    'tata consultancy': 'tcs.com',
    'infosys': 'infosys.com',
    'wipro': 'wipro.com',
    'hcl': 'hcltech.com',
    'capgemini': 'capgemini.com',
    'ibm': 'ibm.com',
    'cisco': 'cisco.com',
    'uber': 'uber.com',
    'adobe': 'adobe.com',
    'nvidia': 'nvidia.com',
    'sap': 'sap.com',
    'salesforce': 'salesforce.com',
    'walmart': 'walmart.com',
    'jpmorgan': 'jpmorgan.com',
    'goldman': 'goldmansachs.com',
    'morgan stanley': 'morganstanley.com',
    'barclays': 'barclays.com',
    'fidelity': 'fidelity.com',
    'wells fargo': 'wellsfargo.com',
    'citigroup': 'citi.com',
    'bny mellon': 'bnymellon.com',
    'fidelity': 'fidelity.com',
    'swiggy': 'swiggy.com',
    'zomato': 'zomato.com',
    'flipkart': 'flipkart.com',
    'zerodha': 'zerodha.com',
    'paytm': 'paytm.com',
    'ola': 'olacabs.com',
    'freshworks': 'freshworks.com',
    'byju': 'byjus.com',
    'unacademy': 'unacademy.com',
    'cred': 'cred.club',
    'delivery': 'delhivery.com',
    'meesho': 'meesho.com',
    'nykaa': 'nykaa.com',
    'policybazaar': 'policybazaar.com',
    'larsen': 'larsentoubro.com',
    'mahindra': 'mahindra.com',
    'reliance': 'reliance.com',
    'airtel': 'airtel.in',
    'vi ': 'myvi.in',
    'tata': 'tata.com'
  };

  for (const [key, domain] of Object.entries(domainMap)) {
    if (n.includes(key)) return `https://logo.clearbit.com/${domain}`;
  }

  const domain = n.split(' ')[0].replace(/[^a-z0-9]/g, '') + '.com';
  return `https://logo.clearbit.com/${domain}`;
}

// Pools for random data generation
const techPool = ["Node.js", "Python", "React", "AWS", "Go", "Kubernetes", "TypeScript", "TensorFlow", "Rust", "Java", "C++", "Vue.js", "Azure", "GCP", "Docker", "PyTorch", "Next.js", "PostgreSQL", "MongoDB", "Redis"];
const projectNames = [
  "AI-Driven Supply Chain Optimizer",
  "Edge Computing Network Node",
  "Real-time Fraud Detection System",
  "Blockchain-based Credential Verifier",
  "Quantum-Safe Encryption Suite",
  "Autonomous Warehouse Robotics",
  "Predictive Maintenance Platform",
  "Digital Twin City Simulation",
  "Zero-Trust Security Mesh"
];

const summary = [];

companies.forEach((compName, index) => {
  const safeName = `${index}_${compName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const domain = compName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

  const summaryItem = {
    id: index + 1000,
    name: compName,
    short_name: compName.split(' ')[0],
    hiring_velocity: ["High", "Moderate", "Low", "Frozen"][index % 4],
    profitability_status: ["Profitable", "Break-even", "Loss-making"][index % 3],
    remote_policy_details: ["Remote", "Hybrid", "On-site"][index % 3],
    logo_url: getLogo(compName),
    full_json: `/data/Companies_Full/${safeName}.json`,
    hiring_json: `/data/Hiring_Grounds/${safeName}.json`,
    innovx_json: `/data/InnoVex/${safeName}.json`
  };
  summary.push(summaryItem);

  // ---------- Full Data ----------
  const fullData = {
    ...summaryItem,
    incorporation_year: 1980 + (index % 40),
    nature_of_company: "Public",
    headquarters_address: "Global HQ",
    operating_countries: "Global",
    office_count: 50 + (index % 500),
    office_locations: "Bangalore, India; New York, USA; London, UK",
    employee_size: (10000 + index * 5000).toLocaleString() + " employees",
    overview_text: `${compName} is a global leader in the ${techPool[index % techPool.length]} ecosystem.`,
    pain_points_addressed: "Digital transformation and scalability.",
    focus_sectors: "Technology, Finance, Healthcare",
    tech_stack: `${techPool[index % techPool.length]}, ${techPool[(index+1) % techPool.length]}, ${techPool[(index+2) % techPool.length]}`,
    annual_revenue: `$${(index + 1) * 1} Billion+`,
    yoy_growth_rate: "15%",
    primary_contact_email: `contact@${domain}`
  };
  fs.writeFileSync(path.join(folders.full, `${safeName}.json`), JSON.stringify(fullData, null, 2));

  // ---------- Hiring Data ----------
  const hiring = {
    company_name: compName,
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

  // ---------- InnovX Data ----------
  const innovx = {
    innovx_master: { company_name: compName, industry: "Technology" },
    innovx_projects: Array.from({ length: 9 }, (_, i) => ({
      project_name: projectNames[i % projectNames.length],
      tier_level: `Tier ${Math.floor(i/3)+1}`,
      backend_technologies: [techPool[i % techPool.length], techPool[(i+1) % techPool.length]],
      frontend_technologies: ["React"]
    }))
  };
  fs.writeFileSync(path.join(folders.innovx, `${safeName}.json`), JSON.stringify(innovx, null, 2));
});

// Write summary file
fs.writeFileSync('public/data/summary.json', JSON.stringify(summary, null, 2));
console.log(`Generated data for ${companies.length} companies.`);
