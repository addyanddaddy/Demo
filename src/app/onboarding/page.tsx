"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGroupedRoles, MEMBERSHIP_PLANS, type RoleData } from "@/lib/taxonomy";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const steps = [
  { num: 1, label: "Choose Roles" },
  { num: 2, label: "Build Profiles" },
  { num: 3, label: "Select Plan" },
  { num: 4, label: "Welcome" },
];

const levelColors: Record<string, "primary" | "success" | "warning" | "gold" | "default"> = {
  HOD: "gold",
  PRINCIPAL: "gold",
  KEY: "primary",
  ASSISTANT: "success",
  TRAINEE: "default",
};

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<RoleData[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [profiles, setProfiles] = useState<Record<string, { displayName: string; bio: string; city: string; region: string; country: string }>>({});
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  const groupedRoles = getGroupedRoles();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const toggleGroup = (slug: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleRole = (role: RoleData) => {
    setSelectedRoles((prev) => {
      const exists = prev.find((r) => r.slug === role.slug);
      if (exists) {
        const newProfiles = { ...profiles };
        delete newProfiles[role.slug];
        setProfiles(newProfiles);
        return prev.filter((r) => r.slug !== role.slug);
      }
      setProfiles((p) => ({
        ...p,
        [role.slug]: { displayName: session?.user?.name || "", bio: "", city: "", region: "", country: "" },
      }));
      return [...prev, role];
    });
  };

  const updateProfile = (slug: string, field: string, value: string) => {
    setProfiles((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedRoleIds: selectedRoles.map((r) => r.slug),
          profiles,
          selectedPlan,
        }),
      });

      if (res.ok) {
        setCurrentStep(4);
      }
    } catch (e) {
      console.error("Onboarding error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="FrameOne" width={48} height={48} className="rounded-lg" />
        </div>

        {/* Step indicator */}
        <div className="mb-12 flex items-center justify-center">
          <div className="flex w-full max-w-lg items-center">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      currentStep > step.num
                        ? "bg-emerald-500 text-white"
                        : currentStep === step.num
                        ? "bg-indigo-600 text-white"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {currentStep > step.num ? <CheckIcon className="h-5 w-5" /> : step.num}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${currentStep >= step.num ? "text-white" : "text-zinc-500"}`}>
                    {step.label}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mt-[-20px] ${currentStep > step.num ? "bg-emerald-500" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Choose Roles */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Choose Your Roles</h1>
              <p className="mt-2 text-zinc-400">Select one or more roles that describe what you do. You can always add more later.</p>
              {selectedRoles.length > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                  <Badge variant="primary" size="md">{selectedRoles.length} role{selectedRoles.length !== 1 ? "s" : ""} selected</Badge>
                  {selectedRoles.map((r) => (
                    <Badge key={r.slug} variant="gold" size="sm">{r.name}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {groupedRoles.map((group) => (
                <div key={group.slug} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                  <button
                    onClick={() => toggleGroup(group.slug)}
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-white">{group.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{group.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.roles.filter((r) => selectedRoles.find((s) => s.slug === r.slug)).length > 0 && (
                        <Badge variant="primary" size="sm">
                          {group.roles.filter((r) => selectedRoles.find((s) => s.slug === r.slug)).length}
                        </Badge>
                      )}
                      {expandedGroups.has(group.slug) ? (
                        <ChevronUpIcon className="h-5 w-5 text-zinc-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-zinc-400" />
                      )}
                    </div>
                  </button>

                  {expandedGroups.has(group.slug) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 pt-0">
                      {group.roles.map((role) => {
                        const isSelected = selectedRoles.find((s) => s.slug === role.slug);
                        return (
                          <Card
                            key={role.slug}
                            variant={isSelected ? "selected" : "interactive"}
                            className="p-4"
                            onClick={() => toggleRole(role)}
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-semibold text-white">{role.name}</h4>
                              <Badge variant={levelColors[role.level] || "default"} size="sm">
                                {role.level}
                              </Badge>
                            </div>
                            <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2">{role.description}</p>
                            {isSelected && (
                              <div className="mt-2 flex items-center gap-1 text-xs text-indigo-400">
                                <CheckIcon className="h-3.5 w-3.5" />
                                Selected
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setCurrentStep(2)} disabled={selectedRoles.length === 0} size="lg">
                Continue ({selectedRoles.length} selected)
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Build Profiles */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Build Your Profiles</h1>
              <p className="mt-2 text-zinc-400">Set up a profile for each of your selected roles.</p>
            </div>

            <div className="space-y-4">
              {selectedRoles.map((role) => (
                <div key={role.slug} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant={levelColors[role.level] || "default"} size="md">{role.level}</Badge>
                    <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Display Name"
                      placeholder="Your professional name"
                      value={profiles[role.slug]?.displayName || ""}
                      onChange={(e) => updateProfile(role.slug, "displayName", e.target.value)}
                    />
                    <Input
                      label="City"
                      placeholder="Los Angeles"
                      value={profiles[role.slug]?.city || ""}
                      onChange={(e) => updateProfile(role.slug, "city", e.target.value)}
                    />
                    <Input
                      label="State / Region"
                      placeholder="California"
                      value={profiles[role.slug]?.region || ""}
                      onChange={(e) => updateProfile(role.slug, "region", e.target.value)}
                    />
                    <Input
                      label="Country"
                      placeholder="United States"
                      value={profiles[role.slug]?.country || ""}
                      onChange={(e) => updateProfile(role.slug, "country", e.target.value)}
                    />
                  </div>
                  <div className="mt-4">
                    <Textarea
                      label="Bio"
                      placeholder="Tell people about your experience and what you bring to a production..."
                      value={profiles[role.slug]?.bio || ""}
                      onChange={(e) => updateProfile(role.slug, "bio", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button onClick={() => setCurrentStep(3)} size="lg">Continue to Plans</Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Plan */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
              <p className="mt-2 text-zinc-400">Start free and upgrade anytime as your needs grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEMBERSHIP_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.slug;
                const isRecommended = plan.slug === "pro-supply";
                return (
                  <Card
                    key={plan.slug}
                    variant={isSelected ? "selected" : "interactive"}
                    className={`p-6 relative ${isRecommended ? "ring-2 ring-amber-500/50" : ""}`}
                    onClick={() => setSelectedPlan(plan.slug)}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="gold" size="sm">Recommended</Badge>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      {plan.price > 0 && <span className="text-sm text-zinc-400">/mo</span>}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                          <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isSelected && (
                      <div className="mt-4 flex items-center justify-center gap-1 text-sm text-indigo-400 font-medium">
                        <CheckIcon className="h-4 w-4" />
                        Selected
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setCurrentStep(2)}>Back</Button>
              <Button onClick={handleComplete} loading={loading} size="lg">
                {selectedPlan === "free" ? "Complete Setup" : "Start Free Trial"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Welcome */}
        {currentStep === 4 && (
          <div className="text-center space-y-8 py-12">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/10">
                <CheckIcon className="h-10 w-10 text-emerald-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome to FrameOne!</h1>
              <p className="mt-2 text-zinc-400">Your profiles are set up and you&apos;re ready to go.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card variant="interactive" className="p-4 text-center" onClick={() => router.push("/profile/edit")}>
                <h3 className="text-sm font-semibold text-white">Complete Profile</h3>
                <p className="text-xs text-zinc-400 mt-1">Add your reel, headshots & credits</p>
              </Card>
              <Card variant="interactive" className="p-4 text-center" onClick={() => router.push("/projects")}>
                <h3 className="text-sm font-semibold text-white">Browse Projects</h3>
                <p className="text-xs text-zinc-400 mt-1">Find productions hiring now</p>
              </Card>
              <Card variant="interactive" className="p-4 text-center" onClick={() => router.push("/discover")}>
                <h3 className="text-sm font-semibold text-white">Search Talent</h3>
                <p className="text-xs text-zinc-400 mt-1">Discover crew & professionals</p>
              </Card>
            </div>

            <Button size="lg" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
