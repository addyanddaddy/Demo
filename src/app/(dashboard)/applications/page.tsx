"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

const statusConfig: Record<string, { label: string; bgClass: string; textClass: string; step: number }> = {
  SUBMITTED: { label: "Submitted", bgClass: "bg-blue-500/15", textClass: "text-blue-400", step: 1 },
  UNDER_REVIEW: { label: "Under Review", bgClass: "bg-amber-500/15", textClass: "text-amber-400", step: 2 },
  SHORTLISTED: { label: "Shortlisted", bgClass: "bg-emerald-500/15", textClass: "text-emerald-400", step: 3 },
  REJECTED: { label: "Rejected", bgClass: "bg-red-500/15", textClass: "text-red-400", step: 0 },
  WITHDRAWN: { label: "Withdrawn", bgClass: "bg-white/[0.06]", textClass: "text-[#6b6b78]", step: 0 },
};

const progressSteps = ["Submitted", "Under Review", "Shortlisted"];

const sampleApplications = [
  { id: 1, role: "Director of Photography", project: "Midnight Runner", status: "UNDER_REVIEW", appliedDate: "Mar 5, 2026", rate: "$800/day" },
  { id: 2, role: "Camera Operator", project: "City Pulse", status: "SUBMITTED", appliedDate: "Mar 7, 2026", rate: "$550/day" },
  { id: 3, role: "DP", project: "Desert Bloom", status: "SHORTLISTED", appliedDate: "Feb 28, 2026", rate: "$900/day" },
];

export default function ApplicationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-[#f0efe6] tracking-tight">My Applications</h1>
        <p className="text-[13px] text-[#9e9eab] mt-2 tracking-wide">Track your job applications and their status.</p>
      </div>

      {sampleApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#131318]/50 p-16 text-center">
          <BriefcaseIcon className="h-12 w-12 text-[#6b6b78] mx-auto mb-4" />
          <h3 className="text-lg font-light text-[#f0efe6] mb-2">No applications yet</h3>
          <p className="text-[13px] text-[#6b6b78] mb-8">Browse open requisitions and casting breakdowns to apply.</p>
          <Button onClick={() => window.location.href = "/discover"}>Browse Opportunities</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sampleApplications.map((app) => {
            const config = statusConfig[app.status] || statusConfig.SUBMITTED;
            const isTerminal = app.status === "REJECTED" || app.status === "WITHDRAWN";

            return (
              <div key={app.id} className="bg-[#1f1f2a] rounded-2xl border border-white/[0.08] overflow-hidden group hover:border-white/[0.12] transition-colors">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left: project and role info */}
                    <div className="space-y-3">
                      {/* Role + badge */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-[15px] font-light text-[#f0efe6]">{app.role}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${config.bgClass} ${config.textClass}`}>
                          {config.label}
                        </span>
                      </div>

                      {/* Project name */}
                      <p className="text-[14px] font-medium text-[#9d7663]">{app.project}</p>

                      {/* Meta row */}
                      <div className="flex items-center gap-4 text-[12px] text-[#6b6b78]">
                        <span>Applied {app.appliedDate}</span>
                        <span className="w-px h-3 bg-white/[0.08]" />
                        <span>{app.rate}</span>
                      </div>
                    </div>

                    {/* Right: View button */}
                    <button className="text-[13px] font-medium text-[#9d7663] hover:text-[#c4a47a] transition-colors">
                      View Details
                    </button>
                  </div>

                  {/* Status progression timeline */}
                  {!isTerminal && (
                    <div className="mt-6 pt-5 border-t border-white/[0.06]">
                      <div className="flex items-center gap-0">
                        {progressSteps.map((step, i) => {
                          const isCompleted = config.step > i + 1;
                          const isCurrent = config.step === i + 1;
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full transition-colors ${
                                    isCompleted
                                      ? "bg-[#9d7663]"
                                      : isCurrent
                                      ? "bg-[#c4a47a] ring-4 ring-[#c4a47a]/10"
                                      : "bg-white/[0.08]"
                                  }`}
                                />
                                <span
                                  className={`text-[11px] tracking-wide ${
                                    isCompleted || isCurrent
                                      ? "text-[#cdc9bc] font-medium"
                                      : "text-[#6b6b78]"
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                              {i < progressSteps.length - 1 && (
                                <div
                                  className={`flex-1 h-px mx-3 ${
                                    isCompleted ? "bg-[#9d7663]/40" : "bg-white/[0.06]"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
