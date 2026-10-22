"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  UserPlus,
  Copy,
  Check,
  Ban,
  Users,
  Activity,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

interface InvitationRecord {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string | null;
  revokedAt?: string | null;
}

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  role: string;
  plan: string;
  revokedAt: string | null;
  createdAt: string;
}

interface AuditLogRecord {
  id: string;
  actorEmail: string | null;
  action: string;
  targetType: string;
  targetId: string | null;
  metadata: string | null;
  createdAt: string;
}

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Creator");
  const [expiresInHours, setExpiresInHours] = useState(72);
  const [issuedUrl, setIssuedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function loadAdminData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitations");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAuthError(err.message || "Admin access required.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setInvitations(data.invitations || []);
      setUsers(data.users || []);
      setAuditLogs(data.auditLogs || []);
      setAuthError(null);
    } catch {
      setAuthError("Failed to load administrative data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleCreateInvite(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setIssuedUrl(null);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, expiresInHours }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.message || "Could not issue invitation.");
        return;
      }
      setIssuedUrl(data.inviteUrl);
      setEmail("");
      await loadAdminData();
    } catch {
      setFormError("Network error while creating invitation.");
    }
  }

  async function handleRevokeInvite(id: string) {
    await fetch(`/api/admin/invitations/${id}`, { method: "PATCH" });
    await loadAdminData();
  }

  async function handleRevokeUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    await loadAdminData();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] p-8 flex items-center justify-center text-sm text-gray-500">
        Loading Gauth Security & Invitation Console...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-[#FF3B30] mx-auto" />
          <h1 className="text-xl font-bold text-gray-900">Administrator Access Required</h1>
          <p className="text-sm text-gray-600">{authError}</p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/auth/signin?callbackUrl=/admin/invitations"
              className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gauth
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#FF3B30]" />
            <h1 className="text-lg font-bold">
              Gauth Admin — Invite-Only Admission, RBAC & Audit Console
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Issue Invitation Card */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-[#FF3B30]" />
            <h2 className="text-base font-bold">Issue Single-Use Invitation</h2>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {formError}
            </div>
          )}

          {issuedUrl && (
            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  One-Time Invitation Link Generated (Shown Once)
                </div>
                <code
                  data-testid="issued-invite-url"
                  className="text-xs text-emerald-900 break-all block font-mono"
                >
                  {issuedUrl}
                </code>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(issuedUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          )}

          <form onSubmit={handleCreateInvite} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Assigned Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
              >
                <option value="Creator">Creator (Full Study + Create Courses)</option>
                <option value="Viewer">Viewer (Read-Only Learner)</option>
                <option value="Admin">Admin (Full System Administrator)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Expires In (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={720}
                value={expiresInHours}
                onChange={(e) => setExpiresInHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF3B30] hover:bg-[#E62E2D] text-white font-semibold text-sm transition"
              >
                Generate Invite Link
              </button>
            </div>
          </form>
        </section>

        {/* Invitations Table */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-bold mb-4">Invitations ({invitations.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <th className="py-2.5 pr-4">Email</th>
                  <th className="py-2.5 pr-4">Role</th>
                  <th className="py-2.5 pr-4">Status</th>
                  <th className="py-2.5 pr-4">Expires</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invitations.map((inv) => (
                  <tr key={inv.id}>
                    <td className="py-3 pr-4 font-medium">{inv.email}</td>
                    <td className="py-3 pr-4">{inv.role}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          inv.status === "PENDING"
                            ? "bg-blue-50 text-blue-700"
                            : inv.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500">
                      {new Date(inv.expiresAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      {inv.status === "PENDING" && (
                        <button
                          onClick={() => handleRevokeInvite(inv.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users Table */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-bold">Provisioned Accounts ({users.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                  <th className="py-2.5 pr-4">Name</th>
                  <th className="py-2.5 pr-4">Email</th>
                  <th className="py-2.5 pr-4">Role</th>
                  <th className="py-2.5 pr-4">Plan</th>
                  <th className="py-2.5 pr-4">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 pr-4 font-medium">{u.name || "—"}</td>
                    <td className="py-3 pr-4">{u.email}</td>
                    <td className="py-3 pr-4">{u.role}</td>
                    <td className="py-3 pr-4 text-xs font-semibold">{u.plan}</td>
                    <td className="py-3 pr-4">
                      {u.revokedAt ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
                          REVOKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {!u.revokedAt && u.role !== "Admin" && (
                        <button
                          onClick={() => handleRevokeUser(u.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Audit Logs Table */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-gray-700" />
            <h2 className="text-base font-bold">Security Audit Trail ({auditLogs.length})</h2>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 uppercase">
                  <th className="py-2 pr-4">Timestamp</th>
                  <th className="py-2 pr-4">Action</th>
                  <th className="py-2 pr-4">Actor</th>
                  <th className="py-2 pr-4">Target</th>
                  <th className="py-2">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 pr-4 text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-4 font-bold text-gray-900">{log.action}</td>
                    <td className="py-2 pr-4">{log.actorEmail || "system"}</td>
                    <td className="py-2 pr-4">
                      {log.targetType}:{log.targetId?.slice(0, 10) || "—"}
                    </td>
                    <td className="py-2 text-gray-600 truncate max-w-xs">
                      {log.metadata || "{}"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
