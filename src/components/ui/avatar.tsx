import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-zinc-700 font-medium text-zinc-300 overflow-hidden ring-2 ring-zinc-800",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        <span className="select-none">{initials}</span>
      )}
    </div>
  );
}

export function AvatarStack({ users, max = 4 }: { users: Array<{ name: string; src?: string | null }>; max?: number }) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar key={i} src={user.src} name={user.name} size="sm" className="ring-2 ring-zinc-900" />
      ))}
      {remaining > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-zinc-400 ring-2 ring-zinc-900">
          +{remaining}
        </div>
      )}
    </div>
  );
}
