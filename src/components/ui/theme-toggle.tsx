"use client";

import { useTheme } from "@/components/theme-provider";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-normal transition-colors text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <SunIcon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
      ) : (
        <MoonIcon className="h-[18px] w-[18px] shrink-0 stroke-[1.5]" />
      )}
      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
