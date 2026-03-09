import { NextRequest } from "next/server";
import { success, error } from "@/lib/api-helpers";
import { naturalLanguageSearch } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return error("query is required", 422);

    // Parse the natural language query into structured filters
    const filters = await naturalLanguageSearch(query);

    // Execute the structured search against the database
    const profiles = await prisma.roleProfile.findMany({
      where: {
        isPublic: true,
        ...(filters.roleSlug ? { role: { slug: filters.roleSlug } } : {}),
        ...(filters.department ? { role: { taxonomyGroup: { slug: filters.department } } } : {}),
        ...(filters.location
          ? {
              OR: [
                { city: { contains: filters.location, mode: "insensitive" as const } },
                { region: { contains: filters.location, mode: "insensitive" as const } },
                { country: { contains: filters.location, mode: "insensitive" as const } },
              ],
            }
          : {}),
        ...(filters.level ? { role: { level: filters.level } } : {}),
        ...(filters.keywords
          ? {
              OR: [
                { displayName: { contains: filters.keywords, mode: "insensitive" as const } },
                { bio: { contains: filters.keywords, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        role: { select: { name: true, slug: true, level: true } },
        availability: {
          where: { endDate: { gte: new Date() }, status: "AVAILABLE" },
          take: 1,
        },
        _count: { select: { receivedEndorsements: true, projectAssignments: true } },
      },
      take: 30,
    });

    return success({
      query: query,
      parsedFilters: filters,
      results: profiles,
      resultCount: profiles.length,
    });
  } catch (e) {
    console.error("AI search error:", e);
    return error("AI search failed", 500);
  }
}
