"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.email.includes("@")) newErrors.email = "Invalid email address";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.toLowerCase(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error || "Registration failed" });
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email: form.email.toLowerCase(),
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[#edebe2] text-sm placeholder:text-[#8a8a96]/60 focus:border-[#9d7663]/50 focus:ring-2 focus:ring-[#9d7663]/20 focus:outline-none transition-colors duration-200";
  const errorInputClasses = "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/20";

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
            <span className="text-[#c4a47a] text-xs tracking-widest">✦</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="font-light text-2xl text-[#edebe2]">Create your account</h1>
            <p className="mt-2 text-[13px] text-[#8a8a96]">Join the entertainment industry&apos;s professional network</p>
          </div>

          {/* Error */}
          {errors.form && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400 text-center">
              {errors.form}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#b8b5a8]">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                autoFocus
                className={`${inputClasses} ${errors.name ? errorInputClasses : ""}`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#b8b5a8]">Email address</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                autoComplete="email"
                className={`${inputClasses} ${errors.email ? errorInputClasses : ""}`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#b8b5a8]">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                className={`${inputClasses} ${errors.password ? errorInputClasses : ""}`}
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-[#b8b5a8]">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
                className={`${inputClasses} ${errors.confirmPassword ? errorInputClasses : ""}`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full bg-[#9d7663] text-white rounded-full py-3 hover:bg-[#7a5c48]" loading={loading}>
              Create account
            </Button>
          </form>

          {/* Footer link */}
          <p className="text-center text-[13px] text-[#8a8a96]">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-[#9d7663] hover:text-[#c4a47a] transition-colors">
              Log in
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
