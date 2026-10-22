"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GauthShell } from "@/components/GauthShell";
import {
  solveHomeworkQuestion,
  type HomeworkSolutionPayload,
} from "@/lib/gauth-data/solver-engine";

function SearchQuestionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery =
    searchParams.get("q") ||
    "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step";
  const initialSubject = searchParams.get("subject") || "Math";
  const initialId = searchParams.get("id");

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [solution, setSolution] = useState<HomeworkSolutionPayload>(() =>
    solveHomeworkQuestion(initialQuery, initialSubject, false)
  );
  const [loading, setLoading] = useState(false);
  const [proChecking, setProChecking] = useState(false);
  const [helpfulVote, setHelpfulVote] = useState<"helpful" | "not_helpful" | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (initialId) params.set("id", initialId);
    if (initialQuery) params.set("q", initialQuery);
    if (initialSubject) params.set("subject", initialSubject);

    fetch(`/api/homework/solve?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.solution) {
          setSolution(data.solution);
        }
      })
      .catch(() => null);
  }, [initialId, initialQuery, initialSubject]);

  async function handleNewSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!queryInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/homework/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: queryInput,
          subject: initialSubject,
        }),
      });
      const data = await res.json();
      window.dispatchEvent(new Event("gauth:quota-updated"));
      if (data?.solution) {
        setSolution(data.solution);
        setHelpfulVote(null);
        router.replace(
          `/search-question?id=${encodeURIComponent(data.solution.id)}&q=${encodeURIComponent(
            queryInput
          )}&subject=${encodeURIComponent(initialSubject)}`
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleTriggerProAnswer() {
    setProChecking(true);
    try {
      const res = await fetch("/api/homework/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: solution.id,
          questionText: solution.questionText,
          subject: solution.subject,
          isProVerified: true,
        }),
      });
      const data = await res.json();
      window.dispatchEvent(new Event("gauth:quota-updated"));
      if (data?.solution) {
        setSolution(data.solution);
      }
    } finally {
      setProChecking(false);
    }
  }

  async function handleVote(vote: "helpful" | "not_helpful") {
    setHelpfulVote(vote);
    await fetch("/api/homework/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: solution.id,
        vote,
      }),
    }).catch(() => null);
  }

  function handleCopySolution() {
    const text = `Question: ${solution.questionText}\nAnswer: ${solution.answerSummary}\n\nSteps:\n${solution.steps
      .map((s) => `Step ${s.stepNumber}: ${s.title} - ${s.content}`)
      .join("\n")}`;
    navigator.clipboard?.writeText(text).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-16">
      {/* Top Inline Question Search Bar */}
      <form
        onSubmit={handleNewSearch}
        className="rounded-2xl border border-neutral-200 bg-[#F7F8FA] p-2.5 flex items-center gap-2 mb-6"
      >
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Ask another homework question..."
          className="flex-1 bg-transparent px-3 py-1.5 text-sm text-neutral-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[#FF385C] hover:bg-[#E03150] text-white text-xs font-bold transition"
        >
          {loading ? "Solving…" : "Solve →"}
        </button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Question + Answer + Step-by-Step Solution */}
        <div className="lg:col-span-2 space-y-5">
          {/* Question Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Question · {solution.subject}
              </span>
              {solution.isProVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                  ✦ Gauth AI Pro Verified
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg font-bold text-neutral-900">
              {solution.questionText}
            </p>
          </div>

          {/* Answer Card (Replicated from 31-scenario-homework-solution.png) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neutral-900 text-white font-black text-xs flex items-center justify-center">
                G
              </div>
              <span className="font-bold text-sm text-neutral-900">
                Gauth AI Solution
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                99% accuracy
              </span>
            </div>

            {/* Final Answer Highlight */}
            <div>
              <h2 className="text-sm font-bold text-neutral-900 mb-2">Answer</h2>
              <div className="rounded-xl bg-[#F7F8FA] border border-neutral-200/80 px-4 py-3 font-mono text-base font-bold text-neutral-900">
                {solution.answerSummary}
              </div>
            </div>

            {/* Explanation & Review of Key Concepts */}
            <div>
              <h2 className="text-sm font-bold text-neutral-900 mb-2">
                Explanation
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {solution.explanation}
              </p>

              <div className="mt-4 rounded-xl bg-neutral-50 border border-neutral-200/70 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Review of Key Concepts
                </h3>
                <p className="text-xs text-neutral-600 mb-2.5">
                  {solution.keyConcepts.intro}
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-700">
                  {solution.keyConcepts.methods.map((m) => (
                    <li key={m.name}>
                      <span className="font-bold text-neutral-900">{m.name}:</span>{" "}
                      {m.detail}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Numbered Step-by-Step Solution */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">
                Step-by-Step Solution
              </h3>

              {solution.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-xl border border-neutral-200/80 p-4 bg-white"
                >
                  <div className="text-xs font-bold text-neutral-900">
                    Step {step.stepNumber}: {step.title}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                    {step.content}
                  </p>
                  {step.formula && (
                    <div className="mt-2.5 rounded-lg bg-[#F7F8FA] px-3.5 py-2 font-mono text-xs text-neutral-900 overflow-x-auto">
                      {step.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {solution.isProVerified && solution.proVerificationNote && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-950">
                <div className="font-bold mb-1">
                  ✦ Gauth AI Pro Multi-Step Cross-Check
                </div>
                <div>{solution.proVerificationNote}</div>
              </div>
            )}

            {/* Helpful / Not Helpful & Copy Bar */}
            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleVote("helpful")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    helpfulVote === "helpful"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  👍 Helpful
                </button>
                <button
                  type="button"
                  onClick={() => handleVote("not_helpful")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    helpfulVote === "not_helpful"
                      ? "bg-neutral-800 text-white border-neutral-800"
                      : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  👎 Not Helpful
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopySolution}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-600 hover:text-neutral-900"
              >
                {copied ? "✓ Copied" : "📋 Copy Solution"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Gauth AI Pro Callout Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            ⚡ Gauth AI Pro
          </div>
          <h3 className="text-base font-extrabold text-neutral-900">
            Don&apos;t Miss Out!
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Keep getting quicker, deeper, and higher-precision answers with Gauth AI Pro symbolic verification.
          </p>

          <button
            type="button"
            onClick={handleTriggerProAnswer}
            disabled={proChecking || solution.isProVerified}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-emerald-700 text-white text-xs font-bold transition"
          >
            {solution.isProVerified
              ? "✓ Gauth AI Pro Verified"
              : proChecking
              ? "Running Pro Verification…"
              : "Get Gauth AI Pro Answers"}
          </button>

          <div className="text-center text-[11px] text-neutral-400">
            Free Trial: 1 left
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchQuestionPage() {
  return (
    <GauthShell>
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto py-16 text-center text-sm text-neutral-500">
            Solving your homework question step by step…
          </div>
        }
      >
        <SearchQuestionContent />
      </Suspense>
    </GauthShell>
  );
}
