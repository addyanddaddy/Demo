import { getServerAuth } from "@/lib/auth";
import Link from "next/link";
import {
  FilmIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  BriefcaseIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

const statCards = [
  { label: "Active Projects", value: "—", icon: FilmIcon, color: "text-indigo-400 bg-indigo-400/10" },
  { label: "Open Applications", value: "—", icon: BriefcaseIcon, color: "text-amber-400 bg-amber-400/10" },
  { label: "Profile Views", value: "—", icon: ArrowTrendingUpIcon, color: "text-emerald-400 bg-emerald-400/10" },
  { label: "Endorsements", value: "—", icon: HandThumbUpIcon, color: "text-purple-400 bg-purple-400/10" },
];

const quickActions = [
  { label: "Create Project", href: "/projects/new", icon: FilmIcon, description: "Start staffing a new production" },
  { label: "Browse Opportunities", href: "/discover", icon: MagnifyingGlassIcon, description: "Find projects hiring now" },
  { label: "Update Availability", href: "/availability", icon: CalendarDaysIcon, description: "Set your schedule and holds" },
  { label: "Complete Profile", href: "/profile/edit", icon: UserCircleIcon, description: "Add your reel, credits & photos" },
];

export default async function DashboardPage() {
  const session = await getServerAuth();
  const userName = session?.user?.name?.split(" ")[0] || "there";
  const roles = (session?.user as any)?.roleProfiles || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {userName}</h1>
        <p className="text-sm text-zinc-400 mt-1">Here&apos;s what&apos;s happening across your productions.</p>
        {roles.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {roles.map((rp: any) => (
              <span key={rp.id} className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
                <StarIcon className="h-3 w-3" />
                {rp.roleName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
            >
              <action.icon className="h-6 w-6 text-zinc-500 group-hover:text-indigo-400 transition-colors mb-3" />
              <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{action.label}</h3>
              <p className="text-xs text-zinc-500 mt-1">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <p className="text-sm text-zinc-500">No recent activity yet. Start by completing your profile or browsing projects.</p>
        </div>
      </div>
    </div>
  );
}
