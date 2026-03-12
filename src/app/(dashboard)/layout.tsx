import { getServerAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch the user's role for admin link visibility
  const dbUser = session.user.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
      })
    : null;

  return (
    <AppShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: dbUser?.role || "USER",
      }}
    >
      {children}
    </AppShell>
  );
}
