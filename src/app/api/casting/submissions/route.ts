import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody } from "@/lib/api-helpers";
import { createSubmissionSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const rps = await prisma.roleProfile.findMany({ where: { userId }, select: { id: true } });
    const submissions = await prisma.submission.findMany({
      where: { roleProfileId: { in: rps.map((r) => r.id) } },
      include: { breakdown: { include: { project: { select: { title: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    return success(submissions);
  } catch (e) {
    return error("Failed to fetch submissions", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const validation = await validateBody(req, createSubmissionSchema);
  if (validation.error) return validation.error;

  try {
    const submission = await prisma.submission.create({ data: validation.data! });
    return success(submission, 201);
  } catch (e: any) {
    if (e?.code === "P2002") return error("Already submitted to this breakdown", 409);
    return error("Failed to create submission", 500);
  }
}
