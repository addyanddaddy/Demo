import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";
import { extractProfileTags } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const { roleProfileId } = await req.json();
    if (!roleProfileId) return error("roleProfileId is required", 422);

    // Get the profile
    const profile = await prisma.roleProfile.findFirst({
      where: { id: roleProfileId, userId },
      include: { role: { select: { name: true } } },
    });

    if (!profile) return error("Profile not found", 404);
    if (!profile.bio) return error("Profile needs a bio to categorize", 422);

    // Extract tags using AI
    const tags = await extractProfileTags(profile.bio, profile.role.name);

    // Save tags as profile fields
    const fieldEntries = [
      ...tags.skills.map((s: string) => ({ fieldKey: "skill", fieldValue: s })),
      ...tags.genres.map((g: string) => ({ fieldKey: "genre", fieldValue: g })),
      ...tags.tools.map((t: string) => ({ fieldKey: "tool", fieldValue: t })),
      ...tags.specialties.map((s: string) => ({ fieldKey: "specialty", fieldValue: s })),
    ];

    // Clear old AI-generated tags and insert new ones
    await prisma.roleProfileField.deleteMany({
      where: {
        roleProfileId,
        fieldKey: { in: ["skill", "genre", "tool", "specialty"] },
        visibility: "AI_GENERATED",
      },
    });

    for (const entry of fieldEntries) {
      await prisma.roleProfileField.create({
        data: {
          roleProfileId,
          fieldKey: entry.fieldKey,
          fieldValue: entry.fieldValue,
          visibility: "AI_GENERATED",
        },
      });
    }

    return success({
      tags,
      savedCount: fieldEntries.length,
    });
  } catch (e) {
    console.error("AI categorize error:", e);
    return error("AI categorization failed", 500);
  }
}
