const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding users...');
  
  const user1 = await prisma.users.upsert({
    where: { email: 'student1@university.edu' },
    update: {},
    create: {
      name: 'Alice Smith',
      email: 'student1@university.edu',
      role: 'STUDENT',
      cgpa: 8.5,
      branch: 'Computer Science',
      active_backlogs: 0,
    },
  });

  const user2 = await prisma.users.upsert({
    where: { email: 'student2@university.edu' },
    update: {},
    create: {
      name: 'Bob Jones',
      email: 'student2@university.edu',
      role: 'STUDENT',
      cgpa: 7.2,
      branch: 'Mechanical',
      active_backlogs: 1,
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
