"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, PlusIcon } from "@heroicons/react/24/outline";

const sampleAvailability = [
  { id: 1, startDate: "2026-03-15", endDate: "2026-06-30", status: "AVAILABLE", city: "Los Angeles", region: "California" },
  { id: 2, startDate: "2026-07-01", endDate: "2026-07-14", status: "SOFT_HOLD", city: "Atlanta", region: "Georgia" },
  { id: 3, startDate: "2026-08-01", endDate: "2026-10-31", status: "AVAILABLE", city: "Los Angeles", region: "California" },
];

const statusMap: Record<string, { label: string; dotColor: string; textColor: string }> = {
  AVAILABLE: { label: "Available", dotColor: "bg-emerald-500", textColor: "text-emerald-400" },
  SOFT_HOLD: { label: "Soft Hold", dotColor: "bg-amber-500", textColor: "text-amber-400" },
  FIRM_HOLD: { label: "Firm Hold", dotColor: "bg-orange-500", textColor: "text-orange-400" },
  BOOKED: { label: "Booked", dotColor: "bg-[#9d7663]", textColor: "text-[#c4a47a]" },
};

export default function AvailabilityPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#f0efe6] tracking-tight">Availability</h1>
          <p className="text-[13px] text-[#9e9eab] mt-2 tracking-wide">Manage your schedule so productions can find you when you are free.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#9d7663] px-5 py-2.5 text-[13px] font-medium text-white tracking-wide hover:bg-[#c4a47a] transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Availability
        </button>
      </div>

      {/* New availability form */}
      {showForm && (
        <div className="bg-[#1f1f2a] rounded-2xl border border-white/[0.08] p-8">
          <h3 className="text-lg font-light text-[#f0efe6] mb-6">New Availability Block</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Start Date</label>
              <input
                type="date"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">End Date</label>
              <input
                type="date"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Status</label>
              <select className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors appearance-none">
                <option value="AVAILABLE">Available</option>
                <option value="SOFT_HOLD">Soft Hold</option>
                <option value="FIRM_HOLD">Firm Hold</option>
                <option value="BOOKED">Booked</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">City</label>
              <input
                type="text"
                placeholder="Los Angeles"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Region</label>
              <input
                type="text"
                placeholder="California"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Country</label>
              <input
                type="text"
                placeholder="United States"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl px-5 py-2.5 text-[13px] font-medium text-[#9e9eab] hover:text-[#cdc9bc] transition-colors"
            >
              Cancel
            </button>
            <button className="rounded-xl bg-[#9d7663] px-6 py-2.5 text-[13px] font-medium text-white tracking-wide hover:bg-[#c4a47a] transition-colors">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Status legend */}
      <div className="flex items-center gap-6">
        {Object.entries(statusMap).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${val.dotColor}`} />
            <span className="text-[12px] text-[#6b6b78] tracking-wide">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Availability cards */}
      <div className="space-y-4">
        {sampleAvailability.map((a) => {
          const info = statusMap[a.status] || statusMap.AVAILABLE;
          const start = new Date(a.startDate);
          const end = new Date(a.endDate);
          const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div key={a.id} className="bg-[#1f1f2a] rounded-2xl border border-white/[0.08] p-6 group hover:border-white/[0.12] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {/* Calendar icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
                    <CalendarDaysIcon className="h-5 w-5 text-[#6b6b78]" />
                  </div>

                  <div className="space-y-1.5">
                    {/* Date range */}
                    <p className="text-[15px] font-light text-[#f0efe6] tracking-tight">
                      {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>

                    {/* Status + location row */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${info.dotColor}`} />
                        <span className={`text-[13px] font-medium ${info.textColor}`}>{info.label}</span>
                      </div>
                      <span className="w-px h-3 bg-white/[0.08]" />
                      <span className="text-[12px] text-[#6b6b78]">{a.city}, {a.region}</span>
                      <span className="w-px h-3 bg-white/[0.08]" />
                      <span className="text-[12px] text-[#6b6b78]">{durationDays} days</span>
                    </div>
                  </div>
                </div>

                <button className="text-[13px] font-medium text-[#9d7663] hover:text-[#c4a47a] transition-colors opacity-0 group-hover:opacity-100">
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
