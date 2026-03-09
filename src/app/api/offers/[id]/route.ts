import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody } from "@/lib/api-helpers";
import { respondToOfferSchema } from "@/lib/validations";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: { application: { include: { requisition: { include: { project: true } }, roleProfile: true } } },
    });
    if (!offer) return error("Offer not found", 404);
    return success(offer);
  } catch (e) {
    return error("Failed to fetch offer", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, respondToOfferSchema);
  if (validation.error) return validation.error;
  const { action, counterTerms, counterRate } = validation.data!;

  try {
    const offer = await prisma.offer.findUnique({
      where: { id: params.id },
      include: { application: { include: { requisition: true, roleProfile: true } } },
    });
    if (!offer) return error("Offer not found", 404);

    if (action === "ACCEPT") {
      await prisma.$transaction(async (tx) => {
        await tx.offer.update({ where: { id: params.id }, data: { status: "ACCEPTED", approvalState: "APPROVED" } });
        await tx.application.update({ where: { id: offer.applicationId }, data: { status: "SHORTLISTED" } });

        // Create assignment
        const assignment = await tx.projectAssignment.create({
          data: {
            projectId: offer.application.requisition.projectId,
            roleProfileId: offer.application.roleProfileId,
            roleId: offer.application.requisition.roleId,
            agreedRate: offer.proposedRate,
            rateType: offer.rateType,
            startDate: offer.application.requisition.startDate,
            endDate: offer.application.requisition.endDate,
          },
        });

        // Generate worked-with edges with existing assignments
        const existingAssignments = await tx.projectAssignment.findMany({
          where: { projectId: offer.application.requisition.projectId, id: { not: assignment.id } },
          include: { role: true, roleProfile: true },
        });

        for (const existing of existingAssignments) {
          await tx.workedWithEdge.create({
            data: {
              projectId: offer.application.requisition.projectId,
              roleProfileAId: assignment.roleProfileId,
              roleProfileBId: existing.roleProfileId,
              roleContextA: offer.application.requisition.roleId,
              roleContextB: existing.roleId,
              startDate: assignment.startDate,
            },
          }).catch(() => {}); // Ignore duplicates
        }

        await tx.auditEvent.create({
          data: { actorUserId: userId, entityType: "offer", entityId: params.id, action: "accepted" },
        });
      });
    } else if (action === "DECLINE") {
      await prisma.offer.update({ where: { id: params.id }, data: { status: "DECLINED" } });
    } else if (action === "COUNTER") {
      await prisma.offer.update({
        where: { id: params.id },
        data: { status: "COUNTERED", counterTerms, proposedRate: counterRate || offer.proposedRate },
      });
    }

    const updated = await prisma.offer.findUnique({ where: { id: params.id } });
    return success(updated);
  } catch (e) {
    console.error("Offer response error:", e);
    return error("Failed to respond to offer", 500);
  }
}
