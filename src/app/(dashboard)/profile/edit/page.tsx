"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/upload/avatar-upload";
import { FileUpload } from "@/components/upload/file-upload";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfiles(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#9d7663] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in py-4">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-light text-[#f0efe6] tracking-tight">My Profiles</h1>
        <p className="text-[13px] text-[#9e9eab] mt-2 tracking-wide">Manage your professional profiles across different roles.</p>
      </div>

      {/* User identity card */}
      <div className="bg-[#1f1f2a] rounded-2xl border border-white/[0.08] p-8">
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="rounded-full ring-2 ring-[#9d7663]/40 ring-offset-2 ring-offset-[#1f1f2a]">
              <AvatarUpload
                name={session?.user?.name || "User"}
                currentUrl={session?.user?.image}
                onUploadComplete={(url) => {
                  fetch("/api/users/me", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatarUrl: url }),
                  });
                }}
                size="xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-light text-[#f0efe6] tracking-tight">{session?.user?.name}</h2>
            <p className="text-[13px] text-[#9e9eab]">{session?.user?.email}</p>
            <div className="flex gap-2 mt-3">
              {profiles.map((p: any) => (
                <span key={p.id} className="inline-flex items-center rounded-full bg-[#9d7663]/15 px-3 py-1 text-[12px] font-medium text-[#c4a47a] tracking-wide">
                  {p.role?.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role profiles */}
      {profiles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#131318]/50 p-16 text-center">
          <UserCircleIcon className="h-12 w-12 text-[#6b6b78] mx-auto mb-4" />
          <h3 className="text-lg font-light text-[#f0efe6] mb-2">No role profiles yet</h3>
          <p className="text-[13px] text-[#6b6b78] mb-8">Complete your onboarding to set up your professional profiles.</p>
          <Button onClick={() => window.location.href = "/onboarding"}>Complete Onboarding</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {profiles.map((profile: any) => (
            <div key={profile.id} className="bg-[#1f1f2a] rounded-2xl border border-white/[0.08] overflow-hidden">
              {/* Profile section header */}
              <div className="px-8 py-5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-light text-[#f0efe6]">{profile.role?.name}</h3>
                  <span className="inline-flex items-center rounded-full bg-[#c4a47a]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#c4a47a] tracking-wide">
                    {profile.role?.level}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-medium text-[#9e9eab] tracking-wide">
                    {profile.role?.taxonomyGroup?.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#6b6b78]">
                  <span>{profile._count?.projectAssignments || 0} credits</span>
                  <span className="w-px h-3 bg-white/[0.08]" />
                  <span>{profile._count?.receivedEndorsements || 0} endorsements</span>
                </div>
              </div>

              {/* Form fields */}
              <div className="px-8 py-8 space-y-8">
                {/* Basic info section */}
                <div>
                  <h4 className="text-lg font-light text-[#f0efe6] mb-5">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Display Name</label>
                      <input
                        type="text"
                        defaultValue={profile.displayName}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">City</label>
                      <input
                        type="text"
                        defaultValue={profile.city || ""}
                        placeholder="Los Angeles"
                        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Region / State</label>
                      <input
                        type="text"
                        defaultValue={profile.region || ""}
                        placeholder="California"
                        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">Country</label>
                      <input
                        type="text"
                        defaultValue={profile.country || ""}
                        placeholder="United States"
                        className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio section with AI label */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <h4 className="text-lg font-light text-[#f0efe6]">Bio</h4>
                    <span className="text-[11px] font-medium text-[#c4a47a] tracking-wide">&#10022; AI-Enhanced</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-medium text-[#cdc9bc] tracking-wide">About You</label>
                    <textarea
                      defaultValue={profile.bio || ""}
                      placeholder="Describe your experience, specialties, and what you bring to a production..."
                      rows={4}
                      className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder-[#6b6b78] focus:border-[#9d7663]/50 focus:outline-none focus:ring-0 transition-colors resize-none"
                    />
                    <p className="text-[11px] text-[#6b6b78] mt-1">Skills and specialties will be automatically extracted from your bio.</p>
                  </div>
                </div>

                {/* Media uploads */}
                <div>
                  <h4 className="text-lg font-light text-[#f0efe6] mb-5">Media & Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FileUpload
                      type="image"
                      label="Portfolio / Headshots"
                      description="Production stills, headshots, lookbooks"
                      currentUrl={profile.portfolioUrl}
                      onUploadComplete={(url) => console.log("Portfolio:", url)}
                    />
                    <FileUpload
                      type="video"
                      label="Demo Reel"
                      description="Your best work — MP4 or MOV up to 256MB"
                      currentUrl={profile.reelUrl}
                      onUploadComplete={(url) => console.log("Reel:", url)}
                    />
                    <FileUpload
                      type="document"
                      label="Resume / CV"
                      description="PDF format preferred"
                      currentUrl={profile.resumeUrl}
                      onUploadComplete={(url) => console.log("Resume:", url)}
                    />
                  </div>
                </div>
              </div>

              {/* Save action */}
              <div className="px-8 py-5 border-t border-white/[0.08] flex justify-end">
                <button className="rounded-xl bg-[#9d7663] px-6 py-2.5 text-[13px] font-medium text-white tracking-wide hover:bg-[#c4a47a] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
