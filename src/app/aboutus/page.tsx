"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";

export default function AboutUsPage() {
  return (
    <GauthShell>
      <div className="max-w-4xl mx-auto pt-8 pb-16 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
            About Gauth
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-1">
            Making Quality Education Accessible to Every Learner
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            Gauth combines multi-modal AI reasoning, interactive visual simulations, and a global network of 50,000+ verified subject experts to empower students across Math, Science, History, Literature, and Writing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-3xl font-black text-[#FF385C]">200M+</div>
            <div className="text-xs font-bold text-neutral-900 mt-1">
              Homework Questions Solved
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Step-by-step explanations with 99% verified symbolic and pedagogical accuracy.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-3xl font-black text-blue-600">50,000+</div>
            <div className="text-xs font-bold text-neutral-900 mt-1">
              Verified Subject Tutors
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              24/7 human-in-the-loop expertise across STEM and humanities disciplines.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-3xl font-black text-emerald-600">4.8 ★</div>
            <div className="text-xs font-bold text-neutral-900 mt-1">
              1.9M+ Store Ratings
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Loved by students and educators on iOS App Store, Google Play, and Web.
            </p>
          </div>
        </div>
      </div>
    </GauthShell>
  );
}
