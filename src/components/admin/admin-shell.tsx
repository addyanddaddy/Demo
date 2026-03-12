"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  ChartBarSquareIcon,
  UsersIcon,
  DocumentMagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  SparklesIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatarUrl: string | null;
}

interface AdminShellProps {
  children: React.ReactNode;
  user: AdminUser;
}

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------

const sections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: ChartBarSquareIcon },
    ],
  },
  {
    label: "Users & Access",
    items: [
      { name: "Users", href: "/admin/users", icon: UsersIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Content Moderation", href: "/admin/content", icon: DocumentMagnifyingGlassIcon },
    ],
  },
  {
    label: "Communication",
    items: [
      { name: "Messages", href: "/admin/messages", icon: ChatBubbleLeftEllipsisIcon },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Payments", href: "/admin/payments", icon: CurrencyDollarIcon },
    ],
  },
  {
    label: "Safety",
    items: [
      { name: "Reports & Violations", href: "/admin/reports", icon: ShieldExclamationIcon },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { name: "AI Settings", href: "/admin/ai", icon: SparklesIcon },
    ],
  },
  {
    label: "Platform",
    items: [
      { name: "Rules & Settings", href: "/admin/settings", icon: Cog6ToothIcon },
    ],
  },
  {
    label: "Logs",
    items: [
      { name: "Activity Log", href: "/admin/activity", icon: ClipboardDocumentListIcon },
    ],
  },
];

// Map pathname to page title
function pageTitleFromPath(pathname: string): string {
  for (const section of sections) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) {
        return item.name;
      }
    }
  }
  return "Admin";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const pageTitle = pageTitleFromPath(pathname);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ------- Sidebar content -------
  const sidebarContent = (
    <>
      {/* Logo area */}
      <div className="flex h-16 items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="FrameOne" width={28} height={28} className="rounded-md" />
          <span className="text-base font-light tracking-wide text-[#edebe2]">FrameOne</span>
          <span className="ml-1 inline-flex items-center rounded-md bg-[#9d7663]/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#c4a47a]">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-3 pt-4 scrollbar-thin">
        {sections.map((section, idx) => (
          <div key={section.label}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8a96] mb-1.5">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-normal transition-colors",
                      isActive
                        ? "bg-white/[0.06] text-[#edebe2]"
                        : "text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#b8b5a8]"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            {idx < sections.length - 1 && (
              <div className="mt-4 border-t border-white/[0.06]" />
            )}
          </div>
        ))}
      </nav>

      {/* Bottom: Back to App */}
      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-normal text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#b8b5a8] transition-colors"
        >
          <ArrowLeftIcon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
          <span>Back to App</span>
        </Link>
      </div>
    </>
  );

  // ------- Role badge color -------
  const roleBadge = (
    <span className="inline-flex items-center rounded-md bg-[#9d7663]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c4a47a]">
      {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
    </span>
  );

  return (
    <div className="flex min-h-screen bg-[#08080c]">
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3.5 left-3 z-50 rounded-lg bg-[#0f0f14] p-2 text-[#8a8a96] hover:text-[#edebe2] lg:hidden"
      >
        {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/[0.08] bg-[#0f0f14]",
          "transition-transform duration-200 lg:translate-x-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#0f0f14]/80 backdrop-blur-xl px-4 lg:px-8">
          <h1 className="text-lg font-light tracking-wide text-[#edebe2] pl-10 lg:pl-0">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
                className="relative rounded-lg p-2 text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500/90 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/[0.08] bg-[#1a1a22] shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.08]">
                    <h3 className="text-sm font-light tracking-wide text-[#edebe2]">Admin Alerts</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-[13px] text-[#edebe2]">3 pending reports need review</p>
                      <p className="text-xs text-[#8a8a96] mt-1">Just now</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-[13px] text-[#edebe2]">Flagged content detected</p>
                      <p className="text-xs text-[#8a8a96] mt-1">12 min ago</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/reports"
                    onClick={() => setShowNotif(false)}
                    className="block text-center px-4 py-3 text-xs font-normal text-[#c4a47a] hover:text-[#9d7663] border-t border-white/[0.08] transition-colors"
                  >
                    View all reports
                  </Link>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
                className="flex items-center gap-2.5 rounded-full px-2 py-1 hover:bg-white/[0.04] transition-colors"
              >
                <Avatar name={user.name || "Admin"} src={user.avatarUrl} size="sm" />
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-[13px] text-[#edebe2]">{user.name}</span>
                  {roleBadge}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#1a1a22] shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.08]">
                    <p className="text-sm font-light tracking-wide text-[#edebe2]">{user.name}</p>
                    <p className="text-xs text-[#8a8a96] mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-[13px] text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors"
                    >
                      Back to App
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-[13px] text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors"
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-white/[0.08] py-1">
                    <Link
                      href="/api/auth/signout"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-[13px] text-red-400/80 hover:bg-white/[0.04] hover:text-red-400 transition-colors"
                    >
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 transition-all duration-300 ease-out">
          {children}
        </main>
      </div>
    </div>
  );
}
