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
    role?: string;
  };
}

export function AppShell({ children, title, user }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header title={title} user={user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 transition-all duration-300 ease-out">
          {children}
        </main>
        <p className="text-[11px] text-[#6b6b78] tracking-wide text-center py-6">
          Website built by Adaptation Living LLC — A Brandon Bible Project
        </p>
      </div>
    </div>
  );
}
