import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const requisition = await prisma.requisition.findUnique({
      where: { id: params.id },
      include: {
        role: true,
        project: { select: { id: true, title: true, stage: true } },
        applications: {
          include: {
            roleProfile: {
              include: {
                user: { select: { name: true, avatarUrl: true } },
                role: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!requisition) return error("Requisition not found", 404);
    return success(requisition);
  } catch (e) {
    return error("Failed to fetch requisition", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const requisition = await prisma.requisition.update({
      where: { id: params.id },
      data: body,
    });
    return success(requisition);
  } catch (e) {
    return error("Failed to update requisition", 500);
  }
}
