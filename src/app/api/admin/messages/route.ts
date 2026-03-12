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
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { sender: { name: { contains: search, mode: "insensitive" } } },
        { recipient: { name: { contains: search, mode: "insensitive" } } },
        { sender: { email: { contains: search, mode: "insensitive" } } },
        { recipient: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (filter === "flagged") {
      const reportedIds = await prisma.report.findMany({
        where: { targetType: "message" },
        select: { targetId: true },
      });
      where.id = { in: reportedIds.map((r) => r.targetId) };
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          sender: { select: { id: true, name: true, email: true, avatarUrl: true } },
          recipient: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        ...paginate(page, limit),
      }),
      prisma.message.count({ where }),
    ]);

    // Check which messages have reports
    const messageIds = messages.map((m) => m.id);
    const reports = await prisma.report.findMany({
      where: { targetType: "message", targetId: { in: messageIds } },
      select: { targetId: true, id: true, category: true, status: true },
    });
    const reportMap = new Map(reports.map((r) => [r.targetId, r]));

    const enriched = messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      recipient: m.recipient,
      content: m.content,
      contentPreview: m.content.substring(0, 100),
      readAt: m.readAt,
      createdAt: m.createdAt,
      isReported: reportMap.has(m.id),
      report: reportMap.get(m.id) || null,
    }));

    return NextResponse.json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Admin messages list error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const { action, messageId } = await req.json();
    if (!messageId) {
      return NextResponse.json({ success: false, error: "messageId is required" }, { status: 400 });
    }

    if (action === "flag") {
      await prisma.report.create({
        data: {
          reporterId: admin!.id,
          targetType: "message",
          targetId: messageId,
          category: "INAPPROPRIATE_CONTENT",
          description: "Flagged by admin during message monitoring",
          status: "REVIEWING",
        },
      });
      await logAdminAction(admin!.id, "flag_message", "message", messageId);
      return NextResponse.json({ success: true, data: { flagged: true } });
    }

    if (action === "delete") {
      await prisma.message.delete({ where: { id: messageId } });
      await logAdminAction(admin!.id, "delete_message", "message", messageId);
      return NextResponse.json({ success: true, data: { deleted: true } });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error("Admin message action error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
