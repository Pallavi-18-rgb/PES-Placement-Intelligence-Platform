const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  // Read the original frontend JSON data
  const jsonPath = '/app/consolidation.json';
  
  if (!fs.existsSync(jsonPath)) {
    console.error('Error: consolidation.json not found at', jsonPath);
    // Let's try the other possible path since Docker context might differ if run inside container
    return;
  }
  
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const companiesData = JSON.parse(rawData);

  console.log(`Found ${companiesData.length} companies in JSON.`);

  // Clear existing dummy data to avoid duplicates
  await prisma.applications.deleteMany({});
  await prisma.jobs.deleteMany({});
  await prisma.companies.deleteMany({});
  
  console.log('Cleared existing dummy companies.');

  let count = 0;
  for (const c of companiesData) {
    await prisma.companies.create({
      data: {
        name: c.short_name || c.name || "Unknown",
        description: c.overview_text || 'No description provided.',
        industry: c.category || 'Technology',
        tier: 'Tier 1'
      }
    });
    count++;
  }

  console.log(`Successfully seeded ${count} companies from JSON.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
