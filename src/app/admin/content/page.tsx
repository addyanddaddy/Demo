"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  EyeIcon,
  NoSymbolIcon,
  FlagIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContentTab = "all" | "flagged" | "removed";

interface PostAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
  displayRole: string;
}

interface AdminPost {
  id: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  postType: string;
  visibility: string;
  likesCount: number;
  commentsCount: number;
  reportCount: number;
  createdAt: string;
  author: PostAuthor;
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

const TABS: { key: ContentTab; label: string }[] = [
  { key: "all", label: "All Posts" },
  { key: "flagged", label: "Flagged" },
  { key: "removed", label: "Removed" },
];

const POST_TYPE_LABELS: Record<string, { label: string; variant: "default" | "primary" | "success" | "warning" | "danger" | "gold" | "teal" }> = {
  update: { label: "Update", variant: "default" },
  announcement: { label: "Announcement", variant: "gold" },
  job_alert: { label: "Job Alert", variant: "primary" },
  welcome: { label: "Welcome", variant: "success" },
  milestone: { label: "Milestone", variant: "teal" },
};

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="bg-[#1a1a22] rounded-2xl p-5 border border-white/[0.08] animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-full bg-white/[0.06]" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-28 rounded bg-white/[0.06]" />
          <div className="h-2.5 w-20 rounded bg-white/[0.04]" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-3/4 rounded bg-white/[0.04]" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 w-12 rounded bg-white/[0.04]" />
        <div className="h-3 w-12 rounded bg-white/[0.04]" />
        <div className="h-3 w-12 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminContentPage() {
  const { data: session } = useSession();

