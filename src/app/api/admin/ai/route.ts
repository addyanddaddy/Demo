import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, logAdminAction } from "@/lib/admin";

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const configs = await prisma.aIConfig.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Transform to match frontend AIData interface
    const features = configs.map((c) => ({
      id: c.id,
      name: c.displayName,
      description: c.description,
      enabled: c.isEnabled,
      model: c.model,
      maxTokens: c.maxTokens,
      temperature: c.temperature,
      attachedPaths: (c.attachedTo as string[]) || [],
      usageCount: c.usageCount,
      lastUsedAt: c.lastUsedAt?.toISOString() || null,
      customPrompt: c.customPrompt,
    }));

    const totalApiCalls = configs.reduce((sum, c) => sum + c.usageCount, 0);
    const featureBreakdown = configs.map((c) => ({
      name: c.displayName,
      calls: c.usageCount,
    }));

    return NextResponse.json({
      features,
      usage: { totalApiCalls, featureBreakdown },
    });
  } catch (e) {
    console.error("Admin AI config list error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error, user: admin } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { featureKey, displayName, description, model, maxTokens, temperature, customPrompt, attachedTo } = body;

    if (!featureKey || !displayName || !description) {
      return NextResponse.json(
        { success: false, error: "featureKey, displayName, and description are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.aIConfig.findUnique({ where: { featureKey } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Feature key already exists" }, { status: 409 });
    }

    const config = await prisma.aIConfig.create({
      data: {
        featureKey,
        displayName,
        description,
        model: model || "claude-sonnet-4-20250514",
        maxTokens: maxTokens || 1000,
        temperature: temperature ?? 0,
        customPrompt: customPrompt || null,
        attachedTo: attachedTo || null,
      },
    });

    await logAdminAction(admin!.id, "create_ai_config", "ai_config", config.id, { featureKey });

    return NextResponse.json({ success: true, data: config }, { status: 201 });
  } catch (e) {
    console.error("Admin create AI config error:", e);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
