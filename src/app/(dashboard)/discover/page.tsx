"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { TAXONOMY_GROUPS } from "@/lib/taxonomy";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const placeholderResults = [
  { name: "Sarah Chen", role: "Director of Photography", location: "Los Angeles, CA", status: "available" as const, level: "HOD" },
  { name: "Marcus Johnson", role: "Gaffer", location: "Atlanta, GA", status: "hold" as const, level: "HOD" },
  { name: "Emily Rodriguez", role: "Production Designer", location: "New York, NY", status: "available" as const, level: "HOD" },
  { name: "David Kim", role: "Editor", location: "Los Angeles, CA", status: "booked" as const, level: "HOD" },
  { name: "Rachel Foster", role: "Costume Designer", location: "Vancouver, BC", status: "available" as const, level: "HOD" },
  { name: "James Wright", role: "First Assistant Director", location: "Chicago, IL", status: "available" as const, level: "HOD" },
];

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  return (
    <div className="space-y-10 px-2 py-4 animate-fade-in">
      {/* Header + Search */}
      <div className="pt-4 max-w-2xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-3">Discover</p>
        <h1 className="text-3xl font-light text-[#f0efe6]">Find Talent &amp; Crew</h1>
        <p className="text-sm text-[#9e9eab] mt-2 font-light">Search across {TAXONOMY_GROUPS.length} departments and 40+ specialized roles.</p>

        {/* Search input */}
        <div className="mt-8 relative">
          <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b6b78]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full bg-[#1f1f2a] pl-13 pr-6 py-4 text-sm text-[#f0efe6] placeholder-[#6b6b78] focus:ring-2 focus:ring-[#9d7663]/30 focus:outline-none transition-all duration-300"
          />
          <span className="text-[11px] text-[#cdc9bc] font-medium tracking-wide inline-flex items-center gap-1.5 absolute right-5 top-1/2 -translate-y-1/2">
            <span className="text-[#9d7663]">✦</span> AI-Enhanced
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-full bg-[#1f1f2a] px-5 py-2.5 text-sm text-[#cdc9bc] focus:ring-2 focus:ring-[#9d7663]/30 focus:outline-none appearance-none cursor-pointer transition-all duration-300 hover:bg-[#2a2a38] border-0"
        >
          <option value="">All Departments</option>
          {TAXONOMY_GROUPS.map((g) => (
            <option key={g.slug} value={g.slug}>{g.name}</option>
          ))}
        </select>
        <Button variant="secondary" className="gap-2 rounded-full bg-[#1f1f2a] border-0 text-[#cdc9bc] hover:bg-[#2a2a38] transition-all duration-300 px-5">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-[#9e9eab]" strokeWidth={1.5} />
          Filters
        </Button>
      </div>

      {/* Results */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-5">Results</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {placeholderResults.map((person) => (
            <Card key={person.name} variant="interactive" className="rounded-2xl bg-[#1f1f2a] border-0 p-6 hover:bg-[#2a2a38] transition-all duration-300">
              <div className="flex items-start gap-4">
                <Avatar name={person.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-normal text-[#f0efe6] truncate">{person.name}</h3>
                    <StatusDot status={person.status} />
                  </div>
                  <p className="text-xs text-[#9d7663] font-medium mt-1">{person.role}</p>
                  <p className="text-xs text-[#6b6b78] mt-0.5 font-light">{person.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5 border-t border-white/[0.06] pt-4">
                <Badge variant="gold" size="sm">{person.level}</Badge>
                <Badge variant="default" size="sm">12 credits</Badge>
                <Badge variant="default" size="sm">8 endorsements</Badge>
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="primary" size="sm" className="flex-1 rounded-full bg-[#9d7663] hover:bg-[#c4a47a] text-[#131318] border-0 transition-all duration-300">View Profile</Button>
                <Button variant="outline" size="sm" className="flex-1 rounded-full border-white/[0.08] text-[#cdc9bc] hover:border-[#9d7663]/40 hover:text-[#c4a47a] transition-all duration-300">Message</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
