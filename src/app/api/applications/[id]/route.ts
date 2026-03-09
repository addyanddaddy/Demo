import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        requisition: { include: { project: true, role: true } },
        roleProfile: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            role: true,
          },
        },
        offers: true,
      },
    });

    if (!application) return error("Application not found", 404);
    return success(application);
  } catch (e) {
    return error("Failed to fetch application", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { status } = await req.json();
    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status },
    });
    return success(application);
  } catch (e) {
    return error("Failed to update application", 500);
  }
}
