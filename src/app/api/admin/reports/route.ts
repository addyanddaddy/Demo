import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";
import { paginate } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    const [reports, total, pendingCount, reviewingCount, resolvedCount, dismissedCount] =
      await Promise.all([
        prisma.report.findMany({
          where,
          orderBy: { createdAt: "desc" },
          ...paginate(page, limit),
        }),
        prisma.report.count({ where }),
        prisma.report.count({ where: { status: "PENDING" } }),
        prisma.report.count({ where: { status: "REVIEWING" } }),
        prisma.report.count({ where: { status: "RESOLVED" } }),
        prisma.report.count({ where: { status: "DISMISSED" } }),
      ]);

    // Enrich reports with reporter info
    const reporterIds = [...new Set(reports.map((r) => r.reporterId))];
    const reporters = await prisma.user.findMany({
      where: { id: { in: reporterIds } },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
    const reporterMap = new Map(reporters.map((u) => [u.id, u]));

    // Enrich with target previews
    const enriched = await Promise.all(
      reports.map(async (report) => {
        let targetPreview: Record<string, unknown> | null = null;
        try {
          if (report.targetType === "user" || report.targetType === "profile") {
            targetPreview = await prisma.user.findUnique({
              where: { id: report.targetId },
              select: { id: true, name: true, email: true, avatarUrl: true },
            });
          } else if (report.targetType === "post") {
            targetPreview = await prisma.post.findUnique({
              where: { id: report.targetId },
              select: { id: true, content: true, authorId: true, author: { select: { name: true } } },
            });
          } else if (report.targetType === "comment") {
            targetPreview = await prisma.comment.findUnique({
              where: { id: report.targetId },
              select: { id: true, content: true, authorId: true, author: { select: { name: true } } },
            });
          } else if (report.targetType === "message") {
            targetPreview = await prisma.message.findUnique({
              where: { id: report.targetId },
              select: {
                id: true,
                content: true,
                senderId: true,
                sender: { select: { name: true } },
                recipient: { select: { name: true } },
              },
            });
          }
        } catch {
          targetPreview = null;
        }

        return {
          ...report,
          reporter: reporterMap.get(report.reporterId) || null,
          targetPreview,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enriched,
      counts: {
        pending: pendingCount,
        reviewing: reviewingCount,
        resolved: resolvedCount,
        dismissed: dismissedCount,
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Admin reports list error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { reportId, status, resolution } = body;

    if (!reportId || !status) {
      return NextResponse.json({ success: false, error: "reportId and status are required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "REVIEWING", "RESOLVED", "DISMISSED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status };

    if (status === "RESOLVED" || status === "DISMISSED") {
      updateData.resolvedById = admin!.id;
      updateData.resolvedAt = new Date();
    }

    if (resolution) {
      updateData.resolution = resolution;
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
    });

    await logAdminAction(admin!.id, "update_report_status", "report", reportId, {
      previousStatus: report.status,
      newStatus: status,
      resolution,
    });

    return NextResponse.json({ success: true, data: updatedReport });
  } catch (e) {
    console.error("Admin update report error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const { action, reportId, resolution, banReason } = await req.json();
    if (!reportId) {
      return NextResponse.json({ success: false, error: "reportId is required" }, { status: 400 });
    }

    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
    }

    if (action === "ban_target") {
      let targetUserId: string | null = null;
      if (report.targetType === "user" || report.targetType === "profile") {
        targetUserId = report.targetId;
      } else if (report.targetType === "post") {
        const post = await prisma.post.findUnique({ where: { id: report.targetId }, select: { authorId: true } });
        targetUserId = post?.authorId || null;
      } else if (report.targetType === "comment") {
        const comment = await prisma.comment.findUnique({ where: { id: report.targetId }, select: { authorId: true } });
        targetUserId = comment?.authorId || null;
      } else if (report.targetType === "message") {
        const msg = await prisma.message.findUnique({ where: { id: report.targetId }, select: { senderId: true } });
        targetUserId = msg?.senderId || null;
      }

      if (!targetUserId) {
        return NextResponse.json({ success: false, error: "Could not determine target user" }, { status: 400 });
      }

      await prisma.userBan.create({
        data: {
          userId: targetUserId,
          bannedById: admin!.id,
          reason: banReason || `Banned due to report: ${report.category}`,
          type: "permanent",
          isActive: true,
        },
      });

      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: "RESOLVED",
          resolvedById: admin!.id,
          resolvedAt: new Date(),
          resolution: `User banned. ${resolution || ""}`.trim(),
        },
      });

      await logAdminAction(admin!.id, "ban_user", "user", targetUserId, { reportId, banReason });
      return NextResponse.json({ success: true, data: { banned: true, status: "RESOLVED" } });
    }

    if (action === "delete_content") {
      try {
        if (report.targetType === "post") {
          await prisma.post.delete({ where: { id: report.targetId } });
        } else if (report.targetType === "comment") {
          await prisma.comment.delete({ where: { id: report.targetId } });
        } else if (report.targetType === "message") {
          await prisma.message.delete({ where: { id: report.targetId } });
        } else {
          return NextResponse.json({ success: false, error: "Cannot delete this content type" }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ success: false, error: "Content already deleted or not found" }, { status: 404 });
      }

      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: "RESOLVED",
          resolvedById: admin!.id,
          resolvedAt: new Date(),
          resolution: `Content deleted. ${resolution || ""}`.trim(),
        },
      });

      await logAdminAction(admin!.id, "delete_content", report.targetType, report.targetId, { reportId });
      return NextResponse.json({ success: true, data: { contentDeleted: true, status: "RESOLVED" } });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error("Admin report action error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
