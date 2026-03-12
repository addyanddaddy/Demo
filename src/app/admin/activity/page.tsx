"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityLog {
  id: string;
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACTION_TYPES = [
  "ban_user",
  "unban_user",
  "resolve_report",
  "dismiss_report",
  "update_ai_config",
  "delete_post",
  "delete_message",
  "change_role",
  "update_rule",
  "create_rule",
  "delete_rule",
] as const;

const ACTION_BADGE_COLORS: Record<string, string> = {
  ban_user: "bg-red-500/15 text-red-400",
  unban_user: "bg-emerald-500/15 text-emerald-400",
  resolve_report: "bg-blue-500/15 text-blue-400",
  dismiss_report: "bg-white/[0.06] text-[#cdc9bc]",
  update_ai_config: "bg-purple-500/15 text-purple-400",
  delete_post: "bg-orange-500/15 text-orange-400",
  delete_message: "bg-orange-500/15 text-orange-400",
  change_role: "bg-amber-500/15 text-amber-400",
  update_rule: "bg-blue-500/15 text-blue-400",
  create_rule: "bg-emerald-500/15 text-emerald-400",
  delete_rule: "bg-red-500/15 text-red-400",
};

const ACTION_DOT_COLORS: Record<string, string> = {
  ban_user: "bg-red-400",
  unban_user: "bg-emerald-400",
  resolve_report: "bg-blue-400",
  dismiss_report: "bg-[#9e9eab]",
  update_ai_config: "bg-purple-400",
  delete_post: "bg-orange-400",
  delete_message: "bg-orange-400",
  change_role: "bg-amber-400",
  update_rule: "bg-blue-400",
  create_rule: "bg-emerald-400",
  delete_rule: "bg-red-400",
};

const ACTION_LABELS: Record<string, string> = {
  ban_user: "Ban User",
  unban_user: "Unban User",
  resolve_report: "Resolve Report",
  dismiss_report: "Dismiss Report",
  update_ai_config: "Update AI Config",
  delete_post: "Delete Post",
  delete_message: "Delete Message",
  change_role: "Change Role",
  update_rule: "Update Rule",
  create_rule: "Create Rule",
  delete_rule: "Delete Rule",
};

const TARGET_ROUTES: Record<string, string> = {
  user: "/admin/users",
  post: "/admin/content",
  comment: "/admin/content",
  message: "/admin/messages",
  report: "/admin/reports",
  ai_config: "/admin/ai",
  platform_rule: "/admin/settings",
};

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fullDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAction(log: ActivityLog): string {
  const label = ACTION_LABELS[log.action] || log.action.replace(/_/g, " ");
  const details = log.details;
  const targetShort = log.targetId.slice(0, 8);

  if (details) {
    if (typeof details.title === "string") return `${label}: ${details.title}`;
    if (typeof details.userName === "string") return `${label}: ${details.userName}`;
    if (typeof details.reason === "string") return `${label} (${details.reason})`;
    if (Array.isArray(details.changes))
      return `${label} - changed: ${(details.changes as string[]).join(", ")}`;
  }

  return `${label} on ${log.targetType} ${targetShort}...`;
}

