"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/";
  const callbackUrl =
    rawCallbackUrl.startsWith("/") &&
    !rawCallbackUrl.startsWith("//") &&
    !rawCallbackUrl.startsWith("/\\")
      ? rawCallbackUrl
      : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Network error while signing in.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF3B30] flex items-center justify-center text-white font-extrabold text-xl">
              G
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Gauth
            </span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-[#FF3B30]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Invite-Only Access
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Sign in to Gauth
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Your AI Study Companion. Registration requires a valid single-use invitation link from an administrator.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="signin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="signin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30] focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500 space-y-2">
          <p>
            <strong>Have an invitation token?</strong> Open your{" "}
            <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800">
              /invite/&lt;token&gt;
            </code>{" "}
            link directly to activate your account.
          </p>
          <p>
            <Link href="/" className="text-[#FF3B30] font-semibold hover:underline">
              ← Return to Gauth AI Study Helper
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F8FA]" />}>
      <SignInForm />
    </Suspense>
  );
}
