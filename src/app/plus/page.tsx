"use client";

import React, { useState } from "react";
import { GauthShell } from "@/components/GauthShell";

export default function GauthPlusPage() {
  const [selectedPlan, setSelectedPlan] = useState<
    "monthly" | "quarterly" | "annual"
  >("annual");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleActivate() {
    setLoading(true);
    try {
      const res = await fetch("/api/plus/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data?.message) {
        setStatusMsg(data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <GauthShell>
      <div className="max-w-5xl mx-auto pt-8 pb-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3CD] text-neutral-900 font-bold text-xs">
            👑 Gauth PLUS Membership
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 mt-3">
            Unleash Perceived Power of AI
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Unlimited step-by-step AI Pro answers, 24/7 verified tutor access, and ad-free study across web and mobile.
          </p>
        </div>

        {/* Pricing Cards (Replicated from 23-gauth-plus-page.png) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`cursor-pointer rounded-3xl border p-6 transition ${
              selectedPlan === "monthly"
                ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/50"
                : "border-neutral-200 bg-white"
            }`}
          >
            <div className="text-sm font-bold text-neutral-700">Monthly</div>
            <div className="text-3xl font-extrabold text-neutral-900 mt-2">
              $11.99
              <span className="text-xs font-normal text-neutral-500">
                /month
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              $11.99 billed every month
            </p>
          </div>

          <div
            onClick={() => setSelectedPlan("quarterly")}
            className={`cursor-pointer rounded-3xl border p-6 transition ${
              selectedPlan === "quarterly"
                ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/50"
                : "border-neutral-200 bg-white"
            }`}
          >
            <div className="text-sm font-bold text-neutral-700">Quarterly</div>
            <div className="text-3xl font-extrabold text-neutral-900 mt-2">
              $8.99
              <span className="text-xs font-normal text-neutral-500">
                /month
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              $26.99 billed every 3 months
            </p>
          </div>

          <div
            onClick={() => setSelectedPlan("annual")}
            className={`cursor-pointer rounded-3xl border p-6 transition relative ${
              selectedPlan === "annual"
                ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/50"
                : "border-neutral-200 bg-white"
            }`}
          >
            <span className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-[#FF385C] text-white text-xs font-bold">
              BEST VALUE · SAVE 51%
            </span>
            <div className="text-sm font-bold text-neutral-700">Annually</div>
            <div className="text-3xl font-extrabold text-neutral-900 mt-2">
              $5.83
              <span className="text-xs font-normal text-neutral-500">
                /month
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              $69.99 billed every 12 months
            </p>
          </div>
        </div>

        {statusMsg && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-sm font-semibold text-emerald-800">
            {statusMsg}
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleActivate}
            disabled={loading}
            className="px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-extrabold transition shadow-md"
          >
            {loading ? "Activating Plan…" : "Join Gauth PLUS Now"}
          </button>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="p-4 font-bold text-neutral-900">Feature</th>
                <th className="p-4 font-bold text-neutral-500">Basic</th>
                <th className="p-4 font-bold text-amber-700 bg-amber-50/40">
                  👑 Gauth PLUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="p-4 font-medium">Step-by-Step AI Solutions</td>
                <td className="p-4 text-neutral-500">3 / day</td>
                <td className="p-4 font-bold text-neutral-900 bg-amber-50/20">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium">Gauth AI Pro Deep Check</td>
                <td className="p-4 text-neutral-500">1 Trial</td>
                <td className="p-4 font-bold text-neutral-900 bg-amber-50/20">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium">50,000+ Verified Tutor Help</td>
                <td className="p-4 text-neutral-500">Standard Queue</td>
                <td className="p-4 font-bold text-neutral-900 bg-amber-50/20">
                  24/7 Priority Access
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium">
                  Gauth Academy &amp; Gauth Atlas Video Export
                </td>
                <td className="p-4 text-neutral-500">Included</td>
                <td className="p-4 font-bold text-neutral-900 bg-amber-50/20">
                  Unlimited HD + 16 Languages
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </GauthShell>
  );
}
