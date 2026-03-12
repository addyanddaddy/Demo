import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const config = await prisma.aIConfig.findUnique({ where: { id: params.id } });

    if (!config) {
      return NextResponse.json({ success: false, error: "AI config not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (e) {
    console.error("Admin get AI config error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const body = await req.json();

    const existing = await prisma.aIConfig.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "AI config not found" }, { status: 404 });
    }

    // Accept both frontend names (enabled, attachedPaths) and Prisma names (isEnabled, attachedTo)
    const updateData: Record<string, unknown> = {};
    if (body.enabled !== undefined) updateData.isEnabled = body.enabled;
    if (body.isEnabled !== undefined) updateData.isEnabled = body.isEnabled;
    if (body.model !== undefined) updateData.model = body.model;
    if (body.maxTokens !== undefined) updateData.maxTokens = body.maxTokens;
    if (body.temperature !== undefined) updateData.temperature = body.temperature;
    if (body.customPrompt !== undefined) updateData.customPrompt = body.customPrompt;
    if (body.attachedPaths !== undefined) updateData.attachedTo = body.attachedPaths;
    if (body.attachedTo !== undefined) updateData.attachedTo = body.attachedTo;

    const config = await prisma.aIConfig.update({
      where: { id: params.id },
      data: updateData,
    });

    await logAdminAction(admin!.id, "update_ai_config", "ai_config", params.id, {
      featureKey: existing.featureKey,
      changes: Object.keys(updateData),
    });

    return NextResponse.json({ success: true, data: config });
  } catch (e) {
    console.error("Admin update AI config error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const existing = await prisma.aIConfig.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "AI config not found" }, { status: 404 });
    }

    await prisma.aIConfig.delete({ where: { id: params.id } });

    await logAdminAction(admin!.id, "delete_ai_config", "ai_config", params.id, {
      featureKey: existing.featureKey,
    });

    return NextResponse.json({ success: true, data: { message: "AI config deleted" } });
  } catch (e) {
    console.error("Admin delete AI config error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
