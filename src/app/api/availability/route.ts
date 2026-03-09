import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth, validateBody, getSearchParams } from "@/lib/api-helpers";
import { setAvailabilitySchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const params = getSearchParams(req);

  try {
    const availability = await prisma.availability.findMany({
      where: {
        ...(params.roleProfileId ? { roleProfileId: params.roleProfileId } : {}),
        ...(params.from ? { endDate: { gte: new Date(params.from) } } : {}),
        ...(params.to ? { startDate: { lte: new Date(params.to) } } : {}),
      },
      orderBy: { startDate: "asc" },
    });
    return success(availability);
  } catch (e) {
    return error("Failed to fetch availability", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const validation = await validateBody(req, setAvailabilitySchema);
  if (validation.error) return validation.error;
  const data = validation.data!;

  try {
    const avail = await prisma.availability.create({
      data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) },
    });
    return success(avail, 201);
  } catch (e) {
    return error("Failed to set availability", 500);
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const params = getSearchParams(req);
  if (!params.id) return error("Missing availability ID", 400);

  try {
    await prisma.availability.delete({ where: { id: params.id } });
    return success({ deleted: true });
  } catch (e) {
    return error("Failed to delete availability", 500);
  }
}
