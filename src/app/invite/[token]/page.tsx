"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, User, Mail } from "lucide-react";

interface InviteStatusResponse {
  valid: boolean;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED" | "INVALID";
  email?: string;
  maskedEmail?: string;
  role?: string;
  expiresAt?: string;
  invitedBy?: string;
}

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token || "";
  const router = useRouter();

  const [invite, setInvite] = useState<InviteStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/invitations/${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (active) {
          setInvite(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setInvite({ valid: false, status: "INVALID" });
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [token]);

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${encodeURIComponent(token)}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: invite?.email,
          name,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not redeem invitation.");
        setSubmitting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error while activating account.");
      setSubmitting(false);
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
            Single-Use Invite
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Verifying invitation token...
          </div>
        ) : !invite?.valid ? (
          <div className="space-y-4">
            <div
              role="alert"
              className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-base font-bold text-amber-900">
                  Invitation {invite?.status || "Unavailable"}
                </h2>
                <p className="text-xs text-amber-800 mt-1">
                  {invite?.status === "EXPIRED"
                    ? "This invitation link has expired. Ask an administrator to issue a new invitation."
                    : invite?.status === "REVOKED"
                    ? "This invitation link was revoked by an administrator."
                    : invite?.status === "ACCEPTED"
                    ? "This single-use invitation has already been claimed."
                    : "This invitation token does not exist or is invalid."}
                </p>
              </div>
            </div>
            <Link
              href="/auth/signin"
              className="block w-full text-center py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Accept Your Invitation
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              Invited by <strong>{invite.invitedBy}</strong> with role{" "}
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 font-semibold text-xs">
                {invite.role}
              </span>
              .
            </p>

            {error && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleAccept} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                  Invited Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={invite.email || ""}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="invite-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="invite-name"
                    type="text"
                    required
                    minLength={2}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="invite-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1"
                >
                  Create Password (min 8 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="invite-password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3B30]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FF3B30] hover:bg-[#E62E2D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? "Activating Account..." : "Activate Gauth Account"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
