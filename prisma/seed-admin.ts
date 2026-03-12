import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting admin roles...");

  await prisma.user.update({
    where: { email: "brandon@frameone.io" },
    data: { role: "SUPER_ADMIN" },
  });
  console.log("  ✓ brandon@frameone.io → SUPER_ADMIN");

  await prisma.user.update({
    where: { email: "ralph@frameone.io" },
    data: { role: "SUPER_ADMIN" },
  });
  console.log("  ✓ ralph@frameone.io → SUPER_ADMIN");

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error("Error setting admin role:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
