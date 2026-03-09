"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppShell({ children, title, user }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header title={title} user={user} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
