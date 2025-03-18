import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Create a role
  const role = await prisma.role.upsert({
    where: { nom: 'admin' },
    update: {},
    create: {
      nom: 'admin',
    },
  });

  // create a user (admin)
  const admin = await prisma.user.upsert({
    where: { email: 'a@exemple.com' },
    update: {},
    create: {
      email: 'a@exemple.com',
      password: '$2b$10$rPksRFwelGG01oBo5d3vTePe7ujzNTj4z3isFgr4GhZCgUJg1CvbO',
      roleId: role.id,
    },
  });

  console.log({ role, admin });
}

// execute the main function
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
