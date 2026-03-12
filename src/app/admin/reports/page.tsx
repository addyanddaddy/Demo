"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  NoSymbolIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReporterInfo {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface TargetPreview {
  id: string;
  name?: string | null;
  email?: string | null;
  content?: string | null;
  author?: { name: string | null } | null;
  sender?: { name: string | null } | null;
  recipient?: { name: string | null } | null;
}

interface Report {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  category: string;
  description: string | null;
  status: string;
  resolvedById: string | null;
  resolvedAt: string | null;
  resolution: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: ReporterInfo | null;
  targetPreview: TargetPreview | null;
}

interface Counts {
  pending: number;
  reviewing: number;
  resolved: number;
  dismissed: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type StatusTab = "all" | "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED";
type CategoryFilter = "" | "SPAM" | "HARASSMENT" | "INAPPROPRIATE_CONTENT" | "FAKE_PROFILE" | "SCAM" | "COPYRIGHT" | "OTHER";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string; stripe: string }> = {
  SPAM: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Spam", stripe: "bg-amber-400" },
  HARASSMENT: { bg: "bg-red-500/15", text: "text-red-400", label: "Harassment", stripe: "bg-red-400" },
  INAPPROPRIATE_CONTENT: { bg: "bg-orange-500/15", text: "text-orange-400", label: "Inappropriate Content", stripe: "bg-orange-400" },
  FAKE_PROFILE: { bg: "bg-purple-500/15", text: "text-purple-400", label: "Fake Profile", stripe: "bg-purple-400" },
  SCAM: { bg: "bg-red-500/15", text: "text-red-400", label: "Scam", stripe: "bg-red-500" },
  COPYRIGHT: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Copyright", stripe: "bg-blue-400" },
  OTHER: { bg: "bg-white/[0.06]", text: "text-[#b8b5a8]", label: "Other", stripe: "bg-[#8a8a96]" },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Pending" },
  REVIEWING: { bg: "bg-blue-500/15", text: "text-blue-400", label: "Reviewing" },
  RESOLVED: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Resolved" },
  DISMISSED: { bg: "bg-white/[0.06]", text: "text-[#8a8a96]", label: "Dismissed" },
};

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "", label: "All Categories" },
  { value: "SPAM", label: "Spam" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
  { value: "FAKE_PROFILE", label: "Fake Profile" },
  { value: "SCAM", label: "Scam" },
  { value: "COPYRIGHT", label: "Copyright" },
  { value: "OTHER", label: "Other" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getTargetLabel(report: Report): string {
  const type = report.targetType;
  const preview = report.targetPreview;
  if (!preview) return `${type} (deleted or not found)`;

  if (type === "user" || type === "profile") {
    return `user — ${preview.name || preview.email || preview.id}`;
  }
  if (type === "post") {
    const authorName = preview.author?.name || "Unknown";
    const snippet = preview.content ? preview.content.substring(0, 60) : "...";
    return `post by ${authorName} — "${snippet}${(preview.content?.length || 0) > 60 ? "..." : ""}"`;
  }
  if (type === "comment") {
    const authorName = preview.author?.name || "Unknown";
    const snippet = preview.content ? preview.content.substring(0, 60) : "...";
    return `comment by ${authorName} — "${snippet}${(preview.content?.length || 0) > 60 ? "..." : ""}"`;
  }
  if (type === "message") {
    const senderName = preview.sender?.name || "Unknown";
    const recipientName = preview.recipient?.name || "Unknown";
    const snippet = preview.content ? preview.content.substring(0, 50) : "...";
    return `message ${senderName} → ${recipientName} — "${snippet}${(preview.content?.length || 0) > 50 ? "..." : ""}"`;
  }
  return `${type} — ${preview.id}`;
}

// ---------------------------------------------------------------------------
// Skeleton Loader
// ---------------------------------------------------------------------------

function ReportSkeleton() {
  return (
    <div className="bg-[#1a1a22] rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-5 w-20 rounded-full bg-white/[0.06]" />
        <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
        <div className="ml-auto h-3 w-16 rounded bg-white/[0.06]" />
      </div>
      <div className="h-3 w-32 rounded bg-white/[0.06] mb-3" />
      <div className="h-4 w-3/4 rounded bg-white/[0.06] mb-2" />
      <div className="h-3 w-1/2 rounded bg-white/[0.06]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Resolution Modal
// ---------------------------------------------------------------------------

function ResolutionModal({
  report,
  onClose,
  onAction,
  loading,
}: {
  report: Report;
  onClose: () => void;
  onAction: (action: string, resolution: string, banReason?: string) => void;
  loading: boolean;
}) {
  const [resolution, setResolution] = useState("");
  const [banReason, setBanReason] = useState("");
  const [showBanConfirm, setShowBanConfirm] = useState(false);

  const catStyle = CATEGORY_STYLES[report.category] || CATEGORY_STYLES.OTHER;
  const statusStyle = STATUS_STYLES[report.status] || STATUS_STYLES.PENDING;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1a1a22] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <ShieldExclamationIcon className="h-5 w-5 text-[#c4a47a]" />
            <h3 className="text-base font-light tracking-wide text-[#edebe2]">Resolve Report</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.04] transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Report Info */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${catStyle.bg} ${catStyle.text}`}>
              {catStyle.label}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
          </div>
          <p className="text-sm text-[#b8b5a8]">
            Reported {getTargetLabel(report)}
          </p>
          {report.description && (
            <p className="mt-2 text-[13px] text-[#8a8a96] italic">
              &ldquo;{report.description}&rdquo;
            </p>
          )}
        </div>

        {/* Resolution Notes */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#8a8a96] uppercase tracking-wider mb-2">
              Resolution Notes
            </label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              placeholder="Describe the action taken and reason..."
              className="w-full rounded-xl bg-[#242430] border border-white/[0.08] px-4 py-3 text-sm text-[#edebe2] placeholder-[#8a8a96] focus:outline-none focus:border-[#9d7663]/50 focus:ring-1 focus:ring-[#9d7663]/25 resize-none transition-colors"
            />
          </div>

          {showBanConfirm && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-400 font-medium mb-2">Confirm User Ban</p>
              <p className="text-[13px] text-[#b8b5a8] mb-3">This will permanently ban the target user from the platform.</p>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Ban reason..."
                className="w-full rounded-lg bg-[#242430] border border-red-500/20 px-3 py-2 text-sm text-[#edebe2] placeholder-[#8a8a96] focus:outline-none focus:border-red-400/50 mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onAction("ban_target", resolution, banReason)}
                  disabled={loading}
                  className="rounded-lg bg-red-500/20 px-4 py-2 text-[13px] font-medium text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                >
                  {loading ? "Banning..." : "Confirm Ban"}
                </button>
                <button
                  onClick={() => setShowBanConfirm(false)}
                  className="rounded-lg px-4 py-2 text-[13px] text-[#8a8a96] hover:text-[#edebe2] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
          {report.status !== "RESOLVED" && report.status !== "DISMISSED" && (
            <>
              <button
                onClick={() => onAction("resolve", resolution)}
                disabled={loading}
                className="rounded-lg bg-emerald-500/15 px-4 py-2 text-[13px] font-medium text-emerald-400 hover:bg-emerald-500/25 transition-colors disabled:opacity-50"
              >
                <CheckCircleIcon className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                {loading ? "..." : "Resolve"}
              </button>
              <button
                onClick={() => onAction("dismiss", resolution)}
                disabled={loading}
                className="rounded-lg bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-[#8a8a96] hover:bg-white/[0.1] hover:text-[#edebe2] transition-colors disabled:opacity-50"
              >
                <XCircleIcon className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                Dismiss
              </button>
            </>
          )}
          {!showBanConfirm && (
            <button
              onClick={() => setShowBanConfirm(true)}
              disabled={loading}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-[13px] font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <NoSymbolIcon className="inline h-4 w-4 mr-1.5 -mt-0.5" />
              Ban User
            </button>
          )}
          <button
            onClick={() => onAction("delete_content", resolution)}
            disabled={loading}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-[13px] font-medium text-red-400/80 hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <TrashIcon className="inline h-4 w-4 mr-1.5 -mt-0.5" />
            Delete Content
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [counts, setCounts] = useState<Counts>({ pending: 0, reviewing: 0, resolved: 0, dismissed: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [category, setCategory] = useState<CategoryFilter>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [resolveReport, setResolveReport] = useState<Report | null>(null);

  const fetchReports = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusTab !== "all") params.set("status", statusTab);
      if (category) params.set("category", category);

      const res = await fetch(`/api/admin/reports?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch");
      setReports(json.data);
      setCounts(json.counts);
      setPagination(json.pagination);
    } catch (e: any) {
      setError(e.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [statusTab, category]);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  // Status update (PATCH)
  async function handleStatusUpdate(reportId: string, status: string) {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      fetchReports(pagination.page);
    } catch (e: any) {
      alert(e.message || "Failed to update report");
    } finally {
      setActionLoading(false);
    }
  }

  // Modal actions (POST)
  async function handleModalAction(action: string, resolution: string, banReason?: string) {
    if (!resolveReport) return;
    setActionLoading(true);
    try {
      if (action === "resolve" || action === "dismiss") {
        const status = action === "resolve" ? "RESOLVED" : "DISMISSED";
        const res = await fetch("/api/admin/reports", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportId: resolveReport.id, status, resolution }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
      } else {
        // ban_target or delete_content
        const res = await fetch("/api/admin/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, reportId: resolveReport.id, resolution, banReason }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
      }
      setResolveReport(null);
      fetchReports(pagination.page);
    } catch (e: any) {
      alert(e.message || "Failed to perform action");
    } finally {
      setActionLoading(false);
    }
  }

  // Status tab items
  const tabs: { key: StatusTab; label: string; count?: number; color: string }[] = [
    { key: "PENDING", label: "Pending", count: counts.pending, color: "text-amber-400" },
    { key: "REVIEWING", label: "Reviewing", count: counts.reviewing, color: "text-blue-400" },
    { key: "RESOLVED", label: "Resolved", count: counts.resolved, color: "text-emerald-400" },
    { key: "DISMISSED", label: "Dismissed", count: counts.dismissed, color: "text-[#8a8a96]" },
    { key: "all", label: "All", color: "text-[#edebe2]" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light tracking-wide text-[#edebe2]">Reports & Violations</h2>
        <p className="mt-1 text-sm text-[#8a8a96]">
          Review and resolve user reports to maintain platform safety.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending", count: counts.pending, bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", icon: ClockIcon },
          { label: "Reviewing", count: counts.reviewing, bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", icon: EyeIcon },
          { label: "Resolved", count: counts.resolved, bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", icon: CheckCircleIcon },
          { label: "Dismissed", count: counts.dismissed, bg: "bg-white/[0.04]", border: "border-white/[0.08]", text: "text-[#8a8a96]", icon: XCircleIcon },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl ${stat.bg} border ${stat.border} p-4 flex items-center gap-3`}
          >
            <stat.icon className={`h-8 w-8 ${stat.text} opacity-60`} />
            <div>
              <p className={`text-2xl font-light ${stat.text}`}>{stat.count}</p>
              <p className="text-[11px] text-[#8a8a96] uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex rounded-xl bg-[#1a1a22] border border-white/[0.08] p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                statusTab === tab.key
                  ? "bg-white/[0.08] text-[#edebe2]"
                  : "text-[#8a8a96] hover:text-[#b8b5a8]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] font-semibold ${statusTab === tab.key ? tab.color : "text-[#8a8a96]"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          className="rounded-xl bg-[#1a1a22] border border-white/[0.08] px-4 py-2.5 text-[13px] text-[#edebe2] focus:outline-none focus:border-[#9d7663]/50 appearance-none cursor-pointer min-w-[180px]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238a8a96' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px" }}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1a22] text-[#edebe2]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => fetchReports(pagination.page)}
            className="ml-auto text-xs text-red-400 hover:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <ReportSkeleton key={i} />)
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a22] flex items-center justify-center mb-4">
              <ShieldExclamationIcon className="h-7 w-7 text-[#8a8a96]" />
            </div>
            <h3 className="text-lg font-light text-[#edebe2] mb-1">No reports found</h3>
            <p className="text-sm text-[#8a8a96] max-w-sm">
              {statusTab !== "all"
                ? `No ${statusTab.toLowerCase()} reports at this time.`
                : category
                ? "No reports match the selected category."
                : "No reports have been filed yet."}
            </p>
          </div>
        ) : (
          reports.map((report) => {
            const catStyle = CATEGORY_STYLES[report.category] || CATEGORY_STYLES.OTHER;
            const statusStyle = STATUS_STYLES[report.status] || STATUS_STYLES.PENDING;

            return (
              <div
                key={report.id}
                className="bg-[#1a1a22] rounded-2xl overflow-hidden flex"
              >
                {/* Left color stripe */}
                <div className={`w-1 shrink-0 ${catStyle.stripe}`} />

                {/* Content */}
                <div className="flex-1 p-6">
                  {/* Top Row: Badges + Date */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${catStyle.bg} ${catStyle.text}`}>
                      {catStyle.label}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                    <span className="ml-auto text-[11px] text-[#8a8a96]">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>

                  {/* Reporter */}
                  <p className="text-[12px] text-[#8a8a96] mb-1">
                    Reported by{" "}
                    <span className="text-[#b8b5a8]">
                      {report.reporter?.name || report.reporter?.email || "Unknown user"}
                    </span>
                  </p>

                  {/* Target */}
                  <p className="text-sm text-[#edebe2] mb-2">
                    Reported {getTargetLabel(report)}
                  </p>

                  {/* Description */}
                  {report.description && (
                    <p className="text-[13px] text-[#b8b5a8] italic mb-3 leading-relaxed">
                      &ldquo;{report.description}&rdquo;
                    </p>
                  )}

                  {/* Resolution (if resolved) */}
                  {report.resolution && (
                    <div className="rounded-lg bg-white/[0.04] px-3 py-2 mb-3">
                      <p className="text-[11px] text-[#8a8a96] uppercase tracking-wider mb-1">Resolution</p>
                      <p className="text-[13px] text-[#b8b5a8]">{report.resolution}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {report.status === "PENDING" && (
                      <button
                        onClick={() => handleStatusUpdate(report.id, "REVIEWING")}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-[12px] font-medium text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                      >
                        <EyeIcon className="h-3.5 w-3.5" />
                        Mark Reviewing
                      </button>
                    )}

                    {(report.status === "PENDING" || report.status === "REVIEWING") && (
                      <button
                        onClick={() => setResolveReport(report)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[12px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                        Resolve
                      </button>
                    )}

                    {(report.status === "PENDING" || report.status === "REVIEWING") && (
                      <button
                        onClick={() => {
                          setResolveReport(report);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-[#8a8a96] hover:bg-white/[0.08] hover:text-[#edebe2] transition-colors"
                      >
                        <XCircleIcon className="h-3.5 w-3.5" />
                        Dismiss
                      </button>
                    )}

                    <button
                      onClick={() => setResolveReport(report)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[12px] text-[#8a8a96]">
            Showing {(pagination.page - 1) * pagination.limit + 1}
            {" - "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} reports
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchReports(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-lg p-2 text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => fetchReports(pageNum)}
                  className={`min-w-[32px] rounded-lg px-2 py-1.5 text-[12px] font-medium transition-colors ${
                    pagination.page === pageNum
                      ? "bg-[#9d7663]/20 text-[#c4a47a]"
                      : "text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => fetchReports(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg p-2 text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {resolveReport && (
        <ResolutionModal
          report={resolveReport}
          onClose={() => setResolveReport(null)}
          onAction={handleModalAction}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
