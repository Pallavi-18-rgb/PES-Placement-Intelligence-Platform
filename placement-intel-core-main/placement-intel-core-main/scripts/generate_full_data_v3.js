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
  "Wipro", "Paytm Money", "Hexagon", "INDmoney", 
  "Tech Mahindra", "Simplilearn", "BigBasket", "Ecom Express", 
  "Kyndryl", "MobiKwik", "Shadowfax", "Rupeek", "3i Infotech", 
  "BharatPe", "HighRadius"
];

const folders = {
  full: 'public/data/Companies_Full',
  hiring: 'public/data/Hiring_Grounds',
  innovx: 'public/data/InnoVex'
};

// Create folders if they don't exist
Object.values(folders).forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

const techPool = ["Node.js", "Python", "React", "AWS", "Go", "Kubernetes", "TypeScript", "TensorFlow", "Rust", "Java", "C++", "Vue.js", "Azure", "GCP", "Docker", "PyTorch", "Next.js", "PostgreSQL", "MongoDB", "Redis"];
const sectorsPool = ["Fintech", "Healthtech", "Enterprise SaaS", "Automotive", "E-commerce", "Deep Learning", "Cloud Infrastructure", "Cybersecurity", "Consumer Tech", "EdTech"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateData() {
  companies.forEach((compName, index) => {
    const safeName = compName.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Full Schema with varied data
    const fullSchema = {
      name: compName,
      short_name: compName.split(' ')[0],
      category: index % 4 === 0 ? "Tech Giants" : index % 4 === 1 ? "Product Companies" : index % 4 === 2 ? "Service Companies" : "Startups / Scale-ups",
      incorporation_year: 1980 + (index % 40),
      nature_of_company: index % 2 === 0 ? "Public" : "Private",
      headquarters_address: getRandom(["San Francisco, USA", "Bangalore, India", "London, UK", "New York, USA", "Dublin, Ireland", "Tokyo, Japan"]),
      operating_countries: "Global",
      office_count: 50 + (index % 500),
      office_locations: "Bangalore, India; New York, USA; London, UK",
      employee_size: (10000 + (index * 5000)).toLocaleString() + " employees",
      overview_text: `${compName} is a leader in the ${getRandom(sectorsPool)} space, driving innovation through its core focus on ${getRandomSubset(techPool, 3).join(', ')}.`,
      history_timeline: "Founded in " + (1980 + (index % 40)) + ", reached unicorn status in 5 years, IPO in 10 years.",
      recent_news: "Recently announced a major partnership for AI integration.",
      
      pain_points_addressed: "Complex workflow automation and data scalability.",
      focus_sectors: getRandomSubset(sectorsPool, 2).join(', '),
      offerings_description: "Enterprise grade solutions and consulting.",
      top_customers: "Fortune 500 companies worldwide.",
      core_value_proposition: "Innovation at scale with reliability.",
      unique_differentiators: "Patented AI algorithms and global distribution.",
      competitive_advantages: "Deep industry expertise and talent density.",
      weaknesses_gaps: "Legacy system migration and emerging market agility.",
      key_challenges_needs: "Talent retention in competitive tech markets.",
      key_competitors: "Industry leaders in same sector.",
      tam: "$" + (index + 50) + " Billion",
      sam: "$" + (index + 20) + " Billion",
      som: "$" + (index + 5) + " Billion",
      market_share_percentage: (index % 25) + "%",
      go_to_market_strategy: "Direct B2B sales and strategic partnerships.",
      strategic_priorities: "AI-first products and sustainability.",
      future_projections: "Expected 20% YoY growth.",
      
      work_culture_summary: "Collaborative, meritocratic, and innovation-driven.",
      hiring_velocity: ["High", "Moderate", "Low", "Frozen"][index % 4],
      employee_turnover: (10 + (index % 10)) + "%",
      avg_retention_tenure: (3 + (index % 5)) + " years",
      manager_quality: "4.2/5 based on internal surveys.",
      psychological_safety: "High, encourages experimentation.",
      feedback_culture: "Continuous feedback loops and OKRs.",
      diversity_metrics: "40% female representation in tech.",
      diversity_inclusion_score: "85/100",
      ethical_standards: "Strict compliance and ESG focus.",
      layoff_history: "None in the last 10 years.",
      burnout_risk: "Low, emphasis on work-life balance.",
      mission_clarity: "To empower every person and every organization.",
      
      training_spend: "$2,000 per employee annually.",
      onboarding_quality: "Structured 2-week immersion program.",
      learning_culture: "Strong focus on upskilling and certifications.",
      exposure_quality: "High, working on global scale products.",
      mentorship_availability: "Formal mentorship programs available.",
      internal_mobility: "Flexible, encouraging cross-team moves.",
      promotion_clarity: "Quarterly review cycles with clear rubrics.",
      tools_access: "Latest hardware and software tools provided.",
      role_clarity: "Well-defined job descriptions and levels.",
      early_ownership: "High, trust in engineers from day one.",
      work_impact: "Directly impacts millions of users.",
      execution_thinking_balance: "70% execution, 30% strategic thinking.",
      automation_level: "High internal process automation.",
      cross_functional_exposure: "Regular interaction with product and sales.",
      exit_opportunities: "Highly regarded by top tier tech firms.",
      skill_relevance: "Top 1% industry standard tech stack.",
      network_strength: "Alumni in every major tech company.",
      global_exposure: "Opportunities for international transfers.",
      external_recognition: "Best place to work award 2024.",
      
      fixed_vs_variable_pay: "80/20 split on average.",
      bonus_predictability: "High, based on clear performance metrics.",
      esops_incentives: "RSUs granted to all permanent employees.",
      family_health_insurance: "Comprehensive cover for self and dependents.",
      relocation_support: "Full relocation package for new hires.",
      lifestyle_benefits: "Gym, free meals, and flexible work.",
      leave_policy: "Unlimited PTO or 30 days annual leave.",
      health_support: "Mental health and fitness support.",
      
      remote_policy_details: ["Remote", "Hybrid", "On-site"][index % 3],
      typical_hours: "9 AM - 6 PM",
      overtime_expectations: "Minimal, only during critical releases.",
      weekend_work: "Rare, compensation leaves provided.",
      flexibility_level: "High, core hours with flexible start/end.",
      location_centrality: "Located in major tech hubs.",
      public_transport_access: "Excellent, near metro stations.",
      cab_policy: "Free shuttle and cab reimbursement.",
      airport_commute_time: "45 minutes on average.",
      office_zone_type: "SEZ or Grade A Business Park.",
      area_safety: "High, secure business districts.",
      safety_policies: "Strict global safety standards.",
      infrastructure_safety: "Fire and earthquake resilient buildings.",
      emergency_preparedness: "Regular drills and emergency response teams.",
      
      annual_revenue: "$" + (1000 * (index + 1)) + " Million",
      annual_profit: "$" + (200 * (index + 1)) + " Million",
      revenue_mix: "70% Subscription, 30% Services.",
      valuation: "$" + (5000 + (index * 100)) + " Million",
      yoy_growth_rate: "15%",
      profitability_status: ["Profitable", "Break-even", "Loss-making"][index % 3],
      key_investors: "Top tier venture capital and institutions.",
      recent_funding_rounds: "Series D at $5B valuation.",
      total_capital_raised: "$" + (500 + index) + " Million",
      burn_rate: "Efficient, near break-even.",
      runway_months: "Unlimited (profitable).",
      burn_multiplier: "0.8x",
      esg_ratings: "AA Rated.",
      regulatory_status: "Fully compliant across all regions.",
      legal_issues: "Periodic labor and contract disputes; no major unresolved global litigation",
      supply_chain_dependencies: "Minimal, distributed suppliers.",
      geopolitical_risks: "Moderate, monitored by global risk team.",
      macro_risks: "Monitored via economic indicators.",
      
      tech_stack: getRandomSubset(techPool, 5).join(', '),
      technology_partners: "AWS, Microsoft, Google.",
      intellectual_property: "500+ active patents.",
      r_and_d_investment: "15% of annual revenue.",
      ai_ml_adoption_level: "High, core to product strategy.",
      cybersecurity_posture: "Zero-trust architecture.",
      innovation_roadmap: "Focus on generative AI and edge computing.",
      product_pipeline: "Major release scheduled for Q4.",
      tech_adoption_rating: "4.8/5",
      partnership_ecosystem: "Broad network of technology partners.",
      
      ceo_name: "Leader Name",
      ceo_linkedin_url: "https://linkedin.com/in/leader",
      key_leaders: "CTO, COO, VP Engineering.",
      board_members: "Industry veterans and investors.",
      warm_intro_pathways: "PES Alumni network and referral portal.",
      decision_maker_access: "High for top performers.",
      primary_contact_email: `contact@${compName.split(' ')[0].toLowerCase()}.com`,
      primary_phone_number: "NA",
      contact_person_name: "HR Manager",
      contact_person_title: "Head of Talent Acquisition",
      contact_person_email: `careers@${compName.split(' ')[0].toLowerCase()}.com`,
      contact_person_phone: "NA",
      
      website_url: `https://www.${compName.split(' ')[0].toLowerCase()}.com`,
      website_quality: "Professional, responsive, and high-performance.",
      website_rating: "4.5/5",
      website_traffic_rank: "Top 1000 globally.",
      social_media_followers: (index + 1) + " Million+",
      glassdoor_rating: (3.5 + (index % 1.5)).toFixed(1),
      indeed_rating: (3.6 + (index % 1.4)).toFixed(1),
      google_rating: (4.0 + (index % 1.0)).toFixed(1),
      linkedin_url: `https://www.linkedin.com/company/${compName.split(' ')[0].toLowerCase()}`,
      twitter_handle: `@${compName.split(' ')[0].toLowerCase()}`,
      facebook_url: `https://www.facebook.com/${compName.split(' ')[0].toLowerCase()}`,
      instagram_url: `https://www.instagram.com/${compName.split(' ')[0].toLowerCase()}`,
      marketing_video_url: "https://youtube.com/watch?v=promo",
      customer_testimonials: "Excellent feedback from enterprise clients.",
      awards_recognitions: "Multiple industry awards for innovation.",
      brand_sentiment_score: "88/100",
      event_participation: "Major sponsor at AWS re:Invent and Google I/O."
    };
    fs.writeFileSync(path.join(folders.full, `${safeName}.json`), JSON.stringify(fullSchema, null, 2));

    // Hiring Grounds (More varied)
    const hiring = {
      company_name: compName,
      job_role_details: [
        {
          opportunity_type: "Employment",
          role_title: "Software Development Engineer",
          role_category: "SDE",
          job_description: `Building scalable systems at ${compName}.`,
          compensation: "CTC",
          ctc_or_stipend: (1000000 + (index * 50000)),
          hiring_rounds: [
            { round_number: 1, round_name: "OA", round_category: "Coding Test", evaluation_type: "Technical", assessment_mode: "Online", skill_sets: [{ skill_set_code: "COD", typical_questions: "Q1; Q2; Q3" }] },
            { round_number: 2, round_name: "Technical Interview", round_category: "Interview", evaluation_type: "Technical", assessment_mode: "Online", skill_sets: [{ skill_set_code: "DSA", typical_questions: "Q1; Q2; Q3" }] },
            { round_number: 3, round_name: "HR Interview", round_category: "Interview", evaluation_type: "Behavioral", assessment_mode: "In-person", skill_sets: [{ skill_set_code: "BEH", typical_questions: "Why this company?" }] }
          ]
        }
      ]
    };
    fs.writeFileSync(path.join(folders.hiring, `${safeName}.json`), JSON.stringify(hiring, null, 2));

    // InnovX (Diverse tech stacks and realistic project names)
    const projectNames = [
      "AI-Driven Supply Chain Optimizer",
      "Edge Computing Network Node",
      "Real-time Fraud Detection System",
      "Blockchain-based Credential Verifier",
      "Quantum-Safe Encryption Suite",
      "Autonomous Warehouse Robotics",
      "Predictive Maintenance Platform",
      "Digital Twin City Simulation",
      "Zero-Trust Security Mesh",
      "High-Frequency Trading Engine",
      "Next-Gen Recommendation Core",
      "Sustainable Energy Management"
    ];

    const innovx = {
      innovx_master: { company_name: compName, industry: getRandom(sectorsPool) },
      innovx_projects: Array.from({ length: 9 }, (_, i) => ({
        project_name: getRandomSubset(projectNames, 1)[0],
        tier_level: `Tier ${Math.floor(i/3)+1}`,
        backend_technologies: getRandomSubset(techPool, 3),
        frontend_technologies: getRandomSubset(["React", "Vue.js", "Angular", "Next.js", "Svelte", "Flutter", "React Native"], 1)
      }))
    };
    fs.writeFileSync(path.join(folders.innovx, `${safeName}.json`), JSON.stringify(innovx, null, 2));
  });
  console.log(`Successfully generated enriched data for ${companies.length} companies.`);
}

generateData();
