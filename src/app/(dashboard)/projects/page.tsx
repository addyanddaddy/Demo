"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, FilmIcon } from "@heroicons/react/24/outline";

const tabs = ["All", "Active", "In Development", "Completed"];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your productions and crew.</p>
        </div>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-900/50 p-1 border border-zinc-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-16 text-center">
        <FilmIcon className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
        <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
          Create your first project to start building your team, posting requisitions, and managing your production.
        </p>
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Your First Project
        </Button>
      </div>
    </div>
  );
}
