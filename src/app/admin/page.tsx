"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  FilmIcon,
  ShieldExclamationIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KpiStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface ActivityEvent {
  id: string;
  action: string;
  actor: string;
  time: string;
}

interface Alert {
  id: string;
  title: string;
  severity: "warning" | "error" | "info";
  count?: number;
}

interface AiFeature {
  name: string;
  usageCount: number;
  enabled: boolean;
}

interface UserGrowth {
  signupsThisWeek: number;
  roles: { name: string; count: number }[];
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  membership: string;
  createdAt: string;
}

interface AdminStats {
  kpis: KpiStat[];
  recentActivity: ActivityEvent[];
  alerts: Alert[];
  aiUsage: AiFeature[];
  userGrowth: UserGrowth;
  recentUsers: RecentUser[];
}

// ---------------------------------------------------------------------------
// Skeleton helpers
// ---------------------------------------------------------------------------

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-[#2a2a38] ${className ?? ""}`} />;
}

function KpiSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1f1f2a] p-6 space-y-4">
      <SkeletonBlock className="h-5 w-5" />
      <SkeletonBlock className="h-9 w-24" />
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI card icons
// ---------------------------------------------------------------------------

const kpiIcons = [UsersIcon, FilmIcon, ShieldExclamationIcon, CurrencyDollarIcon];

// ---------------------------------------------------------------------------
// Fallback / mock data when API is not yet available
// ---------------------------------------------------------------------------

const fallbackStats: AdminStats = {
  kpis: [
    { label: "Total Users", value: "1,284", change: "+12 this week", trend: "up" },
    { label: "Active Projects", value: "87", change: "+4 this week", trend: "up" },
    { label: "Pending Reports", value: "6", change: "+2 today", trend: "down" },
    { label: "Revenue", value: "$14,230", change: "+8% this month", trend: "up" },
  ],
  recentActivity: [
    { id: "1", action: "Approved user verification", actor: "Admin", time: "2 min ago" },
    { id: "2", action: "Resolved report #412", actor: "Admin", time: "15 min ago" },
    { id: "3", action: "Updated platform rules", actor: "Super Admin", time: "1 hour ago" },
    { id: "4", action: "Banned user spammer_bot", actor: "Admin", time: "2 hours ago" },
    { id: "5", action: "Exported user CSV", actor: "Admin", time: "3 hours ago" },
    { id: "6", action: "Enabled AI headshot feature", actor: "Super Admin", time: "5 hours ago" },
    { id: "7", action: "Reviewed flagged content", actor: "Admin", time: "6 hours ago" },
    { id: "8", action: "Added new taxonomy role", actor: "Super Admin", time: "Yesterday" },
  ],
  alerts: [
    { id: "1", title: "Pending reports need review", severity: "warning", count: 6 },
    { id: "2", title: "Flagged content detected", severity: "error", count: 3 },
    { id: "3", title: "System health: all services operational", severity: "info" },
  ],
  aiUsage: [
    { name: "Bio Generator", usageCount: 342, enabled: true },
    { name: "Headshot Enhancer", usageCount: 189, enabled: true },
    { name: "Role Matcher", usageCount: 97, enabled: true },
    { name: "Script Analyzer", usageCount: 54, enabled: false },
    { name: "Self-Tape Coach", usageCount: 128, enabled: true },
  ],
  userGrowth: {
    signupsThisWeek: 48,
    roles: [
      { name: "Actor", count: 412 },
      { name: "Director", count: 87 },
      { name: "Producer", count: 134 },
      { name: "Cinematographer", count: 96 },
      { name: "Writer", count: 78 },
      { name: "Other", count: 477 },
    ],
  },
  recentUsers: [
    { id: "1", name: "Marcus Chen", email: "marcus@example.com", role: "Actor", membership: "PRO_SUPPLY", createdAt: "2026-03-12" },
    { id: "2", name: "Ava Rodriguez", email: "ava@example.com", role: "Director", membership: "HIRING_PRO", createdAt: "2026-03-11" },
    { id: "3", name: "Jordan Davis", email: "jordan@example.com", role: "Producer", membership: "FREE", createdAt: "2026-03-11" },
    { id: "4", name: "Priya Sharma", email: "priya@example.com", role: "Cinematographer", membership: "PRO_SUPPLY", createdAt: "2026-03-10" },
    { id: "5", name: "Liam O'Brien", email: "liam@example.com", role: "Writer", membership: "FREE", createdAt: "2026-03-10" },
    { id: "6", name: "Sophia Kim", email: "sophia@example.com", role: "Actor", membership: "PRO_SUPPLY", createdAt: "2026-03-09" },
    { id: "7", name: "Tyler Brooks", email: "tyler@example.com", role: "Editor", membership: "FREE", createdAt: "2026-03-09" },
    { id: "8", name: "Nina Petrov", email: "nina@example.com", role: "Producer", membership: "AGENCY_STUDIO", createdAt: "2026-03-08" },
    { id: "9", name: "Carlos Vega", email: "carlos@example.com", role: "Actor", membership: "FREE", createdAt: "2026-03-08" },
    { id: "10", name: "Emma Liu", email: "emma@example.com", role: "Director", membership: "HIRING_PRO", createdAt: "2026-03-07" },
  ],
};

