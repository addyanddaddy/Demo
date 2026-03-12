import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Setting brandon@frameone.io as SUPER_ADMIN...");

  await prisma.user.update({
    where: { email: "brandon@frameone.io" },
    data: { role: "SUPER_ADMIN" },
  });

  console.log("Done. brandon@frameone.io is now SUPER_ADMIN.");
}

main()
  .catch((e) => {
    console.error("Error setting admin role:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
