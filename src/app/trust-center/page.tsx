"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";

export default function TrustCenterPage() {
  return (
    <GauthShell>
      <div className="max-w-5xl mx-auto pt-8 pb-16 space-y-10">
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            🛡️ Gauth Trust Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">
            Privacy, Security &amp; Academic Integrity
          </h1>
          <p className="text-sm text-neutral-300 mt-2 max-w-2xl leading-relaxed">
            At Gauth, safeguarding student data, enforcing strict invite-only account admission and role-based access controls, and promoting step-by-step understanding are foundational commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-extrabold text-neutral-900">
              Data Protection &amp; Encryption
            </h2>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              All credentials and single-use invitation tokens are hashed with cryptographic SHA-256 and scrypt algorithms. Session tokens are validated against server-side database revocation state on every request.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-extrabold text-neutral-900">
              AI Safety &amp; Grounded Pedagogy
            </h2>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Our AI Study Companion is engineered to teach underlying concepts—providing step-by-step derivations, interactive simulations, and cited historical sources rather than unverified shortcuts.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-base font-extrabold text-neutral-900">
              Compliance &amp; Auditability
            </h2>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Every administrative action—from issuing invitations and assigning roles to revoking user sessions—is recorded in an immutable audit trail.
            </p>
          </div>
        </div>
      </div>
    </GauthShell>
  );
}
