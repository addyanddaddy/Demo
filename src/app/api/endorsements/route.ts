import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody, getSearchParams } from "@/lib/api-helpers";
import { createEndorsementSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const params = getSearchParams(req);

  try {
    const endorsements = await prisma.endorsement.findMany({
      where: params.roleProfileId ? { toRoleProfileId: params.roleProfileId } : {},
      include: {
        fromRoleProfile: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            role: { select: { name: true } },
          },
        },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return success(endorsements);
  } catch (e) {
    return error("Failed to fetch endorsements", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createEndorsementSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const fromProfile = await prisma.roleProfile.findFirst({ where: { userId } });
    if (!fromProfile) return error("You need a role profile to endorse", 400);
    if (fromProfile.id === data.toRoleProfileId) return error("Cannot endorse yourself", 400);

    const endorsement = await prisma.endorsement.create({
      data: { ...data, fromRoleProfileId: fromProfile.id },
    });
    return success(endorsement, 201);
  } catch (e) {
    return error("Failed to create endorsement", 500);
  }
}
