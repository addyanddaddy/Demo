import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const profiles = await prisma.roleProfile.findMany({
      where: { userId },
      include: {
        role: { include: { taxonomyGroup: true } },
        _count: { select: { receivedEndorsements: true, projectAssignments: true } },
      },
    });
    return success(profiles);
  } catch (e) {
    return error("Failed to fetch profiles", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const { roleId, displayName, bio, city, region, country } = await req.json();
    const profile = await prisma.roleProfile.create({
      data: { userId, roleId, displayName: displayName || (auth.session!.user as any).name, bio, city, region, country },
    });
    return success(profile, 201);
  } catch (e: any) {
    if (e?.code === "P2002") return error("You already have this role profile", 409);
    return error("Failed to create profile", 500);
  }
}
