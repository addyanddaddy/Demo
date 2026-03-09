import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { success, error, validateBody } from "@/lib/api-helpers";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const validation = await validateBody(req, registerSchema);
  if (validation.error) return validation.error;
  const { name, email, password } = validation.data!;

  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return error("An account with this email already exists", 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + default account + free membership in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          passwordHash,
        },
      });

      const account = await tx.account.create({
        data: {
          type: "INDIVIDUAL",
          name: name,
          billingOwnerUserId: newUser.id,
        },
      });

      await tx.membership.create({
        data: {
          accountId: account.id,
          tier: "FREE",
          status: "ACTIVE",
        },
      });

      await tx.auditEvent.create({
        data: {
          actorUserId: newUser.id,
          entityType: "user",
          entityId: newUser.id,
          action: "registered",
          metadata: { email: newUser.email },
        },
      });

      return newUser;
    });

    return success({ id: user.id, email: user.email, name: user.name }, 201);
  } catch (e) {
    console.error("Registration error:", e);
    return error("Failed to create account", 500);
  }
}