  // State
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ContentTab>("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Expanded content
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; postId: string; preview: string }>({ open: false, postId: "", preview: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Full view modal
  const [viewPost, setViewPost] = useState<AdminPost | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch content
  // ---------------------------------------------------------------------------

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        tab: activeTab,
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/content?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch content");

      setPosts(json.data.posts);
      setPagination(json.data.pagination);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [search, activeTab]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: deleteConfirm.postId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Delete failed");

      setDeleteConfirm({ open: false, postId: "", preview: "" });
      fetchPosts(pagination.page);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBanAuthor = async (userId: string) => {
    // Navigate to admin users page or open a ban flow
    // For now, we redirect — the ban modal lives on the users page
    window.location.href = `/admin/users?search=${userId}`;
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function truncate(text: string, max = 200) {
    if (text.length <= max) return text;
    return text.slice(0, max);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto py-4 px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light tracking-tight text-[#edebe2]">Content Moderation</h1>
        <p className="text-sm text-[#8a8a96] mt-2 leading-relaxed">
          Review, moderate, and manage community content.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#1a1a22] rounded-xl p-1 border border-white/[0.08] w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
              activeTab === tab.key
                ? "bg-white/[0.08] text-[#edebe2]"
                : "text-[#8a8a96] hover:text-[#b8b5a8] hover:bg-white/[0.02]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8a96]" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by content or author..."
          className="w-full rounded-xl bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-[#edebe2] placeholder-[#6b6b78] border border-white/[0.08] focus:border-[#9d7663]/40 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Content grid */}
      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-[#1a1a22] rounded-2xl p-16 text-center border border-white/[0.08]">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="ghost" size="sm" className="mt-4" onClick={() => fetchPosts(pagination.page)}>
            Retry
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-[#1a1a22] rounded-2xl p-16 text-center border border-white/[0.08]">
          <DocumentTextIcon className="h-10 w-10 mx-auto text-[#8a8a96] mb-3" />
          <p className="text-sm text-[#8a8a96]">
            {activeTab === "flagged"
              ? "No flagged content"
              : activeTab === "removed"
              ? "No removed content"
              : "No posts found"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const contentTruncated = post.content.length > 200;
            const displayContent = isExpanded ? post.content : truncate(post.content);
            const typeInfo = POST_TYPE_LABELS[post.postType] || { label: post.postType, variant: "default" as const };

            return (
              <div key={post.id} className="bg-[#1a1a22] rounded-2xl p-5 border border-white/[0.08]">
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={post.author.name} src={post.author.avatarUrl} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#edebe2] truncate">{post.author.name}</span>
                        <span className="text-[11px] text-[#9d7663] font-light">{post.author.displayRole}</span>
                        {post.author.role !== "USER" && (
                          <Badge
                            variant={
                              post.author.role === "SUPER_ADMIN" ? "danger"
                              : post.author.role === "ADMIN" ? "gold"
                              : post.author.role === "MODERATOR" ? "teal"
                              : "default"
                            }
                            size="sm"
                          >
                            {post.author.role === "SUPER_ADMIN" ? "Super Admin"
                              : post.author.role === "ADMIN" ? "Admin"
                              : post.author.role === "MODERATOR" ? "Mod"
                              : post.author.role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8a8a96]">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {/* Post type badge */}
                  <Badge variant={typeInfo.variant} size="sm">
                    {typeInfo.label}
                  </Badge>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <p className="text-sm text-[#edebe2] leading-relaxed whitespace-pre-wrap">
                    {displayContent}
                    {contentTruncated && !isExpanded && (
                      <span className="text-[#8a8a96]">...</span>
                    )}
                  </p>
                  {contentTruncated && (
                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="text-xs text-[#9d7663] hover:text-[#c4a47a] mt-1 transition-colors"
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#8a8a96]">
                      <HeartIcon className="h-3.5 w-3.5" />
                      {post.likesCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#8a8a96]">
                      <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
                      {post.commentsCount}
                    </span>
                    {post.reportCount > 0 && (
                      <span className="flex items-center gap-1.5 text-[11px] text-red-400">
                        <FlagIcon className="h-3.5 w-3.5" />
                        {post.reportCount} {post.reportCount === 1 ? "report" : "reports"}
                      </span>
                    )}
                    {post.visibility === "removed" && (
                      <Badge variant="danger" size="sm">Removed</Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewPost(post)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.04] transition-colors"
                      title="View Full"
                    >
                      <EyeIcon className="h-3.5 w-3.5" />
                      View
                    </button>

                    {post.visibility !== "removed" && (
                      <button
                        onClick={() => setDeleteConfirm({ open: true, postId: post.id, preview: truncate(post.content, 80) })}
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                        title="Delete Post"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}

                    <button
                      onClick={() => handleBanAuthor(post.author.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] text-[#8a8a96] hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                      title="Ban Author"
                    >
                      <NoSymbolIcon className="h-3.5 w-3.5" />
                      Ban
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-[#8a8a96]">
            Showing {(pagination.page - 1) * pagination.limit + 1}
            &ndash;
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchPosts(pagination.page - 1)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="text-[11px] text-[#8a8a96]">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchPosts(pagination.page + 1)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Dialog ─── */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm({ open: false, postId: "", preview: "" })}>
          <div
            className="bg-[#1a1a22] rounded-2xl p-8 border border-white/[0.08] shadow-2xl w-full max-w-md animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-[#edebe2]">Delete Post</h2>
              <button onClick={() => setDeleteConfirm({ open: false, postId: "", preview: "" })} className="p-1 rounded-lg text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.04] transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-[#b8b5a8] mb-3">
              Are you sure you want to remove this post? This action will hide the post from all users.
            </p>

            <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 mb-6">
              <p className="text-xs text-[#8a8a96] italic leading-relaxed">
                &ldquo;{deleteConfirm.preview}{deleteConfirm.preview.length >= 80 ? "..." : ""}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirm({ open: false, postId: "", preview: "" })}
              >
                Cancel
              </Button>
              <button
                disabled={deleteLoading}
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {deleteLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Full Post View Modal ─── */}
      {viewPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setViewPost(null)}>
          <div
            className="bg-[#1a1a22] rounded-2xl p-8 border border-white/[0.08] shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-[#edebe2]">Post Detail</h2>
              <button onClick={() => setViewPost(null)} className="p-1 rounded-lg text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.04] transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mb-5">
              <Avatar name={viewPost.author.name} src={viewPost.author.avatarUrl} size="md" />
              <div>
                <p className="text-sm text-[#edebe2]">{viewPost.author.name}</p>
                <p className="text-[11px] text-[#9d7663]">{viewPost.author.displayRole}</p>
                <p className="text-[11px] text-[#8a8a96]">{formatDate(viewPost.createdAt)}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-[#edebe2] leading-relaxed whitespace-pre-wrap mb-5">
              {viewPost.content}
            </p>

            {/* Media */}
            {viewPost.imageUrl && (
              <div className="mb-5 rounded-xl overflow-hidden">
                <img src={viewPost.imageUrl} alt="Post image" className="w-full object-cover" />
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-5 pt-4 border-t border-white/[0.04]">
              <span className="flex items-center gap-1.5 text-[11px] text-[#8a8a96]">
                <HeartIcon className="h-3.5 w-3.5" />
                {viewPost.likesCount} likes
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#8a8a96]">
                <ChatBubbleLeftIcon className="h-3.5 w-3.5" />
                {viewPost.commentsCount} comments
              </span>
              {viewPost.reportCount > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-red-400">
                  <FlagIcon className="h-3.5 w-3.5" />
                  {viewPost.reportCount} reports
                </span>
              )}
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/[0.04]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1">Post ID</p>
                <p className="text-[11px] text-[#edebe2] font-mono truncate">{viewPost.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1">Type</p>
                <Badge variant={POST_TYPE_LABELS[viewPost.postType]?.variant || "default"} size="sm">
                  {POST_TYPE_LABELS[viewPost.postType]?.label || viewPost.postType}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1">Visibility</p>
                <p className="text-[11px] text-[#edebe2]">{viewPost.visibility}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1">Author ID</p>
                <p className="text-[11px] text-[#edebe2] font-mono truncate">{viewPost.author.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
