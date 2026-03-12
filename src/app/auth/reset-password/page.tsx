"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f0efe6] text-sm placeholder:text-[#9e9eab]/60 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131318] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#1f1f2a] rounded-3xl p-10 space-y-8">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center gap-5">
            <Image src="/logo.png" alt="FrameOne" width={56} height={56} className="rounded-xl" />
            <span className="font-light tracking-wide text-2xl text-[#f0efe6]">FrameOne</span>
          </div>

          {/* Bronze accent line */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[#c4a47a] text-xs tracking-widest">&#10022;</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-light text-2xl text-[#f0efe6]">Set new password</h1>
            <p className="mt-2 text-[13px] text-[#9e9eab]">Enter your new password below</p>
          </div>

          {success ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#9d7663]/20 bg-[#9d7663]/[0.06] px-4 py-3 text-sm text-[#c4a47a] text-center">
                Password reset. You can now log in.
              </div>
              <p className="text-center">
                <Link
                  href="/auth/login"
                  className="font-medium text-[13px] text-[#9d7663] hover:text-[#c4a47a] transition-colors"
                >
                  Go to login
                </Link>
              </p>
            </div>
          ) : !token ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400 text-center">
                Invalid reset link. Please request a new one.
              </div>
              <p className="text-center">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-[13px] text-[#9d7663] hover:text-[#c4a47a] transition-colors"
                >
                  Request new reset link
                </Link>
              </p>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400 text-center">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#cdc9bc]">New password</label>
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    autoComplete="new-password"
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#cdc9bc]">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className={inputClasses}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#9d7663] text-white rounded-full py-3 hover:bg-[#7a5c48]"
                  loading={loading}
                >
                  Reset password
                </Button>
              </form>

              {/* Footer link */}
              <p className="text-center text-[13px] text-[#9e9eab]">
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
        <p className="text-[11px] text-[#6b6b78] tracking-wide text-center py-6">
          Website built by Adaptation Living LLC — A Brandon Bible Project
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#131318]">
          <div className="text-[#9e9eab] text-sm">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
