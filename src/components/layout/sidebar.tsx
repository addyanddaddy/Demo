"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  FilmIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const platformNav = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Discover", href: "/discover", icon: MagnifyingGlassIcon },
  { name: "Projects", href: "/projects", icon: FilmIcon },
  { name: "Casting", href: "/casting", icon: StarIcon },
  { name: "Messages", href: "/messages", icon: ChatBubbleLeftRightIcon },
];

const workNav = [
  { name: "My Profiles", href: "/profile/edit", icon: UserCircleIcon },
  { name: "Availability", href: "/availability", icon: CalendarDaysIcon },
  { name: "Applications", href: "/applications", icon: BriefcaseIcon },
];

const financeNav = [
  { name: "Payments", href: "/payments", icon: CurrencyDollarIcon },
  { name: "Invoices", href: "/invoices", icon: DocumentTextIcon },
];

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavSection = ({ label, items }: { label: string; items: typeof platformNav }) => (
    <div className="space-y-1">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
        {label}
      </p>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-indigo-600/20 text-indigo-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center gap-3 px-3 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="FrameOne" width={32} height={32} className="rounded-md" />
          <span className="text-base font-semibold text-white">FrameOne</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        <NavSection label="Platform" items={platformNav} />
        <NavSection label="My Work" items={workNav} />
        <NavSection label="Finance" items={financeNav} />
      </nav>

      <div className="border-t border-zinc-800 p-3 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-indigo-600/20 text-indigo-400"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
          )}
        >
          <Cog6ToothIcon className="h-5 w-5" />
          <span>Settings</span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Avatar name={user.name || "User"} src={user.image} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-3 left-3 z-50 rounded-lg bg-zinc-800 p-2 text-zinc-400 hover:text-white lg:hidden"
      >
        {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900",
          "transition-transform duration-200 lg:translate-x-0 lg:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
