import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody } from "@/lib/api-helpers";
import { createApplicationSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const roleProfiles = await prisma.roleProfile.findMany({
      where: { userId },
      select: { id: true },
    });

    const applications = await prisma.application.findMany({
      where: { roleProfileId: { in: roleProfiles.map((rp) => rp.id) } },
      include: {
        requisition: {
          include: {
            project: { select: { id: true, title: true } },
            role: { select: { name: true } },
          },
        },
        offers: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(applications);
  } catch (e) {
    return error("Failed to fetch applications", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createApplicationSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    // Verify the role profile belongs to the user
    const rp = await prisma.roleProfile.findFirst({
      where: { id: data.roleProfileId, userId },
    });
    if (!rp) return error("Role profile not found", 404);

    const application = await prisma.application.create({ data });

    await prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        entityType: "application",
        entityId: application.id,
        action: "submitted",
        metadata: { requisitionId: data.requisitionId },
      },
    });

    return success(application, 201);
  } catch (e: any) {
    if (e?.code === "P2002") return error("You've already applied to this requisition", 409);
    return error("Failed to submit application", 500);
  }
}
