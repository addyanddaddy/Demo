"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const formats = [
  { value: "FEATURE", label: "Feature Film" },
  { value: "EPISODIC", label: "Episodic / TV Series" },
  { value: "SHORT", label: "Short Film" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "MUSIC_VIDEO", label: "Music Video" },
  { value: "DOCUMENTARY", label: "Documentary" },
  { value: "WEB_SERIES", label: "Web Series" },
  { value: "THEATER", label: "Theater" },
];

const stages = [
  { value: "DEVELOPMENT", label: "Development" },
  { value: "PRE_PRODUCTION", label: "Pre-Production" },
  { value: "PRODUCTION", label: "Production" },
  { value: "POST_PRODUCTION", label: "Post-Production" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    logline: "",
    format: "FEATURE",
    stage: "DEVELOPMENT",
    visibility: "PRIVATE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/projects");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectClasses =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-[#f0efe6] focus:border-[#9d7663]/50 focus:outline-none focus:ring-2 focus:ring-[#9d7663]/20 transition-colors";

  return (
    <div className="space-y-10 animate-fade-in max-w-2xl">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-2">New Production</p>
        <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Create New Project</h1>
        <p className="text-sm text-[#6b6b78] mt-2">Set up a new production and start building your team.</p>
      </div>

      <Card className="p-8 bg-[#1f1f2a] rounded-2xl border-white/[0.08]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#cdc9bc]">Project Title</label>
            <input
              type="text"
              placeholder="e.g., Midnight Runner"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={`${selectClasses}`}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#cdc9bc]">Logline</label>
            <textarea
              placeholder="A brief summary of the project..."
              value={form.logline}
              onChange={(e) => setForm({ ...form, logline: e.target.value })}
              rows={3}
              className={`${selectClasses} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#cdc9bc]">Format</label>
              <select
                value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
                className={selectClasses}
              >
                {formats.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#cdc9bc]">Stage</label>
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                className={selectClasses}
              >
                {stages.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#cdc9bc]">Visibility</label>
            <select
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value })}
              className={selectClasses}
            >
              <option value="PRIVATE">Private — Only team members</option>
              <option value="INVITE_ONLY">Invite Only — Visible to invited users</option>
              <option value="PUBLIC">Public — Visible to all members</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.08]">
            <Button type="button" variant="ghost" onClick={() => router.push("/projects")} className="rounded-lg text-[#9e9eab] hover:text-[#f0efe6]">Cancel</Button>
            <Button type="submit" loading={loading} className="rounded-full bg-[#9d7663] hover:bg-[#9d7663]/90 text-white px-6">Create Project</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
