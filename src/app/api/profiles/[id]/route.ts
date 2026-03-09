import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody } from "@/lib/api-helpers";
import { updateRoleProfileSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profile = await prisma.roleProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        role: { include: { taxonomyGroup: true } },
        availability: { where: { endDate: { gte: new Date() } }, orderBy: { startDate: "asc" } },
        _count: { select: { receivedEndorsements: true, projectAssignments: true, workedWithA: true, workedWithB: true } },
      },
    });

    if (!profile || !profile.isPublic) return error("Profile not found", 404);
    return success(profile);
  } catch (e) {
    return error("Failed to fetch profile", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, updateRoleProfileSchema);
  if (validation.error) return validation.error;

  try {
    const profile = await prisma.roleProfile.findFirst({ where: { id: params.id, userId } });
    if (!profile) return error("Profile not found or unauthorized", 404);

    const updated = await prisma.roleProfile.update({
      where: { id: params.id },
      data: validation.data!,
    });
    return success(updated);
  } catch (e) {
    return error("Failed to update profile", 500);
  }
}
