import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireSuperAdmin, logAdminAction } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const page = Math.max(1, parseInt(params.page || "1"));
    const limit = Math.min(50, parseInt(params.limit || "20"));
    const search = params.search?.trim() || "";
    const roleFilter = params.role || "";
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (roleFilter && roleFilter !== "ALL") {
      where.role = roleFilter;
    }

    const orderBy: Record<string, string> = {};
    if (["createdAt", "name", "email", "role"].includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = "desc";
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          accounts: {
            select: {
              memberships: {
                where: { status: "ACTIVE" },
                select: { tier: true },
                take: 1,
              },
            },
            take: 1,
          },
          _count: {
            select: {
              posts: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Get active bans for these users
    const userIds = users.map((u) => u.id);
    const activeBans = await prisma.userBan.findMany({
      where: {
        userId: { in: userIds },
        isActive: true,
      },
      select: {
        userId: true,
        reason: true,
        type: true,
        expiresAt: true,
      },
    });

    const banMap = new Map(activeBans.map((b) => [b.userId, b]));

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      avatarUrl: u.avatarUrl,
      role: u.role,
      createdAt: u.createdAt,
      membershipTier: u.accounts[0]?.memberships[0]?.tier || "FREE",
      postCount: u._count.posts,
      isBanned: banMap.has(u.id),
      ban: banMap.get(u.id) || null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (e) {
    console.error("Admin users GET error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { error, user: adminUser } = await requireSuperAdmin();
    if (error) return error;

    const body = await req.json();
    const { userId, action, data } = body;

    if (!userId || !action) {
      return NextResponse.json({ success: false, error: "userId and action are required" }, { status: 422 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (action === "change_role") {
      const validRoles = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];
      if (!data?.newRole || !validRoles.includes(data.newRole)) {
        return NextResponse.json({ success: false, error: "Invalid role" }, { status: 422 });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role: data.newRole },
      });

      await logAdminAction(adminUser!.id, "change_role", "user", userId, {
        previousRole: targetUser.role,
        newRole: data.newRole,
      });

      return NextResponse.json({ success: true, data: { message: "Role updated" } });
    }

    if (action === "ban") {
      if (!data?.reason) {
        return NextResponse.json({ success: false, error: "Ban reason is required" }, { status: 422 });
      }

      const banType = data.type === "permanent" ? "permanent" : "temporary";
      let expiresAt: Date | null = null;

      if (banType === "temporary") {
        if (!data.expiresAt) {
          return NextResponse.json({ success: false, error: "Expiry date required for temporary ban" }, { status: 422 });
        }
        expiresAt = new Date(data.expiresAt);
        if (expiresAt <= new Date()) {
          return NextResponse.json({ success: false, error: "Expiry date must be in the future" }, { status: 422 });
        }
      }

      await prisma.userBan.create({
        data: {
          userId,
          bannedById: adminUser!.id,
          reason: data.reason,
          type: banType,
          expiresAt,
          isActive: true,
        },
      });

      await logAdminAction(adminUser!.id, "ban_user", "user", userId, {
        reason: data.reason,
        type: banType,
        expiresAt,
      });

      return NextResponse.json({ success: true, data: { message: "User banned" } });
    }

    if (action === "unban") {
      await prisma.userBan.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });

      await logAdminAction(adminUser!.id, "unban_user", "user", userId, {});

      return NextResponse.json({ success: true, data: { message: "User unbanned" } });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 422 });
  } catch (e) {
    console.error("Admin users PATCH error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
