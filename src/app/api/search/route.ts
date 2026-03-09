import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, getSearchParams } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const params = getSearchParams(req);
  const query = params.query || "";
  const page = parseInt(params.page || "1");
  const limit = Math.min(parseInt(params.limit || "20"), 50);
  const skip = (page - 1) * limit;

  try {
    const [profiles, projects, requisitions] = await Promise.all([
      prisma.roleProfile.findMany({
        where: {
          isPublic: true,
          OR: query ? [
            { displayName: { contains: query, mode: "insensitive" } },
            { bio: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { role: { name: { contains: query, mode: "insensitive" } } },
          ] : undefined,
          ...(params.roleSlug ? { role: { slug: params.roleSlug } } : {}),
          ...(params.department ? { role: { taxonomyGroup: { slug: params.department } } } : {}),
          ...(params.location ? { city: { contains: params.location, mode: "insensitive" as const } } : {}),
        },
        include: {
          user: { select: { name: true, avatarUrl: true } },
          role: { select: { name: true, slug: true, level: true } },
          availability: { where: { endDate: { gte: new Date() } }, take: 1 },
          _count: { select: { receivedEndorsements: true, projectAssignments: true } },
        },
        skip,
        take: limit,
      }),

      prisma.project.findMany({
        where: {
          visibility: "PUBLIC",
          ...(query ? { OR: [
            { title: { contains: query, mode: "insensitive" } },
            { logline: { contains: query, mode: "insensitive" } },
          ]} : {}),
        },
        include: { _count: { select: { requisitions: { where: { status: "OPEN" } } } } },
        skip,
        take: limit,
      }),

      prisma.requisition.findMany({
        where: {
          status: "OPEN",
          ...(query ? { OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ]} : {}),
          ...(params.roleSlug ? { role: { slug: params.roleSlug } } : {}),
        },
        include: {
          role: { select: { name: true, slug: true } },
          project: { select: { title: true } },
        },
        skip,
        take: limit,
      }),
    ]);

    return success({ profiles, projects, requisitions });
  } catch (e) {
    return error("Search failed", 500);
  }
}
