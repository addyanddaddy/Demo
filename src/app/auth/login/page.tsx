"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-[#c4a47a] text-xs tracking-widest">✦</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-light text-2xl text-[#f0efe6]">Welcome back</h1>
            <p className="mt-2 text-[13px] text-[#9e9eab]">Sign in to continue to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#cdc9bc]">Email address</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f0efe6] text-sm placeholder:text-[#9e9eab]/60 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-medium text-[#cdc9bc]">Password</label>
                <Link href="/auth/forgot-password" className="text-[12px] text-[#9d7663] hover:text-[#c4a47a] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f0efe6] text-sm placeholder:text-[#9e9eab]/60 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200"
              />
            </div>

            <label className="flex items-center gap-2.5 text-[13px] text-[#9e9eab] cursor-pointer select-none">
              <input type="checkbox" className="rounded border-white/[0.08] bg-white/[0.04] text-[#9d7663] focus:ring-[#9d7663]/30 w-4 h-4" />
              Remember me
            </label>

            <Button type="submit" className="w-full bg-[#9d7663] text-white rounded-full py-3 hover:bg-[#7a5c48]" loading={loading}>
              Log in
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-[13px] text-[#9e9eab]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-[#9d7663] hover:text-[#c4a47a] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <p className="text-[11px] text-[#6b6b78] tracking-wide text-center py-6">
        Website built by Adaptation Living LLC — A Brandon Bible Project
      </p>
    </div>
  );
}
