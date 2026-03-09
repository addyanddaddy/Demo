import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api-helpers";

export async function GET() {
  try {
    const groups = await prisma.taxonomyGroup.findMany({
      include: { roles: { orderBy: { name: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    return success(groups);
  } catch (e) {
    return error("Failed to fetch taxonomy", 500);
  }
}
