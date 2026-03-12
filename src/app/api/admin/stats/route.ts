import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersLast7Days,
      newUsersLast30Days,
      totalProjects,
      activeProjects,
      totalApplications,
      totalOffers,
      messagesLast24h,
      totalReports,
      pendingReports,
      resolvedReports,
      invoicesByStatus,
      aiConfigs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.project.count(),
      prisma.project.count({ where: { stage: { in: ["DEVELOPMENT", "PRE_PRODUCTION", "PRODUCTION"] } } }),
      prisma.application.count(),
      prisma.offer.count(),
      prisma.message.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.report.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "RESOLVED" } }),
      prisma.invoice.groupBy({
        by: ["status"],
        _sum: { amount: true },
        _count: true,
      }),
      prisma.aIConfig.findMany({
        select: { featureKey: true, displayName: true, usageCount: true, lastUsedAt: true, isEnabled: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newLast7Days: newUsersLast7Days,
          newLast30Days: newUsersLast30Days,
        },
        projects: {
          total: totalProjects,
          active: activeProjects,
        },
        applications: { total: totalApplications },
        offers: { total: totalOffers },
        messages: { last24h: messagesLast24h },
        reports: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
        },
        revenue: invoicesByStatus.map((inv) => ({
          status: inv.status,
          total: inv._sum.amount,
          count: inv._count,
        })),
        aiUsage: aiConfigs,
      },
    });
  } catch (e) {
    console.error("Admin stats error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
