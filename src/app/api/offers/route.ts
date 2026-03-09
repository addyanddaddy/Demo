import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody } from "@/lib/api-helpers";
import { createOfferSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createOfferSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const offer = await prisma.offer.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    await prisma.application.update({
      where: { id: data.applicationId },
      data: { status: "UNDER_REVIEW" },
    });

    await prisma.auditEvent.create({
      data: {
        actorUserId: userId,
        entityType: "offer",
        entityId: offer.id,
        action: "created",
        metadata: { applicationId: data.applicationId, rate: Number(data.proposedRate) },
      },
    });

    return success(offer, 201);
  } catch (e) {
    return error("Failed to create offer", 500);
  }
}
