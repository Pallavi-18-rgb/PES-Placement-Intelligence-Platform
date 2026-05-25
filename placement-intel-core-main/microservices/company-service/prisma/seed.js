const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding companies and jobs...');
  
  const company1 = await prisma.companies.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      name: 'Google',
      industry: 'Technology',
      description: 'Search and cloud giant.',
      jobs: {
        create: [
          {
            title: 'Software Engineer',
            ctc: '20 LPA',
            min_cgpa: 8.0,
            allowed_branches: ['Computer Science', 'IT'],
            allows_backlogs: false
          }
        ]
      }
    },
  });

  const company2 = await prisma.companies.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      name: 'Amazon',
      industry: 'E-commerce',
      description: 'Earths most customer-centric company.',
      jobs: {
        create: [
          {
            title: 'SDE 1',
            ctc: '25 LPA',
            min_cgpa: 7.5,
            allowed_branches: ['Computer Science', 'IT', 'Electronics'],
            allows_backlogs: true
          }
        ]
      }
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
