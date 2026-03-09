import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody, getSearchParams } from "@/lib/api-helpers";
import { createProjectSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const params = getSearchParams(req);

  try {
    const roleProfiles = await prisma.roleProfile.findMany({
      where: { userId },
      select: { id: true },
    });
    const rpIds = roleProfiles.map((rp) => rp.id);

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerAccount: { billingOwnerUserId: userId } },
          { members: { some: { roleProfileId: { in: rpIds } } } },
          ...(params.visibility === "public" ? [{ visibility: "PUBLIC" as const }] : []),
        ],
        ...(params.stage ? { stage: params.stage as any } : {}),
        ...(params.format ? { format: params.format as any } : {}),
      },
      include: {
        _count: { select: { members: true, requisitions: { where: { status: "OPEN" } } } },
        ownerAccount: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    return success(projects);
  } catch (e) {
    console.error("Projects list error:", e);
    return error("Failed to fetch projects", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createProjectSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const account = await prisma.account.findFirst({
      where: { billingOwnerUserId: userId },
    });

    if (!account) return error("No account found", 404);

    // Get the user's first role profile for project membership
    const roleProfile = await prisma.roleProfile.findFirst({
      where: { userId },
    });

    const project = await prisma.$transaction(async (tx) => {
      const proj = await tx.project.create({
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
          ownerAccountId: account.id,
        },
      });

      // Add creator as project member with full authority
      if (roleProfile) {
        await tx.projectMember.create({
          data: {
            projectId: proj.id,
            roleProfileId: roleProfile.id,
            permissionSet: { canView: true, canEdit: true, canManage: true },
            authorityFlags: { canHire: true, canApproveOffers: true, canApproveInvoices: true, canManageDocs: true },
          },
        });
      }

      await tx.auditEvent.create({
        data: {
          actorUserId: userId,
          entityType: "project",
          entityId: proj.id,
          action: "created",
          metadata: { title: proj.title, format: proj.format },
        },
      });

      return proj;
    });

    return success(project, 201);
  } catch (e) {
    console.error("Project create error:", e);
    return error("Failed to create project", 500);
  }
}
