import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { paginate } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const action = searchParams.get("action") || "";
    const adminUserId = searchParams.get("adminUserId") || "";

    const where: Record<string, unknown> = {};

    if (action) {
      where.action = action;
    }

    if (adminUserId) {
      where.adminUserId = adminUserId;
    }

    const [logs, total] = await Promise.all([
      prisma.adminActionLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        ...paginate(page, limit),
      }),
      prisma.adminActionLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Admin activity log error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
