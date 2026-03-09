import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, avatarUrl: true, phone: true, createdAt: true,
        accounts: {
          include: { memberships: { where: { status: { in: ["ACTIVE", "TRIALING"] } }, take: 1 } },
        },
        roleProfiles: {
          include: { role: { include: { taxonomyGroup: true } } },
        },
      },
    });
    return success(user);
  } catch (e) {
    return error("Failed to fetch user", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const { name, phone, avatarUrl } = await req.json();
    const user = await prisma.user.update({
      where: { id: userId },
      data: { ...(name && { name }), ...(phone !== undefined && { phone }), ...(avatarUrl !== undefined && { avatarUrl }) },
      select: { id: true, email: true, name: true, avatarUrl: true, phone: true },
    });
    return success(user);
  } catch (e) {
    return error("Failed to update user", 500);
  }
}
