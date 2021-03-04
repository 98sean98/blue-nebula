import { PrismaClient } from '@prisma/client';

import { sum } from '@utilities/sum';

const prisma = new PrismaClient();

/**
 *
 */
async function main() {
  const users = await prisma.user.findMany();
  console.log({ users });
  console.log('sum', sum(1, 2));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
