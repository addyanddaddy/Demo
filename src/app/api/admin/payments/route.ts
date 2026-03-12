import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const dateFilter: Record<string, unknown> = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const invoiceWhere: Record<string, unknown> = {};
    if (startDate || endDate) {
      invoiceWhere.createdAt = dateFilter;
    }

    const payoutWhere: Record<string, unknown> = {};
    if (startDate || endDate) {
      payoutWhere.createdAt = dateFilter;
    }

    const [
      totalRevenue,
      pendingPayments,
      recentInvoices,
      invoiceCount,
      payoutSummary,
    ] = await Promise.all([
      prisma.invoice.aggregate({
        where: { ...invoiceWhere, status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { ...invoiceWhere, status: { in: ["SUBMITTED", "APPROVED"] } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.invoice.findMany({
        where: invoiceWhere,
        include: {
          project: { select: { id: true, title: true } },
          vendorAccount: { select: { id: true, name: true } },
          submittedBy: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where: invoiceWhere }),
      prisma.payout.groupBy({
        by: ["status"],
        where: payoutWhere,
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingPayments: {
          total: pendingPayments._sum.amount || 0,
          count: pendingPayments._count,
        },
        recentInvoices,
        payoutSummary: payoutSummary.map((p) => ({
          status: p.status,
          total: p._sum.amount,
          count: p._count,
        })),
      },
      pagination: { page, limit, total: invoiceCount, totalPages: Math.ceil(invoiceCount / limit) },
    });
  } catch (e) {
    console.error("Admin payments error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
