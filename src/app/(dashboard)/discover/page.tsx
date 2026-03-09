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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Discover Talent & Crew</h1>
        <p className="text-sm text-zinc-400 mt-1">Search across {TAXONOMY_GROUPS.length} departments and 40+ specialized roles.</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Departments</option>
          {TAXONOMY_GROUPS.map((g) => (
            <option key={g.slug} value={g.slug}>{g.name}</option>
          ))}
        </select>
        <Button variant="secondary" className="gap-2">
          <AdjustmentsHorizontalIcon className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {placeholderResults.map((person) => (
          <Card key={person.name} variant="interactive" className="p-5">
            <div className="flex items-start gap-3">
              <Avatar name={person.name} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">{person.name}</h3>
                  <StatusDot status={person.status} />
                </div>
                <p className="text-xs text-indigo-400 font-medium mt-0.5">{person.role}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{person.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="gold" size="sm">{person.level}</Badge>
              <Badge variant="default" size="sm">12 credits</Badge>
              <Badge variant="default" size="sm">8 endorsements</Badge>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="primary" size="sm" className="flex-1">View Profile</Button>
              <Button variant="outline" size="sm" className="flex-1">Message</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
