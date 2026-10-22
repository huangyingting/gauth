"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  ATLAS_VOICEOVER_LANGUAGES,
  findAtlasSessionById,
} from "@/lib/gauth-data/atlas-catalog";

export default function AtlasSessionViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const session = findAtlasSessionById(id);

  const [viewMode, setViewMode] = useState<"View" | "Details">("View");
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [videoPopoverOpen, setVideoPopoverOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>(
    "English (United States)"
  );
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [generatedVideoBanner, setGeneratedVideoBanner] = useState<
    string | null
  >(null);

  const activeChapter =
    session.chapters[activeChapterIdx] || session.chapters[0];

  async function handleGenerateVideo() {
    setGeneratingVideo(true);
    try {
      const res = await fetch("/api/atlas/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          voiceLanguage: selectedLang,
          generateVideo: true,
        }),
      });
      const data = await res.json();
      setGeneratedVideoBanner(
        data?.narrationSummary ||
          `AI Video Story generated in ${selectedLang} (01:54).`
      );
      setVideoPopoverOpen(false);
    } finally {
      setGeneratingVideo(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex flex-col">
      {/* Top Spatial Session Header (Replicated from 15-atlas-session-silk-roads.png & 32-atlas-generate-video-popover.png) */}
      <header className="h-14 bg-[#161B22] border-b border-neutral-800 px-4 lg:px-6 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <Link
            href="/atlas"
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition"
          >
            ← Back to Atlas
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-lg">
              {session.title}
            </h1>
            <p className="text-[11px] text-neutral-400 truncate max-w-xs sm:max-w-lg">
              {session.subtitle}
            </p>
          </div>
        </div>

        {/* Center View / Details Toggle */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-full p-1">
          <button
            type="button"
            onClick={() => setViewMode("View")}
            className={`px-4 py-1 rounded-full text-xs font-bold transition ${
              viewMode === "View"
                ? "bg-white text-neutral-900"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("Details")}
            className={`px-4 py-1 rounded-full text-xs font-bold transition ${
              viewMode === "Details"
                ? "bg-white text-neutral-900"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Details
          </button>
        </div>

        {/* Right Generate Video Button + 16-Language Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setVideoPopoverOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition shadow-sm"
          >
            <span>🎬</span>
            <span>Generate Video</span>
          </button>

          {videoPopoverOpen && (
            <div
              className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-[#1C2128] border border-neutral-700 p-4 shadow-2xl space-y-3"
              role="dialog"
              aria-label="Generate Video Voiceover Language"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white">
                  Generate AI Video Story
                </span>
                <button
                  type="button"
                  onClick={() => setVideoPopoverOpen(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                Select from 16 voiceover languages to synthesize a narrated visual story:
              </p>

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {ATLAS_VOICEOVER_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      selectedLang === lang
                        ? "bg-blue-600 text-white font-bold"
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    <span>{lang}</span>
                    {selectedLang === lang && <span>✓</span>}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={generatingVideo}
                className="w-full py-2.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-extrabold transition"
              >
                {generatingVideo
                  ? "Synthesizing Video…"
                  : `Generate in ${selectedLang}`}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Generated Video Notification Banner */}
      {generatedVideoBanner && (
        <div className="bg-blue-950/90 border-b border-blue-800 px-6 py-2.5 flex items-center justify-between text-xs text-blue-200">
          <span>▶ {generatedVideoBanner}</span>
          <button
            type="button"
            onClick={() => setGeneratedVideoBanner(null)}
            className="text-blue-300 hover:text-white font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area: View Mode vs Details Mode */}
      {viewMode === "View" ? (
        <div className="flex-1 flex flex-col justify-between p-6 lg:p-10 max-w-6xl w-full mx-auto">
          {/* Spatial Story Canvas Card */}
          <div className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-[#131C2E] via-[#0F172A] to-[#1E1B4B] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300">
                {session.thumbnailLabel}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-neutral-300">
                ⏱ {activeChapter.era}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-neutral-300">
                📍 {activeChapter.location}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {activeChapter.title}
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 mt-4 max-w-3xl leading-relaxed">
              {activeChapter.body}
            </p>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
              <span>📜 Primary Source: {activeChapter.sourceLabel}</span>
              <button
                type="button"
                onClick={() => setViewMode("Details")}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold transition"
              >
                Open Full 4-Chapter Details View →
              </button>
            </div>
          </div>

          {/* Bottom Interactive Chapter Thumbnail Strip */}
          <div className="mt-8">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Interactive Story Chapters ({activeChapterIdx + 1} /{" "}
              {session.chapters.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {session.chapters.map((ch, idx) => {
                const isSelected = idx === activeChapterIdx;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChapterIdx(idx)}
                    className={`text-left p-4 rounded-2xl border transition ${
                      isSelected
                        ? "bg-blue-950/60 border-blue-500 shadow-lg"
                        : "bg-[#161B22] border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="font-bold text-blue-400">
                        Chapter {idx + 1}
                      </span>
                      <span>{ch.era}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {ch.title}
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      {ch.body}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Details Mode (Replicated from 16-atlas-session-details-view.png) */
        <div className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-10 space-y-6">
          <div className="border-b border-neutral-800 pb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {session.thumbnailLabel} · Complete Visual Synthesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {session.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              {session.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {session.chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className="rounded-2xl border border-neutral-800 bg-[#161B22] p-6 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-400">
                    0{idx + 1} · {ch.era}
                  </span>
                  <span className="text-neutral-400">📍 {ch.location}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">{ch.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {ch.body}
                </p>
                <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500">
                  Source: {ch.sourceLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
