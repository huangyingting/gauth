"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GauthShell } from "@/components/GauthShell";
import { ATLAS_INTERACTIVE_SESSIONS } from "@/lib/gauth-data/atlas-catalog";
import { SCIENCE_LABS_COURSES } from "@/lib/gauth-data/courses-catalog";

const SUBJECT_PILLS = [
  "Math",
  "Calculus",
  "Chemistry",
  "Physics",
  "Biology",
  "Business",
  "Writing",
  "Literature",
  "History",
  "Social Science",
  "Statistics",
];

const MATH_KEYBOARD_TABS: Record<
  "Basic" | "Functions" | "Trigonometry" | "Calculus",
  { label: string; insert: string }[]
> = {
  Basic: [
    { label: "x²", insert: "^2" },
    { label: "xⁿ", insert: "^n" },
    { label: "√x", insert: "sqrt()" },
    { label: "ⁿ√x", insert: "root(n, x)" },
    { label: "a/b", insert: "()/()" },
    { label: "π", insert: "π" },
    { label: "±", insert: "±" },
    { label: "≤", insert: "≤" },
    { label: "≥", insert: "≥" },
    { label: "≠", insert: "≠" },
    { label: "|x|", insert: "|x|" },
    { label: "∞", insert: "∞" },
    { label: "( )", insert: "()" },
    { label: "7", insert: "7" },
    { label: "8", insert: "8" },
    { label: "9", insert: "9" },
    { label: "+", insert: " + " },
    { label: "-", insert: " - " },
    { label: "×", insert: " * " },
    { label: "÷", insert: " / " },
    { label: "=", insert: " = " },
  ],
  Functions: [
    { label: "f(x)", insert: "f(x)" },
    { label: "ln(x)", insert: "ln(x)" },
    { label: "log₁₀(x)", insert: "log(x)" },
    { label: "logₐ(b)", insert: "log_a(b)" },
    { label: "eˣ", insert: "e^x" },
    { label: "10ˣ", insert: "10^x" },
    { label: "n!", insert: "n!" },
    { label: "⌊x⌋", insert: "floor(x)" },
  ],
  Trigonometry: [
    { label: "sin(x)", insert: "sin(x)" },
    { label: "cos(x)", insert: "cos(x)" },
    { label: "tan(x)", insert: "tan(x)" },
    { label: "csc(x)", insert: "csc(x)" },
    { label: "sec(x)", insert: "sec(x)" },
    { label: "cot(x)", insert: "cot(x)" },
    { label: "sin⁻¹(x)", insert: "arcsin(x)" },
    { label: "cos⁻¹(x)", insert: "arccos(x)" },
    { label: "tan⁻¹(x)", insert: "arctan(x)" },
    { label: "θ", insert: "θ" },
  ],
  Calculus: [
    { label: "d/dx", insert: "d/dx " },
    { label: "∂/∂x", insert: "∂/∂x " },
    { label: "∫ dx", insert: "∫ () dx" },
    { label: "∫ₐᵇ dx", insert: "∫_a^b () dx" },
    { label: "lim x→a", insert: "lim_(x->a) " },
    { label: "∑", insert: "∑_(n=1)^∞ " },
    { label: "∏", insert: "∏_(i=1)^n " },
    { label: "Δx", insert: "Δx" },
  ],
};

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Math");
  const [mathKeyboardOpen, setMathKeyboardOpen] = useState(false);
  const [activeMathTab, setActiveMathTab] =
    useState<keyof typeof MATH_KEYBOARD_TABS>("Basic");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmitQuestion(e?: React.FormEvent, overrideText?: string) {
    e?.preventDefault();
    const q = (overrideText ?? questionText).trim();
    if (!q) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/homework/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: q,
          subject: selectedSubject,
        }),
      });
      const data = await res.json();
      const id = data?.solution?.id;
      const params = new URLSearchParams({
        q,
        subject: selectedSubject,
      });
      if (id) params.set("id", id);
      router.push(`/search-question?${params.toString()}`);
    } finally {
      setSubmitting(false);
    }
  }

  function handleInsertSymbol(insert: string) {
    setQuestionText((prev) => `${prev}${insert}`);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    if (!questionText.trim()) {
      setQuestionText(
        `[Image OCR: ${file.name}] Solve the quadratic equation x^2 - 5x + 6 = 0 step by step`
      );
    }
  }

  return (
    <GauthShell>
      {/* Hero Homework Helper Section */}
      <section className="max-w-4xl mx-auto pt-8 sm:pt-12 pb-12">
        <div className="text-center mb-7">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Your AI Study Companion
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Instant step-by-step homework explanations, visual stories, and interactive STEM simulations
          </p>
        </div>

        {/* Main Homework Input Box */}
        <form
          onSubmit={(e) => handleSubmitQuestion(e)}
          className="rounded-3xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/40 p-4 sm:p-5 transition focus-within:border-neutral-900"
        >
          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your homework question here or upload an image"
            className="w-full resize-none border-0 bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />

          {/* Image Upload / Dropzone Bar */}
          <div className="mt-2 rounded-2xl border border-dashed border-neutral-200 bg-[#F9FAFB] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 text-xs text-neutral-600">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 hover:underline"
              >
                <span>🖼️</span>
                <span>Upload image</span>
              </button>
              <span className="text-neutral-400">
                or drag &amp; drop / Ctrl + V to paste here (jpg, png, max 20 MB)
              </span>
              {uploadedFileName && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  ✓ {uploadedFileName}
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setMathKeyboardOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition"
              >
                <span>√x</span>
                <span>Math Keyboard</span>
              </button>

              <button
                type="submit"
                disabled={submitting || !questionText.trim()}
                aria-label="Submit homework question"
                className="w-10 h-10 rounded-full bg-[#FF385C] hover:bg-[#E03150] disabled:bg-neutral-200 text-white flex items-center justify-center text-base font-bold transition shadow-sm"
              >
                {submitting ? "…" : "→"}
              </button>
            </div>
          </div>

          {/* Interactive Math Keyboard Modal / Drawer (Replicated from 29-math-keyboard-modal.png) */}
          {mathKeyboardOpen && (
            <div
              className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
              aria-label="Interactive Math Keyboard"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(Object.keys(MATH_KEYBOARD_TABS) as Array<
                    keyof typeof MATH_KEYBOARD_TABS
                  >).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveMathTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        activeMathTab === tab
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-600 hover:bg-neutral-200/70"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setMathKeyboardOpen(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 px-2"
                >
                  Close ✕
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {MATH_KEYBOARD_TABS[activeMathTab].map((sym) => (
                  <button
                    key={sym.label}
                    type="button"
                    onClick={() => handleInsertSymbol(sym.insert)}
                    className="py-2 px-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-400 text-xs font-semibold text-neutral-800 shadow-2xs transition"
                  >
                    {sym.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Subject Pills */}
        <div className="mt-5 flex items-center justify-center flex-wrap gap-2">
          {SUBJECT_PILLS.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => {
                setSelectedSubject(subject);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedSubject === subject
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Sample One-Click Try Prompts */}
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs text-neutral-500">
          <span>Try sample question:</span>
          <button
            type="button"
            onClick={() => {
              const q = "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step";
              setQuestionText(q);
              handleSubmitQuestion(undefined, q);
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            x² - 5x + 6 = 0
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => {
              const q = "Find the derivative d/dx (x^3 - 2x^2 + x - 5)";
              setSelectedSubject("Calculus");
              setQuestionText(q);
              handleSubmitQuestion(undefined, q);
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            d/dx (x³ - 2x² + x - 5)
          </button>
        </div>
      </section>

      {/* Learn Visually with Gauth Atlas Section */}
      <section className="max-w-6xl mx-auto py-10 border-t border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Visual Knowledge Workspace
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              Learn Visually with Gauth Atlas
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/atlas/world_map"
              className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition"
            >
              🗺️ Interactive AP US History Map
            </Link>
            <Link
              href="/atlas"
              className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition"
            >
              Explore All Atlas Stories →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ATLAS_INTERACTIVE_SESSIONS.slice(0, 4).map((story) => (
            <Link
              key={story.id}
              href={story.href}
              className="group rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:shadow-lg transition flex flex-col"
            >
              <div
                className={`h-36 bg-gradient-to-br ${story.accentGradient} p-4 flex flex-col justify-between text-white`}
              >
                <span className="self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                  {story.thumbnailLabel}
                </span>
                <span className="text-xs font-medium text-white/90">
                  Interactive Story · {story.chapters.length} Chapters
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 group-hover:text-blue-600 transition">
                    {story.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {story.subtitle}
                  </p>
                </div>
                <span className="mt-3 text-xs font-semibold text-blue-600">
                  Open Visual Story →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Science Labs Preview */}
      <section className="max-w-6xl mx-auto py-10 border-t border-neutral-100">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Gauth Academy BETA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1">
              Ask Anything, Learn Easily with Interactive Labs
            </h2>
          </div>
          <Link
            href="/course/science"
            className="text-xs font-bold text-neutral-900 hover:underline"
          >
            View All 12 Science Labs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SCIENCE_LABS_COURSES.slice(0, 3).map((course) => (
            <Link
              key={course.slug}
              href={`/course/science/${course.slug}/learn`}
              className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-400 hover:shadow-md transition bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: course.accentColor }}
                  >
                    {course.badge}
                  </span>
                  <span className="text-xs text-neutral-400">6 Interactive Blocks</span>
                </div>
                <h3 className="font-bold text-base text-neutral-900 mt-3">
                  {course.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  {course.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900">
                <span>Launch Interactive Simulation</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Instant Help From Real Experts & 4.8-Star Reviews */}
      <section className="max-w-6xl mx-auto py-10 border-t border-neutral-100 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-neutral-900 text-white p-7 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              24/7 Live Tutor Network
            </span>
            <h2 className="text-2xl font-extrabold mt-1">
              Instant Help From Real Experts
            </h2>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              Every AI step-by-step derivation is backed by our global network of verified STEM and humanities specialists.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-800">
            <div>
              <div className="text-2xl font-black text-amber-400">50K+</div>
              <div className="text-xs text-neutral-400 mt-0.5">Verified Experts</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">98%</div>
              <div className="text-xs text-neutral-400 mt-0.5">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-2xl font-black text-sky-400">24/7</div>
              <div className="text-xs text-neutral-400 mt-0.5">Anytime, Anywhere</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[#F7F8FA] border border-neutral-200 p-7 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
              Trusted by Millions of Students
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">
              Over 1 Million 4.8-Star Reviews
            </h2>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Rated 4.8 out of 5 stars across iOS App Store and Google Play Store for clarity, accuracy, and speed.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-200">
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/70">
              <div className="text-xl font-black text-neutral-900">1,300K+</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                ⭐⭐⭐⭐⭐ App Store Reviews
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-neutral-200/70">
              <div className="text-xl font-black text-neutral-900">628K+</div>
              <div className="text-xs text-neutral-500 mt-0.5">
                ⭐⭐⭐⭐⭐ Google Play Reviews
              </div>
            </div>
          </div>
        </div>
      </section>
    </GauthShell>
  );
}
