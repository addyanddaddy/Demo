"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="FrameOne" width={64} height={64} className="rounded-xl" />
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-zinc-400">Join the entertainment industry&apos;s professional network</p>
          </div>
        </div>

        {errors.form && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            required
            autoFocus
          />

          <Input
            label="Email address"
            type="email"
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            required
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
