import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      roleProfiles: Array<{
        id: string;
        roleSlug: string;
        roleName: string;
        groupName: string;
      }>;
      accountId: string;
      membershipTier: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles: string[];
    roleProfiles: Array<{
      id: string;
      roleSlug: string;
      roleName: string;
      groupName: string;
    }>;
    accountId: string;
    membershipTier: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    roleProfiles: Array<{
      id: string;
      roleSlug: string;
      roleName: string;
      groupName: string;
    }>;
    accountId: string;
    membershipTier: string;
  }
}
