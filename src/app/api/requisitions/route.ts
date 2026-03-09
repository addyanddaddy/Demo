import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody, getSearchParams } from "@/lib/api-helpers";
import { createRequisitionSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const params = getSearchParams(req);

  try {
    const requisitions = await prisma.requisition.findMany({
      where: {
        ...(params.projectId ? { projectId: params.projectId } : {}),
        ...(params.status ? { status: params.status as any } : {}),
        ...(params.department ? { department: params.department } : {}),
        ...(params.roleId ? { roleId: params.roleId } : {}),
      },
      include: {
        role: { select: { name: true, slug: true, level: true } },
        project: { select: { id: true, title: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return success(requisitions);
  } catch (e) {
    return error("Failed to fetch requisitions", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createRequisitionSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const requisition = await prisma.requisition.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: "OPEN",
        createdById: userId,
      },
    });

    await prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        entityType: "requisition",
        entityId: requisition.id,
        action: "created",
        metadata: { title: requisition.title, projectId: data.projectId },
      },
    });

    return success(requisition, 201);
  } catch (e) {
    return error("Failed to create requisition", 500);
  }
}
