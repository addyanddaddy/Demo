"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
    } catch {
      // Silently handle — always show success
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#1a1a22] rounded-3xl p-10 space-y-8">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center gap-5">
            <Image src="/logo.png" alt="FrameOne" width={56} height={56} className="rounded-xl" />
            <span className="font-light tracking-wide text-2xl text-[#edebe2]">FrameOne</span>
          </div>

          {/* Bronze accent line */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[#c4a47a] text-xs tracking-widest">&#10022;</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-light text-2xl text-[#edebe2]">Reset your password</h1>
            <p className="mt-2 text-[13px] text-[#8a8a96]">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#9d7663]/20 bg-[#9d7663]/[0.06] px-4 py-3 text-sm text-[#c4a47a] text-center">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </div>
              <p className="text-center text-[13px] text-[#8a8a96]">
                <Link
                  href="/auth/login"
                  className="font-medium text-[#9d7663] hover:text-[#c4a47a] transition-colors"
                >
                  Back to login
                </Link>
              </p>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#b8b5a8]">Email address</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[#edebe2] text-sm placeholder:text-[#8a8a96]/60 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#9d7663] text-white rounded-full py-3 hover:bg-[#7a5c48]"
                  loading={loading}
                >
                  Send reset link
                </Button>
              </form>

              {/* Footer link */}
              <p className="text-center text-[13px] text-[#8a8a96]">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-[#9d7663] hover:text-[#c4a47a] transition-colors"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <p className="text-[11px] text-[#6b6b78] tracking-wide text-center py-6">
        Website built by Adaptation Living LLC — A Brandon Bible Project
      </p>
    </div>
  );
}
