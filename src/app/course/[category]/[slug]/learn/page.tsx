"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { findCourseByCategoryAndSlug } from "@/lib/gauth-data/courses-catalog";

export default function CourseLessonPlayerPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = use(params);
  const course = findCourseByCategoryAndSlug(category, slug);

  const [audioModalDismissed, setAudioModalDismissed] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(80);
  const [autoNextBlock, setAutoNextBlock] = useState(true);

  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [paramValue, setParamValue] = useState(
    course.blocks[0]?.defaultVal ?? 50
  );
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorMessages, setTutorMessages] = useState<
    { role: "tutor" | "user"; text: string }[]
  >([
    {
      role: "tutor",
      text: `Welcome to **${course.title}**! Adjust the interactive simulation slider or ask me any question about the current block.`,
    },
  ]);
  const [tutorLoading, setTutorLoading] = useState(false);

  const activeBlock = course.blocks[currentBlockIndex] || course.blocks[0];

  function selectBlock(idx: number) {
    const clamped = Math.max(0, Math.min(course.blocks.length - 1, idx));
    setCurrentBlockIndex(clamped);
    setParamValue(course.blocks[clamped]?.defaultVal ?? 50);
    setSelectedChoice(null);
  }

  async function handleAskTutor(e: React.FormEvent) {
    e.preventDefault();
    const q = tutorInput.trim();
    if (!q) return;
    setTutorMessages((prev) => [...prev, { role: "user", text: q }]);
    setTutorInput("");
    setTutorLoading(true);
    try {
      const res = await fetch("/api/courses/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseTitle: course.title,
          blockTitle: activeBlock.title,
          question: q,
        }),
      });
      const data = await res.json();
      setTutorMessages((prev) => [
        ...prev,
        {
          role: "tutor",
          text:
            data?.reply ||
            `In ${activeBlock.title}, notice how changing ${activeBlock.parameterLabel} shifts the curve response.`,
        },
      ]);
    } finally {
      setTutorLoading(false);
    }
  }

  function handleExportPdf() {
    window.print();
  }

  const backHref =
    category === "science"
      ? "/course/science"
      : category === "history"
      ? "/course/history"
      : category === "my"
      ? "/course/my"
      : "/course/math";

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col">
      {/* Enable Audio Onboarding Modal (Replicated from 08-course-player-action-potential.png) */}
      {!audioModalDismissed && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Enable Audio"
        >
          <div className="bg-[#161B22] border border-neutral-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto text-2xl mb-3">
              🔊
            </div>
            <h2 className="text-lg font-extrabold text-white">Enable Audio</h2>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              This interactive course includes synchronized AI voice narration for each simulation step.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setAudioEnabled(false);
                  setAudioModalDismissed(true);
                }}
                className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-xs font-semibold text-neutral-300"
              >
                Continue Muted
              </button>
              <button
                type="button"
                onClick={() => {
                  setAudioEnabled(true);
                  setAudioModalDismissed(true);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
              >
                Enable Audio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Lesson Header */}
      <header className="h-14 border-b border-neutral-800 bg-[#161B22] px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition"
          >
            ← Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                {course.badge}
              </span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-neutral-400">
                Block {currentBlockIndex + 1} of {course.blocks.length}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-md sm:max-w-xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition"
          >
            <span>📄</span>
            <span>PDF Handout</span>
          </button>
          <button
            type="button"
            onClick={() => setTutorOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition"
          >
            <span>💬</span>
            <span>Ask Tutor</span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace: Interactive Simulation Canvas + Block Transcript */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left 7 Columns: Interactive Simulation Canvas */}
        <div className="lg:col-span-7 relative bg-[#0D1117] border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col justify-between p-6">
          {/* Top Canvas Floating Controls (Zoom / Reset) */}
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700 text-xs font-semibold text-neutral-300">
              ⚡ Interactive Simulation Canvas
            </span>
            <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-700 rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.max(60, z - 10))}
                className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                aria-label="Zoom out"
              >
                −
              </button>
              <span className="text-xs font-mono text-neutral-300 px-1">
                {zoomPercent}%
              </span>
              <button
                type="button"
                onClick={() => setZoomPercent((z) => Math.min(150, z + 10))}
                className="px-2 py-0.5 text-xs text-neutral-300 hover:text-white"
                aria-label="Zoom in"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoomPercent(100);
                  setParamValue(activeBlock.defaultVal);
                }}
                className="ml-1 px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Center Dynamic SVG / Interactive Visualization */}
          <div
            className="my-6 rounded-2xl border border-neutral-800 bg-[#121820] p-6 flex flex-col items-center justify-center min-h-[280px] transition-transform"
            style={{ transform: `scale(${zoomPercent / 100})` }}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Block {activeBlock.index}: {activeBlock.title}
            </div>

            {/* Dynamic Waveform / Curve Responding to Slider */}
            <svg
              viewBox="0 0 420 150"
              className="w-full max-w-md h-36 stroke-blue-400 fill-none"
            >
              <line
                x1="20"
                y1="120"
                x2="400"
                y2="120"
                stroke="#374151"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="15"
                x2="40"
                y2="135"
                stroke="#374151"
                strokeWidth="1"
              />
              <path
                d={`M 40 115 Q 110 115, 150 ${Math.max(
                  20,
                  115 - ((paramValue - activeBlock.minVal) / Math.max(1, activeBlock.maxVal - activeBlock.minVal)) * 95
                )} T 260 125 T 390 110`}
                stroke="#3B82F6"
                strokeWidth="3.5"
              />
              <circle
                cx="150"
                cy={Math.max(
                  20,
                  115 - ((paramValue - activeBlock.minVal) / Math.max(1, activeBlock.maxVal - activeBlock.minVal)) * 95
                )}
                r="6"
                fill="#FF385C"
              />
            </svg>

            <div className="mt-3 rounded-xl bg-neutral-900/90 border border-neutral-800 px-4 py-2 font-mono text-xs text-emerald-400">
              {activeBlock.formula} · [{activeBlock.parameterLabel} = {paramValue}{" "}
              {activeBlock.parameterUnit}]
            </div>
          </div>

          {/* Bottom Interactive Parameter Slider Control */}
          <div className="rounded-2xl bg-[#161B22] border border-neutral-800 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-neutral-300">
                Adjust {activeBlock.parameterLabel}
              </span>
              <span className="font-mono font-bold text-blue-400">
                {paramValue} {activeBlock.parameterUnit}
              </span>
            </div>
            <input
              type="range"
              min={activeBlock.minVal}
              max={activeBlock.maxVal}
              value={paramValue}
              onChange={(e) => setParamValue(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>
                Min: {activeBlock.minVal} {activeBlock.parameterUnit}
              </span>
              <span>
                Default: {activeBlock.defaultVal} {activeBlock.parameterUnit}
              </span>
              <span>
                Max: {activeBlock.maxVal} {activeBlock.parameterUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Block Outline, Narration Transcript & Quick Check */}
        <div className="lg:col-span-5 bg-[#161B22] p-6 overflow-y-auto space-y-6">
          {/* 6-Block Stepper Pills */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Course Blocks ({currentBlockIndex + 1}/{course.blocks.length})
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {course.blocks.map((b, idx) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => selectBlock(idx)}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    idx === currentBlockIndex
                      ? "bg-blue-600 text-white"
                      : idx < currentBlockIndex
                      ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Block Transcript Card */}
          <div className="rounded-2xl bg-[#0D1117] border border-neutral-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">
                Block {activeBlock.index} · {activeBlock.subtitle}
              </span>
              <span className="text-[11px] text-neutral-500">
                {audioEnabled ? `🔊 Vol ${volume}%` : "🔇 Muted"}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white">
              {activeBlock.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {activeBlock.narration}
            </p>
          </div>

          {/* Interactive Concept Check Question */}
          <div className="rounded-2xl bg-[#0D1117] border border-neutral-800 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Interactive Concept Check
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {activeBlock.checkQuestion}
            </p>
            <div className="space-y-2 pt-1">
              {activeBlock.checkChoices.map((choice, cIdx) => {
                const isSelected = selectedChoice === cIdx;
                const isCorrect = cIdx === activeBlock.correctChoiceIndex;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelectedChoice(cIdx)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? isCorrect
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                          : "bg-rose-950/80 border-rose-500 text-rose-200"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600"
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
            {selectedChoice !== null && (
              <div
                className={`text-xs font-semibold pt-1 ${
                  selectedChoice === activeBlock.correctChoiceIndex
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {selectedChoice === activeBlock.correctChoiceIndex
                  ? "✓ Correct! You nailed the core invariant of this block."
                  : "Try testing the simulation slider above and check the primary governing relationship."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Course Player Controls Bar (Replicated from 09-course-player-active.png & 33-course-player-settings-popover.png) */}
      <footer className="h-16 bg-[#161B22] border-t border-neutral-800 px-4 lg:px-8 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            type="button"
            disabled={currentBlockIndex === 0}
            onClick={() => selectBlock(currentBlockIndex - 1)}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-semibold text-neutral-200"
          >
            ⏮ Prev Block
          </button>
          <button
            type="button"
            disabled={currentBlockIndex === course.blocks.length - 1}
            onClick={() => selectBlock(currentBlockIndex + 1)}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs font-semibold text-neutral-200"
          >
            Next Block ⏭
          </button>
        </div>

        <div className="text-xs font-bold text-neutral-300">
          Progress: {currentBlockIndex + 1} / {course.blocks.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen((v) => !v)}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Settings Popover (Audio Volume & Auto Next Block) */}
        {settingsOpen && (
          <div
            className="absolute bottom-20 right-6 z-40 w-72 rounded-2xl bg-[#1C2128] border border-neutral-700 p-4 shadow-2xl space-y-4"
            role="dialog"
            aria-label="Player Settings"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Player Settings
              </span>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-1.5">
                <span>Audio Volume</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span>Auto Next Block</span>
              <button
                type="button"
                onClick={() => setAutoNextBlock((v) => !v)}
                className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  autoNextBlock
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-700 text-neutral-300"
                }`}
              >
                {autoNextBlock ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        )}
      </footer>

      {/* Ask Tutor Slide-Over Drawer (Replicated from 10-course-player-ask-tutor-open.png) */}
      {tutorOpen && (
        <aside
          className="fixed top-14 right-0 bottom-16 z-40 w-full sm:w-96 bg-[#161B22] border-l border-neutral-700 flex flex-col shadow-2xl"
          aria-label="Ask Tutor Drawer"
        >
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-400">
                AI Course Tutor
              </div>
              <div className="text-sm font-bold text-white">
                Ask about {activeBlock.title}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTutorOpen(false)}
              className="text-xs text-neutral-400 hover:text-white px-2 py-1"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {tutorMessages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-xl p-3 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white ml-8"
                    : "bg-[#0D1117] border border-neutral-800 text-neutral-200 mr-4"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAskTutor}
            className="p-3 border-t border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={tutorInput}
              onChange={(e) => setTutorInput(e.target.value)}
              placeholder="Ask Tutor a question about this block..."
              className="flex-1 rounded-xl bg-[#0D1117] border border-neutral-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={tutorLoading}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
            >
              {tutorLoading ? "…" : "Send"}
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
