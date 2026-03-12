"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  FlagIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { FlagIcon as FlagSolidIcon } from "@heroicons/react/24/solid";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserPreview {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

interface MessageReport {
  id: string;
  category: string;
  status: string;
}

interface AdminMessage {
  id: string;
  sender: UserPreview;
  recipient: UserPreview;
  content: string;
  contentPreview: string;
  readAt: string | null;
  createdAt: string;
  isReported: boolean;
  report: MessageReport | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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

function userInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Skeleton Loader
// ---------------------------------------------------------------------------

function MessageSkeleton() {
  return (
    <div className="bg-[#1a1a22] rounded-xl p-4 mb-2 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-20 rounded bg-white/[0.06]" />
        <div className="h-3 w-4 rounded bg-white/[0.06]" />
        <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-20 rounded bg-white/[0.06]" />
        <div className="ml-auto h-3 w-12 rounded bg-white/[0.06]" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-white/[0.06]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar Component
// ---------------------------------------------------------------------------

function MiniAvatar({ user }: { user: UserPreview }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name || "User"}
        className="w-8 h-8 rounded-full object-cover border border-white/[0.08]"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#9d7663]/20 flex items-center justify-center text-[10px] font-semibold text-[#c4a47a] border border-white/[0.08]">
      {userInitials(user.name)}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "flagged">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMessages = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20", filter });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`/api/admin/messages?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch");
      setMessages(json.data);
      setPagination(json.pagination);
    } catch (e: any) {
      setError(e.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filter]);

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  // Actions
  async function handleFlag(messageId: string) {
    setActionLoading(messageId);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flag", messageId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      // Refresh
      fetchMessages(pagination.page);
    } catch (e: any) {
      alert(e.message || "Failed to flag message");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(messageId: string) {
    if (!confirm("Are you sure you want to delete this message? This cannot be undone.")) return;
    setActionLoading(messageId);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", messageId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      fetchMessages(pagination.page);
    } catch (e: any) {
      alert(e.message || "Failed to delete message");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-light tracking-wide text-[#edebe2]">Messages Monitoring</h2>
        <p className="mt-1 text-sm text-[#8a8a96]">
          Monitor, search, and moderate platform messages.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8a96]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by content, sender, or recipient..."
            className="w-full rounded-xl bg-[#1a1a22] border border-white/[0.08] py-2.5 pl-10 pr-4 text-sm text-[#edebe2] placeholder-[#8a8a96] focus:outline-none focus:border-[#9d7663]/50 focus:ring-1 focus:ring-[#9d7663]/25 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-xl bg-[#1a1a22] border border-white/[0.08] p-1">
          {(["all", "flagged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-white/[0.08] text-[#edebe2]"
                  : "text-[#8a8a96] hover:text-[#b8b5a8]"
              }`}
            >
              {f === "flagged" && <FlagSolidIcon className="inline h-3.5 w-3.5 mr-1.5 text-red-400" />}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => fetchMessages(pagination.page)}
            className="ml-auto text-xs text-red-400 hover:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-0">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <MessageSkeleton key={i} />)
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a22] flex items-center justify-center mb-4">
              <MagnifyingGlassIcon className="h-7 w-7 text-[#8a8a96]" />
            </div>
            <h3 className="text-lg font-light text-[#edebe2] mb-1">No messages found</h3>
            <p className="text-sm text-[#8a8a96] max-w-sm">
              {filter === "flagged"
                ? "No flagged messages at this time."
                : search
                ? "Try adjusting your search terms."
                : "No messages on the platform yet."}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isExpanded = expandedId === msg.id;
            const isActioning = actionLoading === msg.id;

            return (
              <div
                key={msg.id}
                className={`bg-[#1a1a22] rounded-xl p-4 mb-2 transition-all duration-200 hover:bg-[#1e1e28] ${
                  msg.isReported ? "border-l-2 border-red-400/50" : ""
                }`}
              >
                {/* Main Row */}
                <div className="flex items-start gap-3">
                  {/* Sender */}
                  <div className="flex items-center gap-2 min-w-0 shrink-0">
                    <MiniAvatar user={msg.sender} />
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#edebe2] font-medium truncate max-w-[120px]">
                        {msg.sender.name || msg.sender.email}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRightIcon className="h-4 w-4 text-[#8a8a96] shrink-0 mt-2" />

                  {/* Recipient */}
                  <div className="flex items-center gap-2 min-w-0 shrink-0">
                    <MiniAvatar user={msg.recipient} />
                    <div className="min-w-0">
                      <p className="text-[13px] text-[#edebe2] font-medium truncate max-w-[120px]">
                        {msg.recipient.name || msg.recipient.email}
                      </p>
                    </div>
                  </div>

                  {/* Spacer + Meta */}
                  <div className="flex items-center gap-2 ml-auto shrink-0">
                    {msg.isReported && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                        <FlagSolidIcon className="h-3 w-3" />
                        Flagged
                      </span>
                    )}
                    <span className="text-[11px] text-[#8a8a96] whitespace-nowrap">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="mt-2.5 ml-0">
                  <p className="text-sm text-[#b8b5a8] leading-relaxed">
                    {isExpanded ? msg.content : msg.contentPreview}
                    {!isExpanded && msg.content.length > 100 && (
                      <span className="text-[#8a8a96]">...</span>
                    )}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    {isExpanded ? "Collapse" : "View Full"}
                  </button>

                  {!msg.isReported && (
                    <button
                      onClick={() => handleFlag(msg.id)}
                      disabled={isActioning}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-amber-400/80 hover:bg-amber-500/10 hover:text-amber-400 transition-colors disabled:opacity-50"
                    >
                      <FlagIcon className="h-3.5 w-3.5" />
                      Flag
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={isActioning}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    Delete
                  </button>

                  {isActioning && (
                    <div className="ml-2 h-3.5 w-3.5 rounded-full border-2 border-white/20 border-t-[#c4a47a] animate-spin" />
                  )}
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
            {pagination.total} messages
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchMessages(pagination.page - 1)}
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
                  onClick={() => fetchMessages(pageNum)}
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
              onClick={() => fetchMessages(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-lg p-2 text-[#8a8a96] hover:bg-white/[0.04] hover:text-[#edebe2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
