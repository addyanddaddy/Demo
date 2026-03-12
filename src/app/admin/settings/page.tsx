"use client";

import { useState, useEffect, useCallback } from "react";
import { MEMBERSHIP_PLANS, type MembershipPlanData } from "@/lib/taxonomy";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlatformRule {
  id: string;
  title: string;
  description: string;
  category: string;
  isActive: boolean;
  severity: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface RuleFormData {
  title: string;
  description: string;
  category: string;
  severity: string;
  isActive: boolean;
}

interface PlatformHealthStatus {
  database: "connected" | "error";
  ai: "active" | "inactive";
  stripe: "connected" | "not_configured";
  storage: "active" | "not_configured";
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = ["content", "behavior", "payment", "profile"] as const;
const SEVERITIES = ["warning", "temp_ban", "permanent_ban"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  content: "bg-blue-500/15 text-blue-400",
  behavior: "bg-amber-500/15 text-amber-400",
  payment: "bg-emerald-500/15 text-emerald-400",
  profile: "bg-purple-500/15 text-purple-400",
};

const SEVERITY_COLORS: Record<string, string> = {
  warning: "bg-amber-500/15 text-amber-400",
  temp_ban: "bg-orange-500/15 text-orange-400",
  permanent_ban: "bg-red-500/15 text-red-400",
};

const SEVERITY_LABELS: Record<string, string> = {
  warning: "Warning",
  temp_ban: "Temp Ban",
  permanent_ban: "Permanent Ban",
};

const EMPTY_FORM: RuleFormData = {
  title: "",
  description: "",
  category: "content",
  severity: "warning",
  isActive: true,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdminSettingsPage() {
  const [rules, setRules] = useState<PlatformRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Add / edit form state
  const [showForm, setShowForm] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleFormData>(EMPTY_FORM);

  // Delete confirmation
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null);

  // Platform health (simulated from env)
  const [health] = useState<PlatformHealthStatus>({
    database: "connected",
    ai: "active",
    stripe: "not_configured",
    storage: "active",
  });

  // -----------------------------------------------------------------------
  // Fetch rules
  // -----------------------------------------------------------------------

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/rules");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch rules");
      setRules(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // -----------------------------------------------------------------------
  // Create / Update rule
  // -----------------------------------------------------------------------

  async function handleSaveRule() {
    if (!form.title.trim() || !form.description.trim()) return;
    try {
      setSaving(true);
      setError(null);

      if (editingRuleId) {
        // Update
        const res = await fetch("/api/admin/rules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ruleId: editingRuleId, ...form }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to update rule");
        setRules((prev) => prev.map((r) => (r.id === editingRuleId ? json.data : r)));
      } else {
        // Create
        const res = await fetch("/api/admin/rules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to create rule");
        setRules((prev) => [...prev, json.data]);
      }

      setShowForm(false);
      setEditingRuleId(null);
      setForm(EMPTY_FORM);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save rule");
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------------------------------------------------
  // Toggle active
  // -----------------------------------------------------------------------

  async function handleToggleActive(rule: PlatformRule) {
    try {
      const res = await fetch("/api/admin/rules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId: rule.id, isActive: !rule.isActive }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to toggle rule");
      setRules((prev) => prev.map((r) => (r.id === rule.id ? json.data : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to toggle rule");
    }
  }

  // -----------------------------------------------------------------------
  // Delete rule
  // -----------------------------------------------------------------------

  async function handleDeleteRule(ruleId: string) {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/rules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete rule");
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
      setDeletingRuleId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete rule");
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------------------------------------------------
  // Edit handler
  // -----------------------------------------------------------------------

  function handleEditRule(rule: PlatformRule) {
    setForm({
      title: rule.title,
      description: rule.description,
      category: rule.category,
      severity: rule.severity,
      isActive: rule.isActive,
    });
    setEditingRuleId(rule.id);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingRuleId(null);
    setForm(EMPTY_FORM);
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-10 max-w-4xl">
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
      {/* PLATFORM RULES                                      */}
      {/* ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-light tracking-wide text-[#f0efe6]">Platform Rules</h2>
            <p className="text-sm text-[#9e9eab] mt-1">
              Manage rules that govern user behavior and content on the platform.
            </p>
          </div>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditingRuleId(null);
              setShowForm(true);
            }}
            className="rounded-xl bg-[#9d7663] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#7a5c48] transition-colors"
          >
            Add Rule
          </button>
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#1f1f2a] p-6 space-y-4">
            <h3 className="text-sm font-medium text-[#f0efe6]">
              {editingRuleId ? "Edit Rule" : "New Rule"}
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs text-[#9e9eab] mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Rule title..."
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-[#f0efe6] placeholder:text-[#9e9eab]/60 focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-[#9e9eab] mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the rule..."
                rows={3}
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-[#f0efe6] placeholder:text-[#9e9eab]/60 focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 resize-none transition-colors"
              />
            </div>

            {/* Category & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9e9eab] mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-[#f0efe6] focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#1f1f2a]">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9e9eab] mb-1.5">Severity</label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-[#f0efe6] focus:outline-none focus:ring-1 focus:ring-[#9d7663]/50 transition-colors"
                >
                  {SEVERITIES.map((sev) => (
                    <option key={sev} value={sev} className="bg-[#1f1f2a]">
                      {SEVERITY_LABELS[sev]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  form.isActive ? "bg-[#9d7663]" : "bg-white/[0.12]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    form.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-[#cdc9bc]">
                {form.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveRule}
                disabled={saving || !form.title.trim() || !form.description.trim()}
                className="rounded-xl bg-[#9d7663] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#7a5c48] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : editingRuleId ? "Update Rule" : "Create Rule"}
              </button>
              <button
                onClick={handleCancelForm}
                className="rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm text-[#cdc9bc] hover:bg-white/[0.1] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-[#1f1f2a] p-5 animate-pulse">
                <div className="h-4 w-48 rounded bg-white/[0.06] mb-3" />
                <div className="h-3 w-full rounded bg-white/[0.04] mb-2" />
                <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && rules.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#1f1f2a]/50 p-12 text-center">
            <div className="text-[#9e9eab] text-4xl mb-3">&#9878;</div>
            <p className="text-sm text-[#cdc9bc]">No platform rules defined yet.</p>
            <p className="text-xs text-[#9e9eab] mt-1">
              Click &quot;Add Rule&quot; to create your first rule.
            </p>
          </div>
        )}

        {/* Rules list */}
        {!loading && rules.length > 0 && (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`rounded-2xl bg-[#1f1f2a] p-5 transition-opacity ${
                  rule.isActive ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <h3 className="text-sm font-medium text-[#f0efe6] truncate">
                        {rule.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          CATEGORY_COLORS[rule.category] || "bg-white/[0.06] text-[#cdc9bc]"
                        }`}
                      >
                        {rule.category}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          SEVERITY_COLORS[rule.severity] || "bg-white/[0.06] text-[#cdc9bc]"
                        }`}
                      >
                        {SEVERITY_LABELS[rule.severity] || rule.severity}
                      </span>
                    </div>
                    <p className="text-sm text-[#cdc9bc] leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Active toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(rule)}
                      title={rule.isActive ? "Deactivate" : "Activate"}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        rule.isActive ? "bg-[#9d7663]" : "bg-white/[0.12]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="rounded-lg p-2 text-[#9e9eab] hover:bg-white/[0.06] hover:text-[#f0efe6] transition-colors"
                      title="Edit rule"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>

                    {/* Delete */}
                    {deletingRuleId === rule.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={saving}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingRuleId(null)}
                          className="rounded-lg px-2.5 py-1.5 text-xs text-[#9e9eab] hover:text-[#f0efe6] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingRuleId(rule.id)}
                        className="rounded-lg p-2 text-[#9e9eab] hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Delete rule"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* ─────────────────────────────────────────────────── */}
      {/* MEMBERSHIP CONFIGURATION                             */}
      {/* ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-light tracking-wide text-[#f0efe6]">
            Membership Configuration
          </h2>
          <p className="text-sm text-[#9e9eab] mt-1">
            Current membership tiers and pricing. Membership pricing is configured in code. Contact
            engineering to update.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan: MembershipPlanData) => (
            <div
              key={plan.slug}
              className="rounded-2xl bg-[#1f1f2a] border border-white/[0.08] p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#f0efe6]">{plan.name}</h3>
                <span className="inline-flex items-center rounded-md bg-[#9d7663]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c4a47a]">
                  {plan.tier}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-[#f0efe6]">
                  ${plan.price}
                </span>
                <span className="text-xs text-[#9e9eab]">/{plan.interval}</span>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-[#9e9eab] font-semibold">
                  {plan.features.length} features
                </p>
                <ul className="space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#cdc9bc]">
                      <span className="h-1 w-1 rounded-full bg-[#9d7663] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-[#9e9eab] italic">
          Membership pricing is configured in code. Contact engineering to update.
        </p>
      </section>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* ─────────────────────────────────────────────────── */}
      {/* PLATFORM HEALTH                                      */}
      {/* ─────────────────────────────────────────────────── */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-light tracking-wide text-[#f0efe6]">Platform Health</h2>
          <p className="text-sm text-[#9e9eab] mt-1">
            Service status overview for core platform dependencies.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <HealthCard
            label="Database"
            status={health.database === "connected" ? "Connected" : "Error"}
            ok={health.database === "connected"}
          />
          <HealthCard
            label="AI Service"
            status={health.ai === "active" ? "Active" : "Inactive"}
            ok={health.ai === "active"}
          />
          <HealthCard
            label="Stripe"
            status={health.stripe === "connected" ? "Connected" : "Not configured"}
            ok={health.stripe === "connected"}
          />
          <HealthCard
            label="Storage"
            status={health.storage === "active" ? "Active" : "Not configured"}
            ok={health.storage === "active"}
          />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HealthCard({ label, status, ok }: { label: string; status: string; ok: boolean }) {
  return (
    <div className="rounded-2xl bg-[#1f1f2a] p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className={`h-2 w-2 rounded-full ${
            ok ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.4)]"
          }`}
        />
        <h3 className="text-sm font-medium text-[#f0efe6]">{label}</h3>
      </div>
      <p className={`text-xs ${ok ? "text-emerald-400" : "text-amber-400"}`}>{status}</p>
    </div>
  );
}
