import Link from "next/link";
import Image from "next/image";
import { TAXONOMY_GROUPS, ROLES, MEMBERSHIP_PLANS } from "@/lib/taxonomy";

const features = [
  {
    title: "Build Your Network",
    description: "Connect through real projects. Every collaboration creates a verified worked-with edge. Earn endorsements from people you've actually worked with.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Staff Your Productions",
    description: "Create projects, post requisitions by department, manage casting breakdowns. The authority chain ensures the right people make the right hires.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
      </svg>
    ),
  },
  {
    title: "Manage Your Career",
    description: "Showcase your work across multiple roles. Set availability, manage holds, and let the right opportunities find you through verified credits.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

const stats = [
  { label: "Professional Roles", value: ROLES.length + "+" },
  { label: "Department Categories", value: TAXONOMY_GROUPS.length },
  { label: "Membership Tiers", value: MEMBERSHIP_PLANS.length },
  { label: "Target Active Users", value: "30K" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="FrameOne" width={36} height={36} className="rounded-md" />
            <span className="text-lg font-bold text-white">FrameOne</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-400">Now in development — launching soon</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-white">The Entertainment</span>
            <br />
            <span className="text-gradient-gold">Industry&apos;s Network</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Connect with talent, crew, and production professionals.
            Build teams. Create projects. Get hired.
            From producers to PAs — every role, one platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-zinc-800 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Role ticker */}
      <section className="py-8 border-y border-zinc-800/50 overflow-hidden">
        <div className="flex gap-4 animate-[scroll_30s_linear_infinite]" style={{ width: "max-content" }}>
          {[...ROLES, ...ROLES].map((role, i) => (
            <span key={`${role.slug}-${i}`} className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 whitespace-nowrap">
              {role.name}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Built for How Productions Actually Work</h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              Not a generic job board. A platform that understands departments, authority chains, and the trust-based hiring that defines this industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-colors">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-zinc-800/50">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gradient-gold">{stat.value}</p>
              <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Every Department. Every Role.</h2>
            <p className="mt-4 text-zinc-400">{ROLES.length} specialized roles across {TAXONOMY_GROUPS.length} departments</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TAXONOMY_GROUPS.map((group) => {
              const groupRoles = ROLES.filter((r) => r.groupSlug === group.slug);
              return (
                <div key={group.slug} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
                  <h3 className="font-semibold text-white mb-1">{group.name}</h3>
                  <p className="text-xs text-zinc-500 mb-3">{group.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {groupRoles.map((role) => (
                      <span key={role.slug} className="inline-block rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-zinc-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-zinc-400">Start free. Upgrade as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.slug}
                className={`rounded-xl border p-6 ${
                  plan.slug === "hiring-pro"
                    ? "border-indigo-500 bg-indigo-600/10 ring-1 ring-indigo-500/20"
                    : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.slug === "hiring-pro" && (
                  <span className="inline-block rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-semibold text-white mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-2xl font-bold text-white">${plan.price}</span>
                  {plan.price > 0 && <span className="text-sm text-zinc-400">/mo</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <svg className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block text-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    plan.slug === "hiring-pro"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  {plan.price === 0 ? "Get Started" : "Start Trial"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Join the Network?</h2>
          <p className="mt-4 text-lg text-zinc-400">
            Whether you&apos;re a producer staffing your next feature or a grip looking for your next gig — FrameOne connects you to the industry.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-10 py-4 text-lg font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="FrameOne" width={24} height={24} className="rounded" />
            <span className="text-sm text-zinc-500">&copy; 2026 FrameOne. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}