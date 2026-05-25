import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const env = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function updateDb() {
  console.log("Starting DB update...");
  for (let i = 0; i < companies.length; i++) {
    const name = companies[i];
    const updateData = {
      hiring_velocity: ["High", "Moderate", "Low", "Frozen"][i % 4],
      profitability_status: ["Profitable", "Break-even", "Loss-making"][i % 3],
      remote_policy_details: ["Remote", "Hybrid", "On-site"][i % 3],
      logo_url: `https://logo.clearbit.com/${name.replace(/\s+/g, '').toLowerCase()}.com`
    };

    const { error } = await supabase
      .from('companies')
      .update(updateData)
      .ilike('name', `%${name.split(' ')[0]}%`);

    if (error) {
      if (error.message.includes('column')) {
         console.warn(`Skipping ${name}: Columns missing. Please run SQL migration.`);
         break; // No point continuing if schema is wrong
      }
      console.error(`Error updating ${name}:`, error.message);
    } else {
      console.log(`Updated ${name}`);
    }
  }
}

updateDb();
