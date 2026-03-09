import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId: params.id },
      include: {
        roleProfile: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, email: true } },
            role: { select: { name: true, slug: true, level: true } },
          },
        },
      },
    });
    return success(members);
  } catch (e) {
    return error("Failed to fetch members", 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const body = await req.json();
    const { roleProfileId, permissionSet, authorityFlags } = body;

    const member = await prisma.projectMember.create({
      data: {
        projectId: params.id,
        roleProfileId,
        permissionSet: permissionSet || { canView: true, canEdit: false, canManage: false },
        authorityFlags: authorityFlags || { canHire: false, canApproveOffers: false, canApproveInvoices: false, canManageDocs: false },
        invitedBy: userId,
      },
    });

    return success(member, 201);
  } catch (e) {
    return error("Failed to add member", 500);
  }
}
