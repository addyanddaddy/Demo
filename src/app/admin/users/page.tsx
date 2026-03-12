"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  UserIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UserRole = "USER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
type MembershipTier = "FREE" | "PRO_SUPPLY" | "HIRING_PRO" | "DEPARTMENT_HEAD" | "AGENCY_STUDIO";

interface UserBan {
  userId: string;
  reason: string;
  type: string;
  expiresAt: string | null;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  membershipTier: MembershipTier;
  postCount: number;
  isBanned: boolean;
  ban: UserBan | null;
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

const ROLE_BADGE_MAP: Record<UserRole, { label: string; variant: "default" | "primary" | "success" | "warning" | "danger" | "gold" | "teal" }> = {
  USER: { label: "User", variant: "default" },
  MODERATOR: { label: "Moderator", variant: "teal" },
  ADMIN: { label: "Admin", variant: "gold" },
  SUPER_ADMIN: { label: "Super Admin", variant: "danger" },
};

const TIER_LABELS: Record<MembershipTier, string> = {
  FREE: "Free",
  PRO_SUPPLY: "Pro Supply",
  HIRING_PRO: "Hiring Pro",
  DEPARTMENT_HEAD: "Dept Head",
  AGENCY_STUDIO: "Agency/Studio",
};

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "All Roles" },
  { value: "USER", label: "User" },
  { value: "MODERATOR", label: "Moderator" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

// ---------------------------------------------------------------------------
// Skeleton loader
// ---------------------------------------------------------------------------

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04] animate-pulse">
      <div className="h-10 w-10 rounded-full bg-white/[0.06]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded bg-white/[0.06]" />
        <div className="h-2.5 w-48 rounded bg-white/[0.04]" />
      </div>
      <div className="h-5 w-16 rounded-full bg-white/[0.06]" />
      <div className="h-5 w-20 rounded-full bg-white/[0.04]" />
      <div className="h-3 w-20 rounded bg-white/[0.04]" />
      <div className="h-2 w-2 rounded-full bg-white/[0.06]" />
      <div className="h-6 w-6 rounded bg-white/[0.04]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUserRole = (session?.user as any)?.role as UserRole | undefined;
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  // State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [actionMenuUserId, setActionMenuUserId] = useState<string | null>(null);

  // Ban modal
  const [banModal, setBanModal] = useState<{ open: boolean; userId: string; userName: string }>({ open: false, userId: "", userName: "" });
  const [banForm, setBanForm] = useState({ reason: "", type: "temporary" as "temporary" | "permanent", expiresAt: "" });
  const [banLoading, setBanLoading] = useState(false);

  // Role change
  const [roleChangeUser, setRoleChangeUser] = useState<{ id: string; currentRole: UserRole } | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("USER");
  const [roleLoading, setRoleLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch users
  // ---------------------------------------------------------------------------

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sortBy,
        sortOrder,
      });
      if (search) params.set("search", search);
      if (roleFilter !== "ALL") params.set("role", roleFilter);

      const res = await fetch(`/api/admin/users?${params}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch users");

      setUsers(json.data.users);
      setPagination(json.data.pagination);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleBan = async () => {
    if (!banForm.reason.trim()) return;
    setBanLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: banModal.userId,
          action: "ban",
          data: {
            reason: banForm.reason,
            type: banForm.type,
            expiresAt: banForm.type === "temporary" ? banForm.expiresAt : undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Ban failed");

      setBanModal({ open: false, userId: "", userName: "" });
      setBanForm({ reason: "", type: "temporary", expiresAt: "" });
      fetchUsers(pagination.page);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Ban failed");
    } finally {
      setBanLoading(false);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "unban" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Unban failed");
      setActionMenuUserId(null);
      fetchUsers(pagination.page);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Unban failed");
    }
  };

  const handleRoleChange = async () => {
    if (!roleChangeUser) return;
    setRoleLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: roleChangeUser.id,
          action: "change_role",
          data: { newRole },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Role change failed");

      setRoleChangeUser(null);
      fetchUsers(pagination.page);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Role change failed");
    } finally {
      setRoleLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Sort indicator
  // ---------------------------------------------------------------------------

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ChevronUpDownIcon className="h-3.5 w-3.5 text-[#9e9eab]" />;
    return sortOrder === "asc"
      ? <ChevronUpIcon className="h-3.5 w-3.5 text-[#c4a47a]" />
      : <ChevronDownIcon className="h-3.5 w-3.5 text-[#c4a47a]" />;
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto py-4 px-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Users</h1>
        <p className="text-sm text-[#9e9eab] mt-2 leading-relaxed">
          Manage platform users, roles, and bans.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9e9eab]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-[#f0efe6] placeholder-[#6b6b78] border border-white/[0.08] focus:border-[#9d7663]/40 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors"
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-xl bg-white/[0.04] px-4 py-2.5 text-sm text-[#f0efe6] border border-white/[0.08] focus:border-[#9d7663]/40 focus:outline-none appearance-none cursor-pointer min-w-[140px]"
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#1f1f2a] text-[#f0efe6]">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1f1f2a] rounded-2xl overflow-hidden border border-white/[0.08]">
        {/* Header row */}
        <div className="bg-[#2a2a38] grid grid-cols-[1fr_120px_110px_100px_80px_44px] gap-2 px-6 py-3 items-center">
          <button onClick={() => handleSort("name")} className="flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] hover:text-[#f0efe6] transition-colors text-left">
            User <SortIcon column="name" />
          </button>
          <button onClick={() => handleSort("role")} className="flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] hover:text-[#f0efe6] transition-colors text-left">
            Role <SortIcon column="role" />
          </button>
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#9e9eab]">Tier</span>
          <button onClick={() => handleSort("createdAt")} className="flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] hover:text-[#f0efe6] transition-colors text-left">
            Joined <SortIcon column="createdAt" />
          </button>
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#9e9eab] text-center">Status</span>
          <span />
        </div>

        {/* Body */}
        {loading ? (
          <div>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => fetchUsers(pagination.page)}>
              Retry
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <UserIcon className="h-10 w-10 mx-auto text-[#9e9eab] mb-3" />
            <p className="text-sm text-[#9e9eab]">No users found</p>
          </div>
        ) : (
          <div>
            {users.map((user) => (
              <div key={user.id}>
                {/* Row */}
                <div
                  className="grid grid-cols-[1fr_120px_110px_100px_80px_44px] gap-2 px-6 py-3.5 items-center border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#f0efe6] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#9e9eab] truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Role badge */}
                  <div>
                    <Badge variant={ROLE_BADGE_MAP[user.role].variant} size="sm">
                      {ROLE_BADGE_MAP[user.role].label}
                    </Badge>
                  </div>

                  {/* Membership tier */}
                  <div>
                    <span className="text-[11px] text-[#cdc9bc]">
                      {TIER_LABELS[user.membershipTier] || user.membershipTier}
                    </span>
                  </div>

                  {/* Join date */}
                  <div>
                    <span className="text-[11px] text-[#9e9eab]">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    {user.isBanned ? (
                      <span className="relative flex h-2.5 w-2.5" title="Banned">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                    ) : (
                      <span className="relative flex h-2.5 w-2.5" title="Active">
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    )}
                  </div>

                  {/* Actions trigger */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuUserId(actionMenuUserId === user.id ? null : user.id);
                      }}
                      className="p-1 rounded-lg text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.04] transition-colors"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>

                    {/* Dropdown menu */}
                    {actionMenuUserId === user.id && (
                      <div className="absolute right-0 top-8 z-50 w-48 rounded-xl bg-[#2a2a38] border border-white/[0.08] shadow-2xl py-1.5 animate-fade-in">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedUserId(user.id);
                            setActionMenuUserId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#cdc9bc] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors"
                        >
                          <UserIcon className="h-3.5 w-3.5" />
                          View Profile
                        </button>

                        {isSuperAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRoleChangeUser({ id: user.id, currentRole: user.role });
                              setNewRole(user.role);
                              setActionMenuUserId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#cdc9bc] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors"
                          >
                            <ShieldCheckIcon className="h-3.5 w-3.5" />
                            Change Role
                          </button>
                        )}

                        {user.isBanned ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnban(user.id);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-400 hover:bg-white/[0.04] transition-colors"
                          >
                            <NoSymbolIcon className="h-3.5 w-3.5" />
                            Unban User
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setBanModal({ open: true, userId: user.id, userName: user.name });
                              setActionMenuUserId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-white/[0.04] transition-colors"
                          >
                            <NoSymbolIcon className="h-3.5 w-3.5" />
                            Ban User
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded detail panel */}
                {expandedUserId === user.id && (
                  <div className="px-6 py-5 bg-white/[0.01] border-b border-white/[0.04] animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9eab] mb-1">Email</p>
                        <p className="text-xs text-[#f0efe6]">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9eab] mb-1">Posts</p>
                        <p className="text-xs text-[#f0efe6]">{user.postCount}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9eab] mb-1">Membership</p>
                        <p className="text-xs text-[#f0efe6]">{TIER_LABELS[user.membershipTier]}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-[#9e9eab] mb-1">Joined</p>
                        <p className="text-xs text-[#f0efe6]">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    {user.isBanned && user.ban && (
                      <div className="mt-4 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/20">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-red-400 mb-1">Ban Details</p>
                        <p className="text-xs text-[#f0efe6]">
                          <span className="text-[#9e9eab]">Reason:</span> {user.ban.reason}
                        </p>
                        <p className="text-xs text-[#f0efe6] mt-1">
                          <span className="text-[#9e9eab]">Type:</span> {user.ban.type}
                          {user.ban.expiresAt && (
                            <span className="text-[#9e9eab]"> &middot; Expires: {new Date(user.ban.expiresAt).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-[#9e9eab]">
            Showing {(pagination.page - 1) * pagination.limit + 1}
            &ndash;
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="text-[11px] text-[#9e9eab]">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Ban Modal ─── */}
      {banModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setBanModal({ open: false, userId: "", userName: "" })}>
          <div
            className="bg-[#1f1f2a] rounded-2xl p-8 border border-white/[0.08] shadow-2xl w-full max-w-md animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-[#f0efe6]">Ban User</h2>
              <button onClick={() => setBanModal({ open: false, userId: "", userName: "" })} className="p-1 rounded-lg text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.04] transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-[#cdc9bc] mb-6">
              Banning <span className="text-[#f0efe6] font-medium">{banModal.userName}</span> will restrict their access to the platform.
            </p>

            {/* Ban type */}
            <div className="space-y-2 mb-4">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Ban Type</label>
              <select
                value={banForm.type}
                onChange={(e) => setBanForm({ ...banForm, type: e.target.value as "temporary" | "permanent" })}
                className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-[#f0efe6] border border-white/[0.08] focus:border-[#9d7663]/40 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="temporary" className="bg-[#1f1f2a]">Temporary</option>
                <option value="permanent" className="bg-[#1f1f2a]">Permanent</option>
              </select>
            </div>

            {/* Expires at (only for temporary) */}
            {banForm.type === "temporary" && (
              <div className="space-y-2 mb-4">
                <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Expires At</label>
                <input
                  type="date"
                  value={banForm.expiresAt}
                  onChange={(e) => setBanForm({ ...banForm, expiresAt: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-[#f0efe6] border border-white/[0.08] focus:border-[#9d7663]/40 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2 mb-6">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Reason</label>
              <textarea
                value={banForm.reason}
                onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
                placeholder="Describe the reason for this ban..."
                rows={3}
                className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-[#f0efe6] placeholder-[#6b6b78] border border-white/[0.08] focus:border-[#9d7663]/40 focus:outline-none resize-y min-h-[80px] transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBanModal({ open: false, userId: "", userName: "" })}
              >
                Cancel
              </Button>
              <button
                disabled={!banForm.reason.trim() || banLoading || (banForm.type === "temporary" && !banForm.expiresAt)}
                onClick={handleBan}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {banLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Role Change Modal ─── */}
      {roleChangeUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setRoleChangeUser(null)}>
          <div
            className="bg-[#1f1f2a] rounded-2xl p-8 border border-white/[0.08] shadow-2xl w-full max-w-sm animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light text-[#f0efe6]">Change Role</h2>
              <button onClick={() => setRoleChangeUser(null)} className="p-1 rounded-lg text-[#9e9eab] hover:text-[#f0efe6] hover:bg-white/[0.04] transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
                className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-[#f0efe6] border border-white/[0.08] focus:border-[#9d7663]/40 focus:outline-none appearance-none cursor-pointer"
              >
                {(["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"] as UserRole[]).map((r) => (
                  <option key={r} value={r} className="bg-[#1f1f2a]">
                    {ROLE_BADGE_MAP[r].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setRoleChangeUser(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                loading={roleLoading}
                disabled={newRole === roleChangeUser.currentRole}
                onClick={handleRoleChange}
              >
                Save Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop click to close action menu */}
      {actionMenuUserId && (
        <div className="fixed inset-0 z-40" onClick={() => setActionMenuUserId(null)} />
      )}
    </div>
  );
}
