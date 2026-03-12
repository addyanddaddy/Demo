import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const page = Math.max(1, parseInt(params.page || "1"));
    const limit = Math.min(50, parseInt(params.limit || "20"));
    const search = params.search?.trim() || "";
    const tab = params.tab || "all";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { author: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (tab === "removed") {
      where.visibility = "removed";
    } else if (tab !== "flagged") {
      where.NOT = { visibility: "removed" };
    }

    let postIds: string[] = [];

    if (tab === "flagged") {
      const reports = await prisma.report.findMany({
        where: {
          targetType: "post",
          status: { in: ["PENDING", "REVIEWING"] },
        },
        select: { targetId: true },
        distinct: ["targetId"],
      });
      postIds = reports.map((r) => r.targetId);

      if (postIds.length === 0) {
        return NextResponse.json({
          success: true,
          data: {
            posts: [],
            pagination: { page, limit, total: 0, totalPages: 0 },
          },
        });
      }

      where.id = { in: postIds };
      delete where.NOT;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              role: true,
              roleProfiles: {
                include: { role: { select: { name: true } } },
                take: 1,
              },
            },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const fetchedPostIds = posts.map((p) => p.id);
    const reportCounts = await prisma.report.groupBy({
      by: ["targetId"],
      where: {
        targetType: "post",
        targetId: { in: fetchedPostIds },
        status: { in: ["PENDING", "REVIEWING"] },
      },
      _count: true,
    });

    const reportMap = new Map(reportCounts.map((r) => [r.targetId, r._count]));

    const formatted = posts.map((p) => ({
      id: p.id,
      content: p.content,
      imageUrl: p.imageUrl,
      videoUrl: p.videoUrl,
      postType: p.postType,
      visibility: p.visibility,
      likesCount: p.likesCount,
      commentsCount: p._count.comments,
      reportCount: reportMap.get(p.id) || 0,
      createdAt: p.createdAt,
      author: {
        id: p.author.id,
        name: p.author.name,
        avatarUrl: p.author.avatarUrl,
        role: p.author.role,
        displayRole: p.author.roleProfiles[0]?.role.name || "Member",
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        posts: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (e) {
    console.error("Admin content GET error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { error, user: adminUser } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ success: false, error: "postId is required" }, { status: 422 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, content: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    await prisma.post.update({
      where: { id: postId },
      data: { visibility: "removed" },
    });

    await prisma.report.updateMany({
      where: {
        targetType: "post",
        targetId: postId,
        status: { in: ["PENDING", "REVIEWING"] },
      },
      data: {
        status: "RESOLVED",
        resolvedById: adminUser!.id,
        resolvedAt: new Date(),
        resolution: "Post removed by admin",
      },
    });

    await logAdminAction(adminUser!.id, "delete_post", "post", postId, {
      authorId: post.authorId,
      contentPreview: post.content.slice(0, 100),
    });

    return NextResponse.json({ success: true, data: { message: "Post removed" } });
  } catch (e) {
    console.error("Admin content DELETE error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
