import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          include: {
            memberships: true,
          },
        },
        roleProfiles: {
          include: {
            role: { include: { taxonomyGroup: true } },
            _count: {
              select: {
                receivedEndorsements: true,
                projectAssignments: true,
                applications: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get user's bans
    const bans = await prisma.userBan.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
    });

    // Get user's projects (via project members)
    const profileIds = user.roleProfiles.map((rp) => rp.id);
    const projectMemberships = await prisma.projectMember.findMany({
      where: { roleProfileId: { in: profileIds } },
      include: {
        project: { select: { id: true, title: true, format: true, stage: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        bans,
        projects: projectMemberships.map((pm) => pm.project),
      },
    });
  } catch (e) {
    console.error("Admin user detail error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const { id } = params;

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Soft-ban: create a UserBan record
    await prisma.userBan.create({
      data: {
        userId: id,
        bannedById: admin!.id,
        reason: "Banned by admin (soft delete)",
        type: "permanent",
        isActive: true,
      },
    });

    await logAdminAction(admin!.id, "soft_ban_user", "user", id, {
      userName: targetUser.name,
      userEmail: targetUser.email,
    });

    return NextResponse.json({ success: true, data: { message: "User has been banned" } });
  } catch (e) {
    console.error("Admin soft-ban user error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
