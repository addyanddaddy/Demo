import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const { id } = params;
    const body = await req.json();
    const { reason, type, expiresAt } = body;

    if (!reason) {
      return NextResponse.json({ success: false, error: "Reason is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const ban = await prisma.userBan.create({
      data: {
        userId: id,
        bannedById: admin!.id,
        reason,
        type: type || "temporary",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
    });

    await logAdminAction(admin!.id, "ban_user", "user", id, {
      reason,
      type: type || "temporary",
      expiresAt,
    });

    return NextResponse.json({ success: true, data: ban }, { status: 201 });
  } catch (e) {
    console.error("Admin ban user error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const { id } = params;

    const activeBan = await prisma.userBan.findFirst({
      where: { userId: id, isActive: true },
    });

    if (!activeBan) {
      return NextResponse.json({ success: false, error: "No active ban found for this user" }, { status: 404 });
    }

    await prisma.userBan.update({
      where: { id: activeBan.id },
      data: { isActive: false },
    });

    await logAdminAction(admin!.id, "unban_user", "user", id, {
      banId: activeBan.id,
    });

    return NextResponse.json({ success: true, data: { message: "User has been unbanned" } });
  } catch (e) {
    console.error("Admin unban user error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
