"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  SparklesIcon,
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AIFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  model: string;
  maxTokens: number;
  temperature: number;
  attachedPaths: string[];
  usageCount: number;
  lastUsedAt: string | null;
  customPrompt: string | null;
}

interface AIUsageOverview {
  totalApiCalls: number;
  featureBreakdown: { name: string; calls: number }[];
}

interface AIData {
  features: AIFeature[];
  usage: AIUsageOverview;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL_OPTIONS = [
  { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
  { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  { value: "claude-opus-4-20250514", label: "Claude Opus 4" },
];

// ---------------------------------------------------------------------------
// Skeletons
// ---------------------------------------------------------------------------

function FeatureCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1a1a22] border border-white/[0.06] p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-5 w-44 rounded bg-white/[0.06]" />
          <div className="h-3 w-64 rounded bg-white/[0.04]" />
        </div>
        <div className="h-6 w-11 rounded-full bg-white/[0.06]" />
      </div>
      <div className="space-y-4 mt-6">
        <div className="h-10 w-full rounded-xl bg-white/[0.04]" />
        <div className="h-10 w-full rounded-xl bg-white/[0.04]" />
        <div className="h-4 w-full rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

function UsageSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1a1a22] border border-white/[0.06] p-8 animate-pulse">
      <div className="h-5 w-40 rounded bg-white/[0.06] mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-32 rounded bg-white/[0.04]" />
            <div className="h-3 w-full rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle component
// ---------------------------------------------------------------------------

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d7663]/40 ${
        checked ? "bg-[#9d7663]" : "bg-[#3d3d4a]"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Feature Card component
// ---------------------------------------------------------------------------

function FeatureCard({
  feature,
  onSave,
}: {
  feature: AIFeature;
  onSave: (id: string, updates: Partial<AIFeature>) => Promise<void>;
}) {
  const [local, setLocal] = useState<AIFeature>(feature);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newPath, setNewPath] = useState("");

  // Sync from parent if feature changes
  useEffect(() => {
    setLocal(feature);
  }, [feature]);

  const hasChanges =
    local.enabled !== feature.enabled ||
    local.model !== feature.model ||
    local.maxTokens !== feature.maxTokens ||
    local.temperature !== feature.temperature ||
    JSON.stringify(local.attachedPaths) !== JSON.stringify(feature.attachedPaths) ||
    (local.customPrompt || "") !== (feature.customPrompt || "");

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(local.id, {
        enabled: local.enabled,
        model: local.model,
        maxTokens: local.maxTokens,
        temperature: local.temperature,
        attachedPaths: local.attachedPaths,
        customPrompt: local.customPrompt,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const addPath = () => {
    const trimmed = newPath.trim();
    if (trimmed && !local.attachedPaths.includes(trimmed)) {
      setLocal({ ...local, attachedPaths: [...local.attachedPaths, trimmed] });
      setNewPath("");
    }
  };

  const removePath = (path: string) => {
    setLocal({ ...local, attachedPaths: local.attachedPaths.filter((p) => p !== path) });
  };

  return (
    <div
      className={`rounded-2xl bg-[#1a1a22] p-6 border transition-all duration-300 ${
        local.enabled
          ? "border-white/[0.06] border-l-2 border-l-[#9d7663]"
          : "border-white/[0.06] opacity-60"
      }`}
    >
      {/* Header: Name + toggle */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-base font-normal text-[#edebe2] tracking-wide">{local.name}</h3>
          <p className="text-sm text-[#b8b5a8] mt-1 leading-relaxed">{local.description}</p>
        </div>
        <Toggle checked={local.enabled} onChange={(v) => setLocal({ ...local, enabled: v })} />
      </div>

      {/* Settings */}
      <div className="mt-5 space-y-4">
        {/* Model selector */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1.5">
            Model
          </label>
          <div className="relative">
            <select
              value={local.model}
              onChange={(e) => setLocal({ ...local, model: e.target.value })}
              className="w-full appearance-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-[#edebe2] focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200 pr-10"
            >
              {MODEL_OPTIONS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#1a1a22] text-[#edebe2]">
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8a96] pointer-events-none" />
          </div>
        </div>

        {/* Max tokens */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1.5">
            Max Tokens
          </label>
          <input
            type="number"
            min={1}
            max={200000}
            value={local.maxTokens}
            onChange={(e) =>
              setLocal({ ...local, maxTokens: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-[#edebe2] font-mono focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200"
          />
        </div>

        {/* Temperature slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] uppercase tracking-[0.15em] text-[#8a8a96]">
              Temperature
            </label>
            <span className="text-[11px] font-mono text-[#b8b5a8]">
              {local.temperature.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={local.temperature}
            onChange={(e) => setLocal({ ...local, temperature: parseFloat(e.target.value) })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-[#3d3d4a] accent-[#9d7663] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c4a47a] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1a1a22] [&::-webkit-slider-thumb]:shadow-md"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#8a8a96]">Precise</span>
            <span className="text-[10px] text-[#8a8a96]">Creative</span>
          </div>
        </div>

        {/* Attached paths */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.15em] text-[#8a8a96] mb-1.5">
            Attached to
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {local.attachedPaths.map((path) => (
              <span
                key={path}
                className="inline-flex items-center gap-1 bg-white/[0.06] rounded-full px-2.5 py-1 text-[11px] text-[#b8b5a8]"
              >
                {path}
                <button
                  onClick={() => removePath(path)}
                  className="text-[#8a8a96] hover:text-red-400/80 transition-colors"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPath()}
              placeholder="/path/to/page"
              className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-xs text-[#edebe2] placeholder:text-[#8a8a96]/50 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200"
            />
            <button
              onClick={addPath}
              className="p-2 rounded-lg text-[#8a8a96] hover:text-[#edebe2] hover:bg-white/[0.06] transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Advanced: Custom Prompt */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-[#8a8a96] hover:text-[#b8b5a8] transition-colors"
          >
            <ChevronDownIcon
              className={`h-3 w-3 transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
            Advanced: Custom Prompt
          </button>
          {showAdvanced && (
            <textarea
              value={local.customPrompt || ""}
              onChange={(e) => setLocal({ ...local, customPrompt: e.target.value || null })}
              placeholder="Override the default system prompt for this feature..."
              rows={4}
              className="mt-2 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-[#edebe2] placeholder:text-[#8a8a96]/50 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none resize-y min-h-[80px] transition-colors duration-200"
            />
          )}
        </div>

        {/* Usage stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-white/[0.04]">
          <span className="text-[11px] text-[#8a8a96]">
            {local.usageCount.toLocaleString()} API calls
          </span>
          {local.lastUsedAt && (
            <>
              <span className="text-[11px] text-[#8a8a96]/40">|</span>
              <span className="text-[11px] text-[#8a8a96]">
                Last used{" "}
                {new Date(local.lastUsedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        {/* Save */}
        <Button
          size="sm"
          onClick={handleSave}
          loading={saving}
          disabled={!hasChanges && !saving}
          className={`w-full rounded-xl transition-all duration-300 ${
            saved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
              : hasChanges
              ? "bg-[#9d7663] text-white hover:bg-[#c4a47a]"
              : "bg-white/[0.04] text-[#8a8a96] border border-white/[0.06]"
          }`}
        >
          {saved ? "Saved" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AdminAIPage() {
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/ai");
      if (!res.ok) throw new Error("Failed to fetch AI settings");
      const json: AIData = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (id: string, updates: Partial<AIFeature>) => {
    try {
      const res = await fetch(`/api/admin/ai/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to save");
      showToast("Settings saved successfully");
      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          features: prev.features.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        };
      });
    } catch {
      showToast("Failed to save settings");
      throw new Error("Save failed");
    }
  };

  // Calculate max calls for bar scaling
  const maxCalls = data
    ? Math.max(...data.usage.featureBreakdown.map((f) => f.calls), 1)
    : 1;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-[#242430] border border-white/[0.08] px-5 py-3 text-sm text-[#edebe2] shadow-2xl shadow-black/40 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <SparklesIcon className="h-6 w-6 text-[#c4a47a]" />
          <h1 className="text-3xl font-light tracking-tight text-[#edebe2]">
            AI Intelligence Layer
          </h1>
        </div>
        <p className="text-sm text-[#8a8a96] tracking-wide">
          Configure and monitor all AI-powered features across the platform.
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-950/20 border border-red-500/[0.12] p-6 text-center">
          <p className="text-sm text-red-400/80">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 text-xs text-[#c4a47a] hover:text-[#9d7663] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <FeatureCardSkeleton key={i} />)
          : data?.features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} onSave={handleSave} />
            ))}
      </div>

      {/* AI Usage Overview */}
      <div>
        <h2 className="text-lg font-light text-[#edebe2] mb-5 tracking-wide">AI Usage Overview</h2>
        {loading ? (
          <UsageSkeleton />
        ) : data ? (
          <div className="rounded-2xl bg-[#1a1a22] border border-white/[0.06] p-8">
            {/* Total */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-light text-[#c4a47a] font-mono tracking-tight">
                {data.usage.totalApiCalls.toLocaleString()}
              </span>
              <span className="text-sm text-[#8a8a96]">total API calls</span>
            </div>

            {/* Per-feature breakdown */}
            <div className="space-y-4">
              {data.usage.featureBreakdown.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#edebe2]">{item.name}</span>
                    <span className="text-[11px] font-mono text-[#b8b5a8]">
                      {item.calls.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#7a5c48] to-[#c4a47a] transition-all duration-500"
                      style={{ width: `${(item.calls / maxCalls) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Cost note */}
            <div className="mt-8 pt-6 border-t border-white/[0.04]">
              <p className="text-[11px] text-[#8a8a96] tracking-wide">
                AI costs are absorbed by the platform. Usage is monitored for optimization purposes.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
