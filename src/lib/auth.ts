import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession as nextAuthGetServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: {
            roleProfiles: {
              include: {
                role: {
                  include: {
                    taxonomyGroup: true,
                  },
                },
              },
            },
            accounts: {
              include: {
                memberships: {
                  where: { status: "ACTIVE" },
                  take: 1,
                },
              },
            },
          },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          roles: user.roleProfiles.map((rp) => rp.role.slug),
          roleProfiles: user.roleProfiles.map((rp) => ({
            id: rp.id,
            roleSlug: rp.role.slug,
            roleName: rp.role.name,
            groupName: rp.role.taxonomyGroup.name,
          })),
          accountId: user.accounts[0]?.id,
          membershipTier: user.accounts[0]?.memberships[0]?.tier || "FREE",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles;
        token.roleProfiles = (user as any).roleProfiles;
        token.accountId = (user as any).accountId;
        token.membershipTier = (user as any).membershipTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).roles = token.roles;
        (session.user as any).roleProfiles = token.roleProfiles;
        (session.user as any).accountId = token.accountId;
        (session.user as any).membershipTier = token.membershipTier;
      }
      return session;
    },
  },
};

export async function getServerAuth() {
  return nextAuthGetServerSession(authOptions);
}
