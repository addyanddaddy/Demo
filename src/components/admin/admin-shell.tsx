"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { Avatar } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
// Navigation structure (translation keys)
// ---------------------------------------------------------------------------

const sectionDefs = [
  {
    labelKey: "admin.overview",
    items: [
      { nameKey: "nav.dashboard", href: "/admin", icon: ChartBarSquareIcon },
    ],
  },
  {
    labelKey: "admin.usersAndAccess",
    items: [
      { nameKey: "admin.users", href: "/admin/users", icon: UsersIcon },
    ],
  },
  {
    labelKey: "admin.content",
    items: [
      { nameKey: "admin.contentModeration", href: "/admin/content", icon: DocumentMagnifyingGlassIcon },
    ],
  },
  {
    labelKey: "admin.communication",
    items: [
      { nameKey: "nav.messages", href: "/admin/messages", icon: ChatBubbleLeftEllipsisIcon },
    ],
  },
  {
    labelKey: "nav.finance",
    items: [
      { nameKey: "nav.payments", href: "/admin/payments", icon: CurrencyDollarIcon },
    ],
  },
  {
    labelKey: "admin.safety",
    items: [
      { nameKey: "admin.reportsAndViolations", href: "/admin/reports", icon: ShieldExclamationIcon },
    ],
  },
  {
    labelKey: "admin.intelligence",
    items: [
      { nameKey: "admin.aiSettings", href: "/admin/ai", icon: SparklesIcon },
    ],
  },
  {
    labelKey: "nav.platform",
    items: [
      { nameKey: "admin.rulesAndSettings", href: "/admin/settings", icon: Cog6ToothIcon },
    ],
  },
  {
    labelKey: "admin.logs",
    items: [
      { nameKey: "admin.activityLog", href: "/admin/activity", icon: ClipboardDocumentListIcon },
    ],
  },
];

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
  const { t } = useTranslation();

  // Resolve translated sections
  const sections = sectionDefs.map((s) => ({
    label: t(s.labelKey),
    items: s.items.map((item) => ({
      name: t(item.nameKey),
      href: item.href,
      icon: item.icon,
    })),
  }));

  // Map pathname to page title
  function pageTitleFromPath(p: string): string {
    for (const section of sections) {
      for (const item of section.items) {
        if (p === item.href || p.startsWith(item.href + "/")) {
          return item.name;
        }
      }
    }
    return t("admin.admin");
  }

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
          <span className="text-base font-light tracking-wide text-[#f0efe6]">FrameOne</span>
          <span className="ml-1 inline-flex items-center rounded-md bg-[#9d7663]/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#c4a47a]">
            {t("admin.admin")}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-3 pt-4 scrollbar-thin">
        {sections.map((section, idx) => (
          <div key={section.label}>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e9eab] mb-1.5">
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
                        ? "bg-white/[0.06] text-[#f0efe6]"
                        : "text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#cdc9bc]"
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

      {/* Bottom: Theme + Language + Back to App */}
      <div className="border-t border-white/[0.06] p-3 space-y-1">
        <ThemeToggle />
        <LanguageSwitcher />
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-normal text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#cdc9bc] transition-colors"
        >
          <ArrowLeftIcon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
          <span>{t("admin.backToApp")}</span>
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
        className="fixed top-3.5 left-3 z-50 rounded-lg bg-[#131318] p-2 text-[#9e9eab] hover:text-[#f0efe6] lg:hidden"
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
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/[0.08] bg-[#131318]",
          "transition-transform duration-200 lg:translate-x-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/[0.08] bg-[#131318]/80 backdrop-blur-xl px-4 lg:px-8">
          <h1 className="text-lg font-light tracking-wide text-[#f0efe6] pl-10 lg:pl-0">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
                className="relative rounded-lg p-2 text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500/90 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/[0.08] bg-[#1f1f2a] shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.08]">
                    <h3 className="text-sm font-light tracking-wide text-[#f0efe6]">{t("admin.adminAlerts")}</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-[13px] text-[#f0efe6]">3 pending reports need review</p>
                      <p className="text-xs text-[#9e9eab] mt-1">Just now</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] p-3">
                      <p className="text-[13px] text-[#f0efe6]">Flagged content detected</p>
                      <p className="text-xs text-[#9e9eab] mt-1">12 min ago</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/reports"
                    onClick={() => setShowNotif(false)}
                    className="block text-center px-4 py-3 text-xs font-normal text-[#c4a47a] hover:text-[#9d7663] border-t border-white/[0.08] transition-colors"
                  >
                    {t("admin.viewAllReports")}
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
                  <span className="text-[13px] text-[#f0efe6]">{user.name}</span>
                  {roleBadge}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#1f1f2a] shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.08]">
                    <p className="text-sm font-light tracking-wide text-[#f0efe6]">{user.name}</p>
                    <p className="text-xs text-[#9e9eab] mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-[13px] text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors"
                    >
                      {t("admin.backToApp")}
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-[13px] text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors"
                    >
                      {t("nav.settings")}
                    </Link>
                  </div>
                  <div className="border-t border-white/[0.08] py-1">
                    <Link
                      href="/api/auth/signout"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2.5 text-[13px] text-red-400/80 hover:bg-white/[0.04] hover:text-red-400 transition-colors"
                    >
                      {t("auth.signOut")}
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
        <p className="text-[11px] text-[#6b6b78] tracking-wide text-center py-6">
          Website built by Adaptation Living LLC — A Brandon Bible Project
        </p>
      </div>
    </div>
  );
}
