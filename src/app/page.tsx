import Link from "next/link";
import Image from "next/image";
import { TAXONOMY_GROUPS, ROLES, MEMBERSHIP_PLANS } from "@/lib/taxonomy";

const features = [
  {
    title: "Build Your Network",
    description:
      "Connect through real projects. Every collaboration creates a verified worked-with edge. Earn endorsements from people you've actually worked with.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Staff Your Productions",
    description:
      "Create projects, post requisitions by department, manage casting breakdowns. The authority chain ensures the right people make the right hires.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
      </svg>
    ),
  },
  {
    title: "Manage Your Career",
    description:
      "Showcase your work across multiple roles. Set availability, manage holds, and let the right opportunities find you through verified credits.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

const stats = [
  { label: "Professional Roles", value: ROLES.length + "+" },
  { label: "Department Categories", value: String(TAXONOMY_GROUPS.length) },
  { label: "Membership Tiers", value: String(MEMBERSHIP_PLANS.length) },
  { label: "Target Active Users", value: "30K" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="FrameOne" width={28} height={28} className="rounded-md" />
            <span className="text-sm font-medium tracking-wide text-marble">FrameOne</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-sm text-marble-400 hover:text-marble transition-colors">
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-bronze px-5 py-2 text-sm font-medium text-white hover:bg-bronze-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-44 pb-32 px-8 overflow-hidden">
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-4xl">
            {/* Decorative line */}
            <div className="w-16 h-px bg-bronze mb-12 opacity-60" />

            <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[0.95]">
              <span className="text-marble-400">The Entertainment</span>
              <br />
              <span className="text-gradient-gold">Industry&apos;s Network</span>
            </h1>

            <p className="mt-8 text-lg text-marble-500 max-w-xl leading-relaxed font-light">
              Connect with talent, crew, and production professionals.
              Build teams. Create projects. Get hired.
            </p>

            <div className="mt-12 flex items-center gap-8">
              <Link
                href="/auth/register"
                className="rounded-full bg-bronze px-8 py-3.5 text-sm font-medium text-white hover:bg-bronze-600 transition-colors"
              >
                Get Started Free
              </Link>
              <a
                href="#features"
                className="text-sm text-marble-400 hover:text-marble transition-colors underline underline-offset-4 decoration-marble-500/30"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Role ticker */}
      <section className="py-10 overflow-hidden">
        <div className="flex items-center gap-0 animate-[scroll_60s_linear_infinite]" style={{ width: "max-content" }}>
          {[...ROLES, ...ROLES].map((role, i) => (
            <span key={`${role.slug}-${i}`} className="flex items-center gap-6 text-sm text-marble-500 whitespace-nowrap px-6 font-light tracking-wide">
              {role.name}
              <span className="text-marble-500/30 text-[8px]">&#9679;</span>
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
      <section id="features" className="py-32 px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-marble">
              Built for How Productions<br />Actually Work
            </h2>
            <p className="mt-6 text-marble-500 max-w-xl leading-relaxed font-light">
              Not a generic job board. A platform that understands departments,
              authority chains, and trust-based hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-surface-800 p-8 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-700 text-bronze mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-base font-medium text-marble mb-3">{feature.title}</h3>
                <p className="text-sm text-marble-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* AI callout */}
          <div className="mt-16 py-10 px-12 rounded-2xl bg-surface-800/50 flex items-start gap-6">
            <span className="text-bronze text-xl mt-0.5 shrink-0">&#10022;</span>
            <div>
              <h3 className="text-base font-medium text-marble mb-2">Intelligence Built In</h3>
              <p className="text-sm text-marble-500 leading-relaxed max-w-3xl">
                Every search, every match, every recommendation is powered by AI that understands how productions actually hire.
                From crew availability to credit verification, intelligence runs through every layer of the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && <div className="w-px h-12 bg-white/[0.08] mr-12 lg:mr-16" />}
              <div>
                <p className="text-3xl md:text-4xl font-light text-gradient-gold">{stat.value}</p>
                <p className="mt-2 text-[11px] text-marble-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="py-32 px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left column — title */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-5xl font-light tracking-tight text-marble leading-tight">
                Every Department.<br />Every Role.
              </h2>
              <p className="mt-6 text-marble-500 font-light leading-relaxed">
                {ROLES.length} specialized roles across {TAXONOMY_GROUPS.length} departments — from above-the-line creatives to post-production and beyond.
              </p>
              <div className="w-12 h-px bg-bronze/40 mt-8" />
            </div>

            {/* Right column — grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TAXONOMY_GROUPS.map((group) => {
                  const groupRoles = ROLES.filter((r) => r.groupSlug === group.slug);
                  return (
                    <div key={group.slug} className="rounded-xl bg-surface-800 p-6">
                      <h3 className="text-sm font-medium text-marble mb-3">{group.name}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {groupRoles.map((role) => (
                          <span
                            key={role.slug}
                            className="inline-block rounded-full bg-surface-700/50 px-2.5 py-1 text-[11px] text-marble-500"
                          >
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-8 bg-surface-800">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight text-marble">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-marble-500 font-light">Start free. Upgrade as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MEMBERSHIP_PLANS.map((plan) => (
              <div
                key={plan.slug}
                className={`relative rounded-xl p-6 ${
                  plan.slug === "hiring-pro"
                    ? "bg-surface-700"
                    : "bg-surface-900"
                }`}
              >
                {/* Bronze accent line for highlighted plan */}
                {plan.slug === "hiring-pro" && (
                  <div className="absolute top-0 left-6 right-6 h-px bg-bronze" />
                )}

                {plan.slug === "hiring-pro" && (
                  <span className="inline-block text-[10px] font-medium text-bronze uppercase tracking-widest mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-sm font-medium text-marble">{plan.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-3xl font-light text-marble">${plan.price}</span>
                  {plan.price > 0 && <span className="text-sm text-marble-500 ml-1">/mo</span>}
                </div>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-marble-500">
                      <svg className="h-3.5 w-3.5 text-bronze mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block text-center rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.slug === "hiring-pro"
                      ? "bg-bronze text-white hover:bg-bronze-600"
                      : "bg-surface-700 text-marble hover:bg-surface-700/80"
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
      <section className="py-32 px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-bronze text-2xl">&#10022;</span>
          <h2 className="mt-6 text-3xl md:text-5xl font-light tracking-tight text-marble">
            Ready to Join the Network?
          </h2>
          <p className="mt-6 text-lg text-marble-500 font-light max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re a producer staffing your next feature or a grip looking for your next gig — FrameOne connects you to the industry.
          </p>
          <Link
            href="/auth/register"
            className="mt-10 inline-flex rounded-full bg-bronze px-10 py-4 text-sm font-medium text-white hover:bg-bronze-600 transition-colors"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="FrameOne" width={20} height={20} className="rounded opacity-60" />
            <span className="text-xs text-marble-500">&copy; 2026 FrameOne</span>
          </div>
          <div className="flex gap-6 text-xs text-marble-500">
            <a href="#" className="hover:text-marble transition-colors">Privacy</a>
            <a href="#" className="hover:text-marble transition-colors">Terms</a>
            <a href="#" className="hover:text-marble transition-colors">Contact</a>
          </div>
        </div>
        <p className="text-[11px] text-[#6b6b78] tracking-wide mt-3 text-center">
          Website built by Adaptation Living LLC — A Brandon Bible Project
        </p>
      </footer>
    </div>
  );
}
