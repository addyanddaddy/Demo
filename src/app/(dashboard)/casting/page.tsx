"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, StarIcon, ClockIcon, UserGroupIcon } from "@heroicons/react/24/outline";

const sampleBreakdowns = [
  { id: 1, roleName: "Lead Detective", project: "Midnight Runner", ageRange: "35-45", gender: "Male", compensation: "$5,000/week", submissions: 24, deadline: "Mar 25, 2026", status: "OPEN" },
  { id: 2, roleName: "Mysterious Neighbor", project: "Midnight Runner", ageRange: "50-65", gender: "Any", compensation: "$2,500/week", submissions: 12, deadline: "Mar 30, 2026", status: "OPEN" },
  { id: 3, roleName: "Young Reporter", project: "City Pulse", ageRange: "22-28", gender: "Female", compensation: "$3,000/week", submissions: 38, deadline: "Apr 5, 2026", status: "OPEN" },
];

export default function CastingPage() {
  const [activeTab, setActiveTab] = useState("breakdowns");

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-2">Talent</p>
          <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Casting</h1>
          <p className="text-sm text-[#6b6b78] mt-2">Manage casting breakdowns, submissions, and auditions.</p>
        </div>
        <Button className="gap-2 rounded-full bg-[#9d7663] hover:bg-[#9d7663]/90 text-white px-6">
          <PlusIcon className="h-4 w-4 stroke-[1.5]" />
          New Breakdown
        </Button>
      </div>

      <div className="flex gap-1 rounded-full bg-[#131318]/60 p-1 border border-white/[0.08] w-fit">
        {["breakdowns", "my-submissions", "auditions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? "bg-white/[0.06] text-[#f0efe6]" : "text-[#9e9eab] hover:text-[#f0efe6]"
            }`}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {sampleBreakdowns.map((b) => (
          <div key={b.id} className="bg-[#1f1f2a] rounded-2xl p-6 hover:bg-[#1f1f2a]/80 transition-colors group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-normal tracking-tight text-[#f0efe6]">{b.roleName}</h3>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-0.5 text-xs font-medium text-[#f0efe6]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-[#c4a47a] mt-1.5">{b.project}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-[#6b6b78]">
                  <span>Age: {b.ageRange}</span>
                  <span className="text-white/[0.08]">|</span>
                  <span>Gender: {b.gender}</span>
                  <span className="text-white/[0.08]">|</span>
                  <span>{b.compensation}</span>
                </div>
                <p className="text-[11px] text-[#c4a47a] font-medium tracking-wide mt-3">✦ AI-Enhanced Smart Matching</p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center gap-1.5 text-sm text-[#6b6b78]">
                  <UserGroupIcon className="h-4 w-4 stroke-[1.5]" />
                  <span className="text-[#c4a47a] font-medium">{b.submissions}</span> submissions
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#6b6b78]">
                  <ClockIcon className="h-4 w-4 stroke-[1.5]" />
                  Due {b.deadline}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="primary" size="sm" className="rounded-full bg-white/[0.06] hover:bg-white/[0.10] text-[#f0efe6] text-sm px-4">View Submissions</Button>
              <Button variant="outline" size="sm" className="rounded-lg border-white/[0.08] text-[#9e9eab] hover:text-[#f0efe6] text-sm">Edit Breakdown</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
