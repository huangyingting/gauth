"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";

export default function PrivacyPolicyPage() {
  return (
    <GauthShell>
      <div className="max-w-4xl mx-auto pt-8 pb-16 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Effective Date: October 2026 · GauthTech Pte. Ltd.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 text-xs text-neutral-700 leading-relaxed">
          <p>
            <strong>1. Information We Collect:</strong> We collect account admission records (normalized email address, display name, role, and cryptographic password hashes), study queries, custom courses, and security audit logs necessary to operate the service.
          </p>
          <p>
            <strong>2. Invite-Only Security &amp; Token Hashing:</strong> Raw invitation tokens are never persisted in our database; only one-way SHA-256 digests are stored.
          </p>
          <p>
            <strong>3. Data Retention &amp; Revocation:</strong> Administrators can revoke user access at any time, immediately terminating all active database sessions while preserving compliance audit logs.
          </p>
        </div>
      </div>
    </GauthShell>
  );
}