// ---------------------------------------------------------------------------
// Admin Dashboard page
// ---------------------------------------------------------------------------

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          // Fall back to mock data if API not ready
          setStats(fallbackStats);
        }
      } catch {
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Stagger animation wrapper */}
      <style jsx>{`
        .stagger-children > * {
          opacity: 0;
          transform: translateY(12px);
          animation: staggerIn 0.45s ease-out forwards;
        }
        .stagger-children > *:nth-child(1) { animation-delay: 0.04s; }
        .stagger-children > *:nth-child(2) { animation-delay: 0.08s; }
        .stagger-children > *:nth-child(3) { animation-delay: 0.12s; }
        .stagger-children > *:nth-child(4) { animation-delay: 0.16s; }
        .stagger-children > *:nth-child(5) { animation-delay: 0.20s; }
        .stagger-children > *:nth-child(6) { animation-delay: 0.24s; }
        @keyframes staggerIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* ── KPI Row ── */}
      <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : stats?.kpis.map((kpi, i) => {
              const Icon = kpiIcons[i] ?? UsersIcon;
              return (
                <div
                  key={kpi.label}
                  className="rounded-2xl bg-[#1f1f2a] p-6 space-y-3 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <Icon className="h-5 w-5 text-[#9e9eab]" />
                  <p className="text-3xl font-light text-[#c4a47a]">{kpi.value}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab]">{kpi.label}</p>
                  <p
                    className={`flex items-center gap-1 text-xs ${
                      kpi.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {kpi.trend === "up" ? (
                      <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                    )}
                    {kpi.change}
                  </p>
                </div>
              );
            })}
      </div>

      {/* ── Row 2: Activity + Alerts ── */}
      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.04] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
            <ClockIcon className="h-4 w-4 text-[#9e9eab]" />
            <h2 className="text-sm font-light tracking-wide text-[#f0efe6]">Recent Activity</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-3.5">
                    <SkeletonBlock className="h-4 w-3/4 mb-2" />
                    <SkeletonBlock className="h-3 w-1/3" />
                  </div>
                ))
              : stats?.recentActivity.map((evt) => (
                  <div key={evt.id} className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <p className="text-[13px] text-[#f0efe6]">{evt.action}</p>
                    <p className="text-xs text-[#9e9eab] mt-0.5">
                      {evt.actor} &middot; {evt.time}
                    </p>
                  </div>
                ))}
          </div>
        </div>

        {/* Alert Center */}
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.04] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
            <ExclamationTriangleIcon className="h-4 w-4 text-[#9e9eab]" />
            <h2 className="text-sm font-light tracking-wide text-[#f0efe6]">Alert Center</h2>
          </div>
          <div className="p-4 space-y-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-14 w-full" />
                ))
              : stats?.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                      alert.severity === "error"
                        ? "bg-red-500/[0.08] border border-red-500/20"
                        : alert.severity === "warning"
                        ? "bg-amber-500/[0.08] border border-amber-500/20"
                        : "bg-emerald-500/[0.06] border border-emerald-500/15"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        alert.severity === "error"
                          ? "bg-red-500/20 text-red-400"
                          : alert.severity === "warning"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      <ExclamationTriangleIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#f0efe6]">{alert.title}</p>
                    </div>
                    {alert.count !== undefined && (
                      <span className="shrink-0 text-xs font-medium text-[#c4a47a] bg-[#c4a47a]/10 px-2 py-0.5 rounded-full">
                        {alert.count}
                      </span>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: AI Usage + User Growth ── */}
      <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AI Usage */}
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.04] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
            <SparklesIcon className="h-4 w-4 text-[#9e9eab]" />
            <h2 className="text-sm font-light tracking-wide text-[#f0efe6]">AI Usage</h2>
          </div>
          <div className="p-4 space-y-2">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-10 w-full" />
                ))
              : stats?.aiUsage.map((feat) => {
                  const maxUsage = Math.max(...(stats.aiUsage.map((f) => f.usageCount) || [1]));
                  const widthPct = Math.max((feat.usageCount / maxUsage) * 100, 4);
                  return (
                    <div key={feat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-[#f0efe6]">{feat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#9e9eab]">
                            {feat.usageCount.toLocaleString()} uses
                          </span>
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              feat.enabled ? "bg-emerald-400" : "bg-red-400/60"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#9d7663] to-[#c4a47a] transition-all duration-700"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>

        {/* User Growth */}
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.04] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
            <UserPlusIcon className="h-4 w-4 text-[#9e9eab]" />
            <h2 className="text-sm font-light tracking-wide text-[#f0efe6]">User Growth</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                <SkeletonBlock className="h-12 w-32" />
                <SkeletonBlock className="h-4 w-48" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBlock key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <p className="text-3xl font-light text-[#c4a47a]">
                    {stats?.userGrowth.signupsThisWeek}
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mt-1">
                    New signups this week
                  </p>
                </div>
                <div className="space-y-2.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9e9eab] font-semibold">
                    Role Distribution
                  </p>
                  {stats?.userGrowth.roles.map((role) => {
                    const maxCount = Math.max(
                      ...(stats.userGrowth.roles.map((r) => r.count) || [1])
                    );
                    const widthPct = Math.max((role.count / maxCount) * 100, 4);
                    return (
                      <div key={role.name} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-[13px] text-[#cdc9bc]">
                          {role.name}
                        </span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7a5c48] to-[#9d7663] transition-all duration-700"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs text-[#9e9eab]">
                          {role.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 4: Recent Users Table ── */}
      <div className="stagger-children">
        <div className="rounded-2xl bg-[#1f1f2a] border border-white/[0.04] overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06]">
            <UsersIcon className="h-4 w-4 text-[#9e9eab]" />
            <h2 className="text-sm font-light tracking-wide text-[#f0efe6]">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : (
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e9eab]">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e9eab]">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e9eab]">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e9eab]">
                      Membership
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9e9eab]">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {stats?.recentUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3.5 text-[13px] text-[#f0efe6] font-normal">
                        {u.name}
                      </td>
                      <td className="px-6 py-3.5 text-[13px] text-[#cdc9bc]">
                        {u.email}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center rounded-md bg-[#9d7663]/15 px-2 py-0.5 text-[11px] font-medium text-[#c4a47a]">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            u.membership === "FREE"
                              ? "bg-white/[0.06] text-[#9e9eab]"
                              : "bg-[#c4a47a]/10 text-[#c4a47a]"
                          }`}
                        >
                          {u.membership.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[13px] text-[#9e9eab]">
                        {u.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
