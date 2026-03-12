"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, FilmIcon } from "@heroicons/react/24/outline";

const tabs = ["All", "Active", "In Development", "Completed"];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-2">Productions</p>
          <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Projects</h1>
          <p className="text-sm text-[#6b6b78] mt-2">Manage your productions and crew.</p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2 rounded-full bg-[#9d7663] hover:bg-[#9d7663]/90 text-white px-6">
            <PlusIcon className="h-4 w-4 stroke-[1.5]" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-full bg-[#131318]/60 p-1 border border-white/[0.08] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white/[0.06] text-[#f0efe6]"
                : "text-[#9e9eab] hover:text-[#f0efe6]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#1f1f2a] p-20 text-center">
        <FilmIcon className="h-12 w-12 text-[#6b6b78] mx-auto mb-5 stroke-[1]" />
        <h3 className="text-lg font-normal tracking-tight text-[#f0efe6] mb-2">No projects yet</h3>
        <p className="text-sm text-[#6b6b78] mb-8 max-w-md mx-auto leading-relaxed">
          Create your first project to start building your team, posting requisitions, and managing your production.
        </p>
        <Link href="/projects/new">
          <Button className="gap-2 rounded-full bg-[#9d7663] hover:bg-[#9d7663]/90 text-white px-6">
            <PlusIcon className="h-4 w-4 stroke-[1.5]" />
            Create Your First Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
