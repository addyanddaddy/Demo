import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const rules = await prisma.platformRule.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: rules });
  } catch (e) {
    console.error("Admin rules list error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { title, description, category, severity, sortOrder } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: "title, description, and category are required" },
        { status: 400 }
      );
    }

    const rule = await prisma.platformRule.create({
      data: {
        title,
        description,
        category,
        severity: severity || "warning",
        sortOrder: sortOrder || 0,
      },
    });

    await logAdminAction(admin!.id, "create_rule", "platform_rule", rule.id, { title });

    return NextResponse.json({ success: true, data: rule }, { status: 201 });
  } catch (e) {
    console.error("Admin create rule error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { ruleId, title, description, category, isActive, severity, sortOrder } = body;

    if (!ruleId) {
      return NextResponse.json({ success: false, error: "ruleId is required" }, { status: 400 });
    }

    const existing = await prisma.platformRule.findUnique({ where: { id: ruleId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Rule not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (severity !== undefined) updateData.severity = severity;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const rule = await prisma.platformRule.update({
      where: { id: ruleId },
      data: updateData,
    });

    await logAdminAction(admin!.id, "update_rule", "platform_rule", ruleId, {
      changes: Object.keys(updateData),
    });

    return NextResponse.json({ success: true, data: rule });
  } catch (e) {
    console.error("Admin update rule error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { ruleId } = body;

    if (!ruleId) {
      return NextResponse.json({ success: false, error: "ruleId is required" }, { status: 400 });
    }

    const existing = await prisma.platformRule.findUnique({ where: { id: ruleId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Rule not found" }, { status: 404 });
    }

    await prisma.platformRule.delete({ where: { id: ruleId } });

    await logAdminAction(admin!.id, "delete_rule", "platform_rule", ruleId, {
      title: existing.title,
    });

    return NextResponse.json({ success: true, data: { message: "Rule deleted" } });
  } catch (e) {
    console.error("Admin delete rule error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
