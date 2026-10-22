"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";

export default function HonorCodePage() {
  return (
    <GauthShell>
      <div className="max-w-4xl mx-auto pt-8 pb-16 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Academic Integrity
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-1">
            Gauth Honor Code
          </h1>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            Gauth is designed to foster deep conceptual mastery—not academic dishonesty. By using Gauth, every learner agrees to uphold the following principles:
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-bold text-neutral-900">
              1. Use Step-by-Step Solutions to Understand the &ldquo;Why&rdquo;
            </h2>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Study each intermediate step, Review of Key Concepts, and interactive simulation block to master the method so you can solve similar problems independently.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-bold text-neutral-900">
              2. Never Submit AI Output During Closed-Book Assessments
            </h2>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Do not use Gauth to complete proctored exams, quizzes, or assessments where external assistance is prohibited by your school or institution.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-bold text-neutral-900">
              3. Respect Invite-Only Workspace Credentials
            </h2>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Single-use invitation links are personal to the invited email address and must not be shared or redistributed.
            </p>
          </div>
        </div>
      </div>
    </GauthShell>
  );
}
