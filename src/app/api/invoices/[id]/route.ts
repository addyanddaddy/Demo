import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        project: { select: { title: true } },
        vendorAccount: { select: { name: true } },
        submittedBy: { select: { name: true } },
        approvedBy: { select: { name: true } },
        payouts: true,
      },
    });
    if (!invoice) return error("Invoice not found", 404);
    return success(invoice);
  } catch (e) {
    return error("Failed to fetch invoice", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const { status, approvalState } = await req.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (approvalState === "APPROVED") {
      updateData.approvalState = "APPROVED";
      updateData.approvedByUserId = userId;
      updateData.approvedAt = new Date();
      updateData.status = "APPROVED";
    } else if (approvalState === "REJECTED") {
      updateData.approvalState = "REJECTED";
      updateData.status = "DISPUTED";
    }

    const invoice = await prisma.invoice.update({ where: { id: params.id }, data: updateData });

    await prisma.auditEvent.create({
      data: { actorUserId: userId, entityType: "invoice", entityId: params.id, action: approvalState?.toLowerCase() || "updated" },
    });

    return success(invoice);
  } catch (e) {
    return error("Failed to update invoice", 500);
  }
}