function getTargetLink(log: ActivityLog): string | null {
  const base = TARGET_ROUTES[log.targetType];
  if (!base) return null;
  return base;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [adminFilter, setAdminFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Unique admin IDs from data (for filter dropdown)
  const [knownAdmins, setKnownAdmins] = useState<string[]>([]);

  // -----------------------------------------------------------------------
  // Fetch logs
  // -----------------------------------------------------------------------

  const fetchLogs = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(PAGE_SIZE));
        if (actionFilter) params.set("action", actionFilter);
        if (adminFilter) params.set("adminUserId", adminFilter);

        const res = await fetch(`/api/admin/activity?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch activity");

        let data = json.data as ActivityLog[];

        // Client-side date filtering (API doesn't support date range)
        if (dateFrom) {
          const from = new Date(dateFrom);
          data = data.filter((l) => new Date(l.createdAt) >= from);
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          data = data.filter((l) => new Date(l.createdAt) <= to);
        }

        setLogs(data);
        setPagination(json.pagination);

        // Collect unique admin IDs
        const ids = data.map((l) => l.adminUserId);
        setKnownAdmins((prev) => {
          const combined = new Set([...prev, ...ids]);
          return Array.from(combined);
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch activity");
      } finally {
        setLoading(false);
      }
    },
    [actionFilter, adminFilter, dateFrom, dateTo]
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchLogs(newPage);
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-light tracking-wide text-[#f0efe6]">Activity Log</h2>
        <p className="text-sm text-[#9e9eab] mt-1">
          Audit trail of all admin actions on the platform.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-300 underline hover:text-red-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────── */}
      {/* FILTERS                                              */}
      {/* ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {/* Action type */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-[#f0efe6] focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors"
        >
          <option value="" className="bg-[#1f1f2a]">
            All Actions
          </option>
          {ACTION_TYPES.map((action) => (
            <option key={action} value={action} className="bg-[#1f1f2a]">
              {ACTION_LABELS[action] || action}
            </option>
          ))}
        </select>

        {/* Admin user */}
        <select
          value={adminFilter}
          onChange={(e) => setAdminFilter(e.target.value)}
          className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-[#f0efe6] focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors"
        >
          <option value="" className="bg-[#1f1f2a]">
            All Admins
          </option>
          {knownAdmins.map((id) => (
            <option key={id} value={id} className="bg-[#1f1f2a]">
              {id.slice(0, 12)}...
            </option>
          ))}
        </select>

        {/* Date from */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From"
          className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-[#f0efe6] focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors [color-scheme:dark]"
        />

        {/* Date to */}
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To"
          className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-[#f0efe6] focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors [color-scheme:dark]"
        />

        {/* Clear filters */}
        {(actionFilter || adminFilter || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setActionFilter("");
              setAdminFilter("");
              setDateFrom("");
              setDateTo("");
            }}
            className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.1] transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────── */}
      {/* TIMELINE                                             */}
      {/* ─────────────────────────────────────────────────── */}

      {/* Loading state */}
      {loading && (
        <div className="relative pl-6">
          <div className="absolute left-[3px] top-0 bottom-0 w-px bg-white/[0.06]" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative ml-6 animate-pulse">
                <div className="absolute -left-[27px] top-4 h-2 w-2 rounded-full bg-white/[0.1]" />
                <div className="rounded-xl bg-[#1f1f2a] p-4">
                  <div className="h-3 w-32 rounded bg-white/[0.06] mb-3" />
                  <div className="h-3 w-full rounded bg-white/[0.04] mb-2" />
                  <div className="h-3 w-48 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && logs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#1f1f2a]/50 p-12 text-center">
          <div className="text-[#9e9eab] text-4xl mb-3">&#128221;</div>
          <p className="text-sm text-[#cdc9bc]">No activity found.</p>
          <p className="text-xs text-[#9e9eab] mt-1">
            {actionFilter || adminFilter || dateFrom || dateTo
              ? "Try adjusting your filters."
              : "Admin actions will appear here once performed."}
          </p>
        </div>
      )}

      {/* Activity timeline */}
      {!loading && logs.length > 0 && (
        <div className="relative pl-6">
          {/* Vertical timeline line */}
          <div className="absolute left-[3px] top-0 bottom-0 w-px bg-white/[0.06]" />

          <div className="space-y-3">
            {logs.map((log) => {
              const targetLink = getTargetLink(log);
              const dotColor = ACTION_DOT_COLORS[log.action] || "bg-[#9e9eab]";
              const badgeColor =
                ACTION_BADGE_COLORS[log.action] || "bg-white/[0.06] text-[#cdc9bc]";

              return (
                <div key={log.id} className="relative ml-6 group">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[27px] top-4 h-2 w-2 rounded-full ${dotColor}`}
                  />

                  {/* Entry card */}
                  <div className="rounded-xl bg-[#1f1f2a] p-4 hover:bg-[#1f1f2a]/80 transition-colors group-hover:bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Action description */}
                        <p className="text-sm text-[#f0efe6] leading-relaxed">
                          {formatAction(log)}
                        </p>

                        {/* Meta row */}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {/* Action type badge */}
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeColor}`}
                          >
                            {ACTION_LABELS[log.action] || log.action}
                          </span>

                          {/* Admin ID */}
                          <span className="text-xs text-[#9e9eab]">
                            by {log.adminUserId.slice(0, 10)}...
                          </span>

                          {/* Target link */}
                          {targetLink && (
                            <Link
                              href={targetLink}
                              className="text-xs text-[#c4a47a] hover:text-[#9d7663] transition-colors"
                            >
                              View {log.targetType.replace(/_/g, " ")} &rarr;
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="shrink-0 text-right">
                        <span
                          className="text-xs text-[#9e9eab] cursor-default"
                          title={fullDate(log.createdAt)}
                        >
                          {relativeTime(log.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────── */}
      {/* PAGINATION                                           */}
      {/* ─────────────────────────────────────────────────── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#9e9eab]">
            Showing {(pagination.page - 1) * pagination.limit + 1}
            &ndash;
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg px-3 py-1.5 text-xs text-[#9e9eab] hover:bg-white/[0.06] hover:text-[#f0efe6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 7) {
                pageNum = i + 1;
              } else if (pagination.page <= 4) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 3) {
                pageNum = pagination.totalPages - 6 + i;
              } else {
                pageNum = pagination.page - 3 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    pageNum === pagination.page
                      ? "bg-white/[0.08] text-[#f0efe6]"
                      : "text-[#9e9eab] hover:bg-white/[0.06] hover:text-[#f0efe6]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg px-3 py-1.5 text-xs text-[#9e9eab] hover:bg-white/[0.06] hover:text-[#f0efe6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
