import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error, requireAuth } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  const userId = (auth.session!.user as any).id;

  try {
    const body = await req.json();
    const { selectedRoleIds, profiles, selectedPlan } = body;

    if (!selectedRoleIds?.length) {
      return error("Select at least one role", 422);
    }

    await prisma.$transaction(async (tx) => {
      // Find roles by slug
      const roles = await tx.role.findMany({
        where: { slug: { in: selectedRoleIds } },
      });

      // Create role profiles
      for (const role of roles) {
        const profileData = profiles?.[role.slug] || {};

        await tx.roleProfile.upsert({
          where: {
            userId_roleId: { userId, roleId: role.id },
          },
          update: {
            displayName: profileData.displayName || auth.session!.user?.name || "Professional",
            bio: profileData.bio || null,
            city: profileData.city || null,
            region: profileData.region || null,
            country: profileData.country || null,
          },
          create: {
            userId,
            roleId: role.id,
            displayName: profileData.displayName || auth.session!.user?.name || "Professional",
            bio: profileData.bio || null,
            city: profileData.city || null,
            region: profileData.region || null,
            country: profileData.country || null,
          },
        });
      }

      // Update membership if plan changed
      if (selectedPlan && selectedPlan !== "free") {
        const account = await tx.account.findFirst({
          where: { billingOwnerUserId: userId },
        });

        if (account) {
          const tierMap: Record<string, string> = {
            "pro-supply": "PRO_SUPPLY",
            "hiring-pro": "HIRING_PRO",
            "department-head": "DEPARTMENT_HEAD",
            "agency-studio": "AGENCY_STUDIO",
          };

          const tier = tierMap[selectedPlan];
          if (tier) {
            await tx.membership.updateMany({
              where: { accountId: account.id },
              data: { tier: tier as any, status: "TRIALING" },
            });
          }
        }
      }

      // Audit
      await tx.auditEvent.create({
        data: {
          actorUserId: userId,
          entityType: "user",
          entityId: userId,
          action: "onboarding_completed",
          metadata: {
            roles: selectedRoleIds,
            plan: selectedPlan,
          },
        },
      });
    });

    return success({ message: "Onboarding complete" });
  } catch (e) {
    console.error("Onboarding error:", e);
    return error("Failed to complete onboarding", 500);
  }
}
