import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody, getSearchParams } from "@/lib/api-helpers";
import { createBreakdownSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const params = getSearchParams(req);

  try {
    const breakdowns = await prisma.breakdown.findMany({
      where: {
        ...(params.projectId ? { projectId: params.projectId } : {}),
        ...(params.status ? { status: params.status as any } : { status: "OPEN" }),
      },
      include: {
        project: { select: { title: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return success(breakdowns);
  } catch (e) {
    return error("Failed to fetch breakdowns", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createBreakdownSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const breakdown = await prisma.breakdown.create({
      data: {
        ...data,
        submissionDeadline: data.submissionDeadline ? new Date(data.submissionDeadline) : null,
        createdById: userId,
      },
    });
    return success(breakdown, 201);
  } catch (e) {
    return error("Failed to create breakdown", 500);
  }
}
