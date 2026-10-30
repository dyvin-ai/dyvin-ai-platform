import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDb() {
  try {
    const orgs = await prisma.organization.findMany();
    console.log('Orgs count:', orgs.length);
    if (orgs.length > 0) {
      console.log('Sample Org:', orgs[0]);
    }
    const defaultOrg = await prisma.organization.findUnique({
      where: { id: 'org-default' },
    });
    console.log('Org default exists?', !!defaultOrg);

    const profiles = await prisma.aIVisibilityProfile.findMany();
    console.log('Visibility Profiles count:', profiles.length);
  } catch (e) {
    console.error('DB Check Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
