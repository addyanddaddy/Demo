import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const breakdown = await prisma.breakdown.findUnique({
      where: { id: params.id },
      include: {
        project: { select: { title: true } },
        submissions: {
          include: {
            roleProfile: {
              include: {
                user: { select: { name: true, avatarUrl: true } },
                role: { select: { name: true } },
              },
            },
          },
        },
        shortlistEntries: { orderBy: { rank: "asc" } },
      },
    });
    if (!breakdown) return error("Breakdown not found", 404);
    return success(breakdown);
  } catch (e) {
    return error("Failed to fetch breakdown", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const breakdown = await prisma.breakdown.update({
      where: { id: params.id },
      data: body,
    });
    return success(breakdown);
  } catch (e) {
    return error("Failed to update breakdown", 500);
  }
}
