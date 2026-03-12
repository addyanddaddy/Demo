"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
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
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const groupedRoles = getGroupedRoles();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  useEffect(() => {
    if (currentStep === 4) {
      const timer = setTimeout(() => setCelebrationVisible(true), 100);
      return () => clearTimeout(timer);
    }
    setCelebrationVisible(false);
  }, [currentStep]);

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
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f14]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#9d7663] border-t-transparent" />
      </div>
    );
  }

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#0f0f14] py-10 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Image src="/logo.png" alt="FrameOne" width={48} height={48} className="rounded-xl" />
          <span className="font-light tracking-wide text-lg text-[#edebe2]">FrameOne</span>
        </div>

        {/* Step indicator — minimal dots + bronze progress line */}
        <div className="mb-14">
          <div className="relative mx-auto max-w-sm">
            {/* Background track */}
            <div className="absolute top-[9px] left-0 right-0 h-[2px] bg-white/[0.08]" />
            {/* Bronze progress */}
            <div
              className="absolute top-[9px] left-0 h-[2px] bg-[#9d7663] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Dots */}
            <div className="relative flex items-start justify-between">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${
                      currentStep > step.num
                        ? "bg-[#9d7663] scale-100"
                        : currentStep === step.num
                        ? "bg-[#9d7663] ring-4 ring-[#9d7663]/20 scale-110"
                        : "bg-[#242430] border border-white/[0.08]"
                    }`}
                  >
                    {currentStep > step.num && <CheckIcon className="h-3 w-3 text-white" />}
                  </div>
                  <p className={`mt-3 text-[11px] font-medium tracking-wide ${
                    currentStep >= step.num ? "text-[#edebe2]" : "text-[#8a8a96]/60"
                  }`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Choose Roles */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h1 className="font-light text-3xl text-[#edebe2]">Choose Your Roles</h1>
              <p className="mt-3 text-[#8a8a96] text-[15px]">Select one or more roles that describe what you do. You can always add more later.</p>
              {selectedRoles.length > 0 && (
                <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                  <Badge variant="primary" size="md">{selectedRoles.length} role{selectedRoles.length !== 1 ? "s" : ""} selected</Badge>
                  {selectedRoles.map((r) => (
                    <Badge key={r.slug} variant="gold" size="sm">{r.name}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {groupedRoles.map((group) => (
                <div key={group.slug} className="rounded-2xl bg-[#1a1a22] overflow-hidden">
                  <button
                    onClick={() => toggleGroup(group.slug)}
                    className="flex w-full items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div>
                      <h3 className="text-[15px] font-medium text-[#edebe2]">{group.name}</h3>
                      <p className="text-[12px] text-[#8a8a96] mt-0.5">{group.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.roles.filter((r) => selectedRoles.find((s) => s.slug === r.slug)).length > 0 && (
                        <Badge variant="primary" size="sm">
                          {group.roles.filter((r) => selectedRoles.find((s) => s.slug === r.slug)).length}
                        </Badge>
                      )}
                      {expandedGroups.has(group.slug) ? (
                        <ChevronUpIcon className="h-4 w-4 text-[#8a8a96]" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-[#8a8a96]" />
                      )}
                    </div>
                  </button>

                  {expandedGroups.has(group.slug) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-5 pb-5">
                      {group.roles.map((role) => {
                        const isSelected = selectedRoles.find((s) => s.slug === role.slug);
                        return (
                          <button
                            key={role.slug}
                            onClick={() => toggleRole(role)}
                            className={`text-left rounded-xl p-4 transition-all duration-200 ${
                              isSelected
                                ? "bg-[#9d7663]/[0.08] border border-[#9d7663]/30 ring-1 ring-[#9d7663]/10"
                                : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-[13px] font-medium text-[#edebe2]">{role.name}</h4>
                              <Badge variant={levelColors[role.level] || "default"} size="sm">
                                {role.level}
                              </Badge>
                            </div>
                            <p className="mt-1.5 text-[11px] text-[#8a8a96] line-clamp-2 leading-relaxed">{role.description}</p>
                            {isSelected && (
                              <div className="mt-2 flex items-center gap-1 text-[11px] text-[#9d7663] font-medium">
                                <CheckIcon className="h-3.5 w-3.5" />
                                Selected
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6">
              <Button onClick={() => setCurrentStep(2)} disabled={selectedRoles.length === 0} size="lg" className="bg-[#9d7663] text-white rounded-full hover:bg-[#7a5c48]">
                Continue ({selectedRoles.length} selected)
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Build Profiles */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <h1 className="font-light text-3xl text-[#edebe2]">Build Your Profiles</h1>
                <span className="text-[11px] text-[#c4a47a] font-medium tracking-wide bg-[#c4a47a]/10 px-2 py-0.5 rounded-full">✦ AI-Enhanced</span>
              </div>
              <p className="text-[#8a8a96] text-[15px]">Set up a profile for each of your selected roles.</p>
            </div>

            <div className="space-y-5">
              {selectedRoles.map((role) => (
                <div key={role.slug} className="rounded-2xl bg-[#1a1a22] p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge variant={levelColors[role.level] || "default"} size="md">{role.level}</Badge>
                    <h3 className="text-lg font-light text-[#edebe2]">{role.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  <div className="mt-5">
                    <Textarea
                      label="Bio"
                      placeholder="Tell people about your experience and what you bring to a production..."
                      value={profiles[role.slug]?.bio || ""}
                      onChange={(e) => updateProfile(role.slug, "bio", e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={() => setCurrentStep(1)} className="text-[#8a8a96] hover:text-[#edebe2]">Back</Button>
              <Button onClick={() => setCurrentStep(3)} size="lg" className="bg-[#9d7663] text-white rounded-full hover:bg-[#7a5c48]">
                Continue to Plans
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Plan */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h1 className="font-light text-3xl text-[#edebe2]">Choose Your Plan</h1>
              <p className="mt-3 text-[#8a8a96] text-[15px]">Start free and upgrade anytime as your needs grow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MEMBERSHIP_PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.slug;
                const isRecommended = plan.slug === "pro-supply";
                return (
                  <button
                    key={plan.slug}
                    onClick={() => setSelectedPlan(plan.slug)}
                    className={`text-left rounded-2xl p-7 relative transition-all duration-200 ${
                      isSelected
                        ? "bg-[#9d7663]/[0.08] border border-[#9d7663]/30 ring-1 ring-[#9d7663]/10"
                        : "bg-[#1a1a22] border border-transparent hover:bg-[#1a1a22]/80 hover:border-white/[0.06]"
                    } ${isRecommended && !isSelected ? "ring-1 ring-[#c4a47a]/30" : ""}`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="text-[10px] text-[#c4a47a] font-medium tracking-widest uppercase bg-[#c4a47a]/10 border border-[#c4a47a]/20 px-3 py-1 rounded-full">
                          Recommended
                        </span>
                      </div>
                    )}
                    <h3 className="text-[15px] font-medium text-[#edebe2]">{plan.name}</h3>
                    <div className="mt-3">
                      <span className="text-3xl font-light text-[#edebe2]">${plan.price}</span>
                      {plan.price > 0 && <span className="text-[13px] text-[#8a8a96] ml-1">/mo</span>}
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-[13px] text-[#8a8a96]">
                          <CheckIcon className="h-4 w-4 text-[#9d7663] shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isSelected && (
                      <div className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[#9d7663] font-medium">
                        <CheckIcon className="h-4 w-4" />
                        Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="ghost" onClick={() => setCurrentStep(2)} className="text-[#8a8a96] hover:text-[#edebe2]">Back</Button>
              <Button onClick={handleComplete} loading={loading} size="lg" className="bg-[#9d7663] text-white rounded-full hover:bg-[#7a5c48]">
                {selectedPlan === "free" ? "Complete Setup" : "Start Free Trial"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Welcome — Celebration */}
        {currentStep === 4 && (
          <div className={`text-center space-y-10 py-16 transition-all duration-700 ease-out ${celebrationVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {/* Celebration icon with animated rings */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#9d7663]/10 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#9d7663]/10 ring-1 ring-[#9d7663]/20">
                  <span className="text-4xl text-[#c4a47a]">✦</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="font-light text-4xl text-[#edebe2]">Welcome to FrameOne</h1>
              <p className="text-[#8a8a96] text-[15px] max-w-md mx-auto">Your profiles are set up and you&apos;re ready to go. The industry awaits.</p>
            </div>

            {/* Bronze accent line */}
            <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#9d7663]/40" />
              <span className="text-[#c4a47a] text-[10px] tracking-[0.3em] uppercase font-medium">Begin</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#9d7663]/40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => router.push("/profile/edit")}
                className="rounded-2xl bg-[#1a1a22] p-5 text-center hover:bg-white/[0.04] transition-all duration-200 group"
              >
                <h3 className="text-[13px] font-medium text-[#edebe2] group-hover:text-[#c4a47a] transition-colors">Complete Profile</h3>
                <p className="text-[11px] text-[#8a8a96] mt-1.5 leading-relaxed">Add your reel, headshots & credits</p>
              </button>
              <button
                onClick={() => router.push("/projects")}
                className="rounded-2xl bg-[#1a1a22] p-5 text-center hover:bg-white/[0.04] transition-all duration-200 group"
              >
                <h3 className="text-[13px] font-medium text-[#edebe2] group-hover:text-[#c4a47a] transition-colors">Browse Projects</h3>
                <p className="text-[11px] text-[#8a8a96] mt-1.5 leading-relaxed">Find productions hiring now</p>
              </button>
              <button
                onClick={() => router.push("/discover")}
                className="rounded-2xl bg-[#1a1a22] p-5 text-center hover:bg-white/[0.04] transition-all duration-200 group"
              >
                <h3 className="text-[13px] font-medium text-[#edebe2] group-hover:text-[#c4a47a] transition-colors">Search Talent</h3>
                <p className="text-[11px] text-[#8a8a96] mt-1.5 leading-relaxed">Discover crew & professionals</p>
              </button>
            </div>

            <Button size="lg" onClick={() => router.push("/dashboard")} className="bg-[#9d7663] text-white rounded-full hover:bg-[#7a5c48] px-10">
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
      <p className="text-[11px] text-[#6b6b78] tracking-wide text-center py-6">
        Website built by Adaptation Living LLC — A Brandon Bible Project
      </p>
    </div>
  );
}
