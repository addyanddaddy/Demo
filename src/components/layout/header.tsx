"use client";

import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

export function Header({ title, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 lg:px-8">
      <h1 className="text-lg font-semibold text-white pl-10 lg:pl-0">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5">
          <MagnifyingGlassIcon className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-48"
          />
          <kbd className="hidden sm:inline-flex items-center rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
            /
          </kbd>
        </div>

        <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
          <BellIcon className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {user && (
          <Avatar name={user.name || "User"} src={user.image} size="sm" />
        )}
      </div>
    </header>
  );
}
