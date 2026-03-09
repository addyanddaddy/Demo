import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-zinc-700 text-zinc-300",
  primary: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  danger: "bg-red-500/20 text-red-400 border border-red-500/30",
  gold: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30",
};

const sizes = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Badge({ className, variant = "default", size = "md", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function StatusDot({ status }: { status: "available" | "hold" | "booked" | "offline" }) {
  const colors = {
    available: "bg-emerald-500",
    hold: "bg-amber-500",
    booked: "bg-red-500",
    offline: "bg-zinc-600",
  };

  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === "available" && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", colors[status])} />
    </span>
  );
}
