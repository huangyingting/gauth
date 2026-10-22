"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SUGGESTED_COURSE_PROMPTS } from "@/lib/gauth-data/courses-catalog";

export interface SessionUserClient {
  id: string;
  email: string;
  name: string | null;
  role: "Admin" | "Member" | "Viewer";
  planTier: string;
  queriesRemaining: number;
  proQuotaRemaining: number;
}

interface GauthShellProps {
  children: React.ReactNode;
  activeNav?: string;
  hideFooter?: boolean;
  fullBleed?: boolean;
  externalCreateModalOpen?: boolean;
  onExternalCreateModalClose?: () => void;
  externalPlusModalOpen?: boolean;
  onExternalPlusModalClose?: () => void;
}

export function GauthShell({
  children,
  hideFooter = false,
  fullBleed = false,
  externalCreateModalOpen,
  onExternalCreateModalClose,
  externalPlusModalOpen,
  onExternalPlusModalClose,
}: GauthShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(
    pathname.startsWith("/news") ||
      pathname.startsWith("/blog") ||
      pathname.startsWith("/trust-center")
  );

  const [user, setUser] = useState<SessionUserClient | null>(null);
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [coursePrompt, setCoursePrompt] = useState("");
  const [creatingCourse, setCreatingCourse] = useState(false);

  const [plusModalOpen, setPlusModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "quarterly" | "annual">("annual");
  const [subscribing, setSubscribing] = useState(false);
  const [plusFeedback, setPlusFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => null);
  }, [pathname]);

  useEffect(() => {
    if (externalCreateModalOpen) setCreateCourseOpen(true);
  }, [externalCreateModalOpen]);

  useEffect(() => {
    if (externalPlusModalOpen) setPlusModalOpen(true);
  }, [externalPlusModalOpen]);

  const closeCreateModal = () => {
    setCreateCourseOpen(false);
    onExternalCreateModalClose?.();
  };

  const closePlusModal = () => {
    setPlusModalOpen(false);
    setPlusFeedback(null);
    onExternalPlusModalClose?.();
  };

  async function handleCreateCourse(e?: React.FormEvent, customPrompt?: string) {
    e?.preventDefault();
    const promptToUse = (customPrompt ?? coursePrompt).trim();
    if (!promptToUse) return;
    setCreatingCourse(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToUse, category: "my" }),
      });
      const data = await res.json();
      closeCreateModal();
      setCoursePrompt("");
      if (data?.course?.href) {
        router.push(data.course.href);
      }
    } finally {
      setCreatingCourse(false);
    }
  }

  async function handleSubscribePlus() {
    setSubscribing(true);
    setPlusFeedback(null);
    try {
      const res = await fetch("/api/plus/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      const data = await res.json();
      if (data?.ok) {
        setPlusFeedback(data.message);
        if (user) {
          setUser({
            ...user,
            planTier: `PLUS_${selectedPlan.toUpperCase()}`,
            queriesRemaining: 999,
            proQuotaRemaining: 999,
          });
        }
      }
    } finally {
      setSubscribing(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/credentials", { method: "DELETE" });
    setUser(null);
    router.refresh();
  }

  const queriesLeft = user ? user.queriesRemaining : 3;
  const proLeft = user ? user.proQuotaRemaining : 1;

  return (
    <div className="min-h-screen flex bg-white text-neutral-900">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-[#F7F8FA] border-r border-neutral-200/80 flex flex-col justify-between transition-all duration-200 ${
          collapsed ? "w-[68px]" : "w-[228px]"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Top Logo & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3 pt-4 pb-3">
          <div className="flex items-center justify-between px-2 mb-5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-black text-base shadow-sm">
                G
              </div>
              {!collapsed && (
                <span className="font-extrabold text-xl tracking-tight text-neutral-900">
                  Gauth
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex w-6 h-6 rounded-full bg-white border border-neutral-200 items-center justify-center text-neutral-500 hover:text-neutral-900 text-xs shadow-sm"
            >
              {collapsed ? "›" : "‹"}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-neutral-500 hover:text-neutral-900 text-sm px-1"
            >
              ✕
            </button>
          </div>

          {/* Primary Homework Link */}
          <nav className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/" || pathname.startsWith("/search-question")
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-700 hover:bg-neutral-200/60"
              }`}
            >
              <span className="text-base">📝</span>
              {!collapsed && <span>Homework</span>}
            </Link>
          </nav>

          {/* Gauth Academy BETA Section */}
          <div className="mt-5 pt-4 border-t border-neutral-200/70">
            {!collapsed && (
              <div className="flex items-center gap-1.5 px-3 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Gauth Academy
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200/80 text-neutral-600">
                  BETA
                </span>
              </div>
            )}
            <div className="space-y-1">
              <Link
                href="/course/science"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  pathname.startsWith("/course/science")
                    ? "bg-white text-neutral-900 shadow-sm font-semibold"
                    : "text-neutral-700 hover:bg-neutral-200/60"
                }`}
              >
                <span>🔬</span>
                {!collapsed && <span>Science Labs</span>}
              </Link>
              <Link
                href="/course/math"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  pathname.startsWith("/course/math")
                    ? "bg-white text-neutral-900 shadow-sm font-semibold"
                    : "text-neutral-700 hover:bg-neutral-200/60"
                }`}
              >
                <span>📐</span>
                {!collapsed && <span>Math Curriculum</span>}
              </Link>
              <Link
                href="/course/history"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  pathname.startsWith("/course/history")
                    ? "bg-white text-neutral-900 shadow-sm font-semibold"
                    : "text-neutral-700 hover:bg-neutral-200/60"
                }`}
              >
                <span>🏛️</span>
                {!collapsed && <span>History Signature</span>}
              </Link>
              <Link
                href="/course/my"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  pathname.startsWith("/course/my")
                    ? "bg-white text-neutral-900 shadow-sm font-semibold"
                    : "text-neutral-700 hover:bg-neutral-200/60"
                }`}
              >
                <span>🎓</span>
                {!collapsed && <span>My Course</span>}
              </Link>
              <button
                type="button"
                onClick={() => setCreateCourseOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-200/60 transition text-left"
              >
                <span className="w-4 h-4 rounded-full border border-neutral-400 flex items-center justify-center text-xs leading-none">
                  +
                </span>
                {!collapsed && <span>Create a Course</span>}
              </button>
            </div>
          </div>

          {/* Gauth Atlas BETA Section */}
          <div className="mt-4 pt-3 border-t border-neutral-200/70">
            <Link
              href="/atlas"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                pathname.startsWith("/atlas")
                  ? "bg-white text-neutral-900 shadow-sm font-semibold"
                  : "text-neutral-700 hover:bg-neutral-200/60"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span>🌍</span>
                {!collapsed && <span>Gauth Atlas</span>}
              </span>
              {!collapsed && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-200/80 text-neutral-600">
                  BETA
                </span>
              )}
            </Link>
          </div>

          {/* Resources Accordion */}
          <div className="mt-3 pt-3 border-t border-neutral-200/70">
            <button
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-200/60 transition"
            >
              <span className="flex items-center gap-2.5">
                <span>📚</span>
                {!collapsed && <span>Resources</span>}
              </span>
              {!collapsed && (
                <span className="text-xs text-neutral-400">
                  {resourcesOpen ? "▴" : "▾"}
                </span>
              )}
            </button>
            {resourcesOpen && !collapsed && (
              <div className="mt-1 ml-6 space-y-1 border-l border-neutral-200 pl-2">
                <Link
                  href="/news"
                  className={`block px-2.5 py-1.5 rounded-md text-xs font-medium ${
                    pathname.startsWith("/news")
                      ? "text-neutral-900 bg-white shadow-sm font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  News
                </Link>
                <Link
                  href="/blog"
                  className={`block px-2.5 py-1.5 rounded-md text-xs font-medium ${
                    pathname.startsWith("/blog")
                      ? "text-neutral-900 bg-white shadow-sm font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Blog
                </Link>
                <Link
                  href="/trust-center"
                  className={`block px-2.5 py-1.5 rounded-md text-xs font-medium ${
                    pathname.startsWith("/trust-center")
                      ? "text-neutral-900 bg-white shadow-sm font-semibold"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Trust Center
                </Link>
              </div>
            )}
          </div>

          {/* Admin Console shortcut if Admin */}
          {user?.role === "Admin" && (
            <div className="mt-3 pt-3 border-t border-neutral-200/70">
              <Link
                href="/admin/invitations"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  pathname.startsWith("/admin")
                    ? "bg-neutral-900 text-white font-semibold"
                    : "text-neutral-700 hover:bg-neutral-200/60"
                }`}
              >
                <span>🛡️</span>
                {!collapsed && <span>Admin Console</span>}
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Quota & Gauth PLUS Widget */}
        {!collapsed && (
          <div className="p-3 border-t border-neutral-200/80 bg-[#F2F4F7]">
            <div className="rounded-xl bg-white p-3 shadow-sm border border-neutral-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Queries</span>
                <span className="font-semibold text-neutral-800">
                  {queriesLeft > 100 ? "Unlimited" : `${queriesLeft}/3`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Gauth AI Pro</span>
                <span className="font-semibold text-neutral-800">
                  {proLeft > 100 ? "Unlimited" : `${proLeft}/1`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPlusModalOpen(true)}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#FFF3CD] hover:bg-[#FFE69C] text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <span>👑</span>
                <span>Join Gauth PLUS</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Utility Header */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur border-b border-neutral-100 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold"
              aria-label="Open menu"
            >
              ☰ Menu
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPlusModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3CD] hover:bg-[#FFE69C] text-neutral-900 font-bold text-xs transition"
            >
              <span>👑</span>
              <span>Gauth PLUS</span>
            </button>

            <Link
              href="/download"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs transition"
            >
              <span>📱</span>
              <span>Free trial on app</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px]">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                  <span className="font-medium text-neutral-800 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-[10px] font-semibold text-neutral-700">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-neutral-500 hover:text-neutral-900 px-2 py-1"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main className={fullBleed ? "flex-1" : "flex-1 px-4 sm:px-8 pb-16"}>
          {children}
        </main>

        {/* Global Gauth Footer */}
        {!hideFooter && (
          <footer className="bg-neutral-950 text-neutral-400 py-12 px-6 lg:px-12 border-t border-neutral-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#FF385C] flex items-center justify-center text-white font-black text-base">
                    G
                  </div>
                  <span className="font-extrabold text-xl text-white">Gauth</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your AI Study Companion for Instant Homework Help, Interactive Science &amp; Math Courses, and Gauth Atlas Visual Stories.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                  Study Tools
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href="/" className="hover:text-white">
                      AI Homework Helper
                    </Link>
                  </li>
                  <li>
                    <Link href="/course/science" className="hover:text-white">
                      Science Labs
                    </Link>
                  </li>
                  <li>
                    <Link href="/course/math" className="hover:text-white">
                      Math Curriculum (Algebra 1, 2 &amp; Geometry)
                    </Link>
                  </li>
                  <li>
                    <Link href="/course/history" className="hover:text-white">
                      History Signature
                    </Link>
                  </li>
                  <li>
                    <Link href="/atlas" className="hover:text-white">
                      Gauth Atlas &amp; AP US History Map
                    </Link>
                  </li>
                  <li>
                    <Link href="/writing-examples" className="hover:text-white">
                      Writing Examples
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                  Company &amp; Resources
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href="/aboutus" className="hover:text-white">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="hover:text-white">
                      Newsroom
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white">
                      Study Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/plus" className="hover:text-white">
                      Gauth PLUS Membership
                    </Link>
                  </li>
                  <li>
                    <Link href="/download" className="hover:text-white">
                      Download App
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                  Trust &amp; Legal
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href="/trust-center" className="hover:text-white">
                      Trust Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/honor" className="hover:text-white">
                      Honor Code
                    </Link>
                  </li>
                  <li>
                    <Link href="/policy" className="hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
              <span>© {new Date().getFullYear()} GauthTech Pte. Ltd. All rights reserved.</span>
              <span>Invite-Only Production Security Enabled</span>
            </div>
          </footer>
        )}
      </div>

      {/* Create a Course Modal (Replicated from 07-create-a-course-modal.png) */}
      {createCourseOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create a Course"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-100 relative">
            <button
              type="button"
              onClick={closeCreateModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500"
              aria-label="Close Create a Course modal"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-neutral-900">Create a Course</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Enter any STEM, history, or exam topic to generate an interactive 6-block visual course.
            </p>

            <form onSubmit={(e) => handleCreateCourse(e)} className="mt-4">
              <div className="relative">
                <textarea
                  rows={3}
                  value={coursePrompt}
                  onChange={(e) => setCoursePrompt(e.target.value)}
                  placeholder="Enter a topic you want to learn..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-4 py-3 text-sm focus:bg-white focus:border-neutral-900 focus:outline-none pr-14"
                />
                <button
                  type="submit"
                  disabled={creatingCourse || !coursePrompt.trim()}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white flex items-center justify-center text-sm font-bold transition"
                  title="Generate Interactive Course"
                  aria-label="Generate Interactive Course"
                >
                  {creatingCourse ? "…" : "→"}
                </button>
              </div>
            </form>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-neutral-500">
                  Suggested Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_COURSE_PROMPTS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setCoursePrompt(topic);
                      handleCreateCourse(undefined, topic);
                    }}
                    className="text-left text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gauth PLUS Subscription Modal (Replicated from 23-gauth-plus-page.png) */}
      {plusModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gauth PLUS Subscription"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 relative">
            <button
              type="button"
              onClick={closePlusModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500"
              aria-label="Close Gauth PLUS modal"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3CD] text-neutral-900 font-bold text-xs">
                👑 Gauth PLUS
              </span>
              <h2 className="text-2xl font-extrabold text-neutral-900 mt-2">
                Unleash Perceived Power of AI
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Unlimited step-by-step solutions · 24/7 Live Tutor access · Ad-free learning
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                className={`p-4 rounded-2xl border text-left transition ${
                  selectedPlan === "monthly"
                    ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/40"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="text-xs font-bold text-neutral-700">Monthly</div>
                <div className="text-2xl font-extrabold text-neutral-900 mt-1">
                  $11.99<span className="text-xs font-normal text-neutral-500">/mo</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  $11.99 billed every month
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("quarterly")}
                className={`p-4 rounded-2xl border text-left transition ${
                  selectedPlan === "quarterly"
                    ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/40"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="text-xs font-bold text-neutral-700">Quarterly</div>
                <div className="text-2xl font-extrabold text-neutral-900 mt-1">
                  $8.99<span className="text-xs font-normal text-neutral-500">/mo</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  $26.99 billed every 3 months
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                className={`p-4 rounded-2xl border text-left transition relative ${
                  selectedPlan === "annual"
                    ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-400/40"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#FF385C] text-white text-[10px] font-bold">
                  SAVE 51%
                </span>
                <div className="text-xs font-bold text-neutral-700">Annually</div>
                <div className="text-2xl font-extrabold text-neutral-900 mt-1">
                  $5.83<span className="text-xs font-normal text-neutral-500">/mo</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">
                  $69.99 billed every 12 months
                </div>
              </button>
            </div>

            {plusFeedback && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 font-medium">
                {plusFeedback}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closePlusModal}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={handleSubscribePlus}
                disabled={subscribing}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition"
              >
                {subscribing ? "Activating…" : "Upgrade to Gauth PLUS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
