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

function generateSummary() {
  const summary = [];
  companies.forEach((compName, index) => {
    summary.push({
      name: compName,
      short_name: compName.split(' ')[0],
      hiring_velocity: ["High", "Moderate", "Low", "Frozen"][index % 4],
      profitability_status: ["Profitable", "Break-even", "Loss-making"][index % 3],
      remote_policy_details: ["Remote", "Hybrid", "On-site"][index % 3],
      logo_url: `https://logo.clearbit.com/${compName.replace(/\s+/g, '').toLowerCase()}.com`
    });
  });
  
  const dest = 'public/data/summary.json';
  fs.writeFileSync(dest, JSON.stringify(summary, null, 2));
  console.log(`Summary generated at ${dest}`);
}

generateSummary();
