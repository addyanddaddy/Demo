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
  { label: "Active Projects", value: "—", icon: FilmIcon, accent: "text-[#9d7663]" },
  { label: "Open Applications", value: "—", icon: BriefcaseIcon, accent: "text-[#c4a47a]" },
  { label: "Profile Views", value: "—", icon: ArrowTrendingUpIcon, accent: "text-[#9d7663]" },
  { label: "Endorsements", value: "—", icon: HandThumbUpIcon, accent: "text-[#c4a47a]" },
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
    <div className="space-y-10 px-2 py-4 animate-fade-in">
      {/* Welcome */}
      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-3">Dashboard</p>
        <h1 className="text-3xl font-light text-[#f0efe6]">Welcome back, {userName}</h1>
        <p className="text-sm text-[#9e9eab] mt-2 font-light">Here&apos;s what&apos;s happening across your productions.</p>
        {roles.length > 0 && (
          <div className="flex gap-2 mt-5 flex-wrap">
            {roles.map((rp: any) => (
              <span key={rp.id} className="inline-flex items-center gap-1.5 rounded-full bg-[#9d7663]/10 px-3.5 py-1.5 text-xs font-medium text-[#c4a47a]">
                <StarIcon className="h-3 w-3 text-[#9d7663]" />
                {rp.roleName}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-5">Overview</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-[#1f1f2a] p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.15em] text-[#9e9eab] font-medium">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.accent} opacity-60`} strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-3xl font-semibold bg-gradient-to-r from-[#9d7663] to-[#c4a47a] bg-clip-text text-transparent">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-5">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group rounded-2xl bg-[#1f1f2a] p-6 hover:bg-[#2a2a38] transition-all duration-300"
            >
              <action.icon className="h-5 w-5 text-[#9e9eab] group-hover:text-[#9d7663] transition-colors duration-300 mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-normal text-[#f0efe6] group-hover:text-[#c4a47a] transition-colors duration-300">{action.label}</h3>
              <p className="text-xs text-[#6b6b78] mt-1.5 font-light leading-relaxed">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#9e9eab] mb-5">Recent Activity</p>
        <div className="rounded-2xl bg-[#1f1f2a] p-10 text-center">
          <p className="text-sm text-[#6b6b78] font-light">No recent activity yet. Start by completing your profile or browsing projects.</p>
        </div>
      </div>
    </div>
  );
}
