"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";

export default function TermsOfServicePage() {
  return (
    <GauthShell>
      <div className="max-w-4xl mx-auto pt-8 pb-16 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 mt-1">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Effective Date: October 2026 · GauthTech Pte. Ltd.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 text-xs text-neutral-700 leading-relaxed">
          <p>
            <strong>1. Account Admission:</strong> Registration is strictly invite-only. Accounts may only be created by redeeming a valid, non-expired, single-use invitation issued by an authorized Administrator, or via the deployment CLI bootstrap script.
          </p>
          <p>
            <strong>2. Role-Based Access Control:</strong> Users are assigned one of three roles (<code>Admin</code>, <code>Member</code>, or <code>Viewer</code>). Administrative endpoints require an active, non-revoked <code>Admin</code> session.
          </p>
          <p>
            <strong>3. Educational Use:</strong> All AI step-by-step solutions, Gauth Academy interactive courses, and Gauth Atlas spatial stories are provided for educational study and conceptual mastery in accordance with the Gauth Honor Code.
          </p>
        </div>
      </div>
    </GauthShell>
  );
}
