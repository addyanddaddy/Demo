import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody, getSearchParams } from "@/lib/api-helpers";
import { createInvoiceSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const params = getSearchParams(req);

  try {
    const accounts = await prisma.account.findMany({ where: { billingOwnerUserId: userId }, select: { id: true } });
    const accountIds = accounts.map((a) => a.id);

    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [
          { vendorAccountId: { in: accountIds } },
          { submittedByUserId: userId },
          ...(params.projectId ? [{ projectId: params.projectId }] : []),
        ],
        ...(params.status ? { status: params.status as any } : {}),
      },
      include: {
        project: { select: { title: true } },
        vendorAccount: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return success(invoices);
  } catch (e) {
    return error("Failed to fetch invoices", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  const validation = await validateBody(req, createInvoiceSchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const account = await prisma.account.findFirst({ where: { billingOwnerUserId: userId } });
    if (!account) return error("No account found", 404);

    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        vendorAccountId: account.id,
        submittedByUserId: userId,
        status: "SUBMITTED",
      },
    });

    await prisma.auditEvent.create({
      data: { actorUserId: userId, entityType: "invoice", entityId: invoice.id, action: "submitted", metadata: { amount: Number(data.amount) } },
    });

    return success(invoice, 201);
  } catch (e) {
    return error("Failed to create invoice", 500);
  }
}
