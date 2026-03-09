import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody } from "@/lib/api-helpers";
import { updateProjectSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        ownerAccount: { select: { id: true, name: true, type: true } },
        members: {
          include: {
            roleProfile: {
              include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
                role: { select: { name: true, slug: true, level: true } },
              },
            },
          },
        },
        _count: {
          select: {
            requisitions: true,
            assignments: true,
            breakdowns: true,
            documents: true,
          },
        },
      },
    });

    if (!project) return error("Project not found", 404);
    return success(project);
  } catch (e) {
    console.error("Project get error:", e);
    return error("Failed to fetch project", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, updateProjectSchema);
  if (validation.error) return validation.error;

  try {
    const data = validation.data!;
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    await prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        entityType: "project",
        entityId: project.id,
        action: "updated",
        metadata: { fields: Object.keys(data) },
      },
    });

    return success(project);
  } catch (e) {
    console.error("Project update error:", e);
    return error("Failed to update project", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    await prisma.project.delete({ where: { id: params.id } });

    await prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        entityType: "project",
        entityId: params.id,
        action: "deleted",
      },
    });

    return success({ deleted: true });
  } catch (e) {
    console.error("Project delete error:", e);
    return error("Failed to delete project", 500);
  }
}
