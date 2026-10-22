"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GauthShell } from "@/components/GauthShell";
import {
  ATLAS_VIDEO_STORIES,
  ATLAS_INTERACTIVE_SESSIONS,
  ATLAS_FAQ_ITEMS,
} from "@/lib/gauth-data/atlas-catalog";

type AtlasStoryItem = (typeof ATLAS_INTERACTIVE_SESSIONS)[number];

export default function AtlasLandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [customSessions, setCustomSessions] = useState<AtlasStoryItem[]>([]);
  const [filterTab, setFilterTab] = useState<"All" | "Video" | "Interactive Story">(
    "All"
  );
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch("/api/atlas/sessions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data?.customSessions)) {
          setCustomSessions(data.customSessions);
        }
      })
      .catch(() => null);
  }, []);

  async function handleGenerateVisualStory(e: React.FormEvent) {
    e.preventDefault();
    const q = prompt.trim();
    if (!q) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/atlas/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });
      const data = await res.json();
      window.dispatchEvent(new Event("gauth:quota-updated"));
      if (data?.session?.href) {
        router.push(data.session.href);
      }
    } finally {
      setGenerating(false);
    }
  }

  const allStories = [
    ...customSessions,
    ...ATLAS_VIDEO_STORIES,
    ...ATLAS_INTERACTIVE_SESSIONS,
  ];
  const filteredStories =
    filterTab === "All"
      ? allStories
      : allStories.filter((s) => s.category === filterTab);

  return (
    <GauthShell>
      <div className="max-w-6xl mx-auto pt-8 pb-16 space-y-14">
        {/* Hero Section (Replicated from 11-gauth-atlas-desktop.png) */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            🌍 Gauth Atlas BETA · Visual Learning Workspace
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Everything turns clear when you see it
          </h1>
          <p className="text-sm text-neutral-500 mt-2.5">
            Transform any historical era, scientific mechanism, or complex concept into an interactive spatial canvas and narrated visual story.
          </p>

          <form
            onSubmit={handleGenerateVisualStory}
            className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/40 p-2.5 flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter any topic to explore visually (e.g., Empires of the Silk Roads, Apollo 11)..."
              className="flex-1 px-3 py-2 text-sm text-neutral-900 focus:outline-none"
            />
            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white text-xs font-bold transition"
            >
              {generating ? "Generating…" : "Explore Visually →"}
            </button>
          </form>
        </section>

        {/* Interactive AP US History Map Feature Banner */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
              🗺️ Featured Spatial Atlas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
              Interactive AP US History Map (1491 — Present)
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1.5 max-w-2xl leading-relaxed">
              Explore 106+ chronological AP US History knowledge points across Politics, Economy, and Key Figures with an interactive timeline scrubber and custom POI creator.
            </p>
          </div>
          <Link
            href="/atlas/world_map"
            className="shrink-0 px-6 py-3 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 text-xs font-extrabold transition shadow-md"
          >
            Launch World Map →
          </Link>
        </section>

        {/* Popular Stories Section (6 Video Stories + 13 Interactive Story Sessions) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900">
                Popular Stories
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {ATLAS_VIDEO_STORIES.length} Narrated Video Stories &amp;{" "}
                {ATLAS_INTERACTIVE_SESSIONS.length} Interactive Spatial Sessions
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(["All", "Video", "Interactive Story"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    filterTab === tab
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStories.map((story) => (
              <Link
                key={story.id}
                href={story.href}
                className="group rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`h-40 bg-gradient-to-br ${story.accentGradient} p-4 flex flex-col justify-between text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                        {story.category}
                      </span>
                      {story.duration && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/40">
                          ▶ {story.duration}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-white/75 font-medium">
                        {story.thumbnailLabel}
                      </div>
                      <div className="text-base font-extrabold text-white mt-0.5 line-clamp-1">
                        {story.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                      {story.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-xs font-semibold text-neutral-900">
                  <span>
                    {story.category === "Video"
                      ? "Watch & Explore Story"
                      : "Open Spatial Session"}
                  </span>
                  <span className="group-hover:translate-x-0.5 transition">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3 Value Pillars (Replicated from 12-gauth-atlas-popular-stories.png) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-neutral-100">
          <div className="rounded-2xl border border-neutral-200 p-6 bg-[#F9FAFB]">
            <div className="text-2xl mb-2">🧭</div>
            <h3 className="text-base font-bold text-neutral-900">
              Visual Knowledge Exploration
            </h3>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Navigate spatial canvases where historical trade corridors, chemical kilns, and orbital trajectories connect seamlessly.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-6 bg-[#F9FAFB]">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="text-base font-bold text-neutral-900">
              Built for Visual Learners
            </h3>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Switch effortlessly between interactive spatial View mode, deep chapter Details, and 16-language AI narrated videos.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 p-6 bg-[#F9FAFB]">
            <div className="text-2xl mb-2">📜</div>
            <h3 className="text-base font-bold text-neutral-900">
              Grounded in Sources
            </h3>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Every chapter node cites archaeological records, primary historical archives, and peer-reviewed scientific telemetry.
            </p>
          </div>
        </section>

        {/* 6 FAQ Accordion Section */}
        <section className="max-w-4xl mx-auto pt-4">
          <h2 className="text-2xl font-extrabold text-neutral-900 text-center mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {ATLAS_FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.question}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-neutral-900 hover:bg-neutral-50"
                  >
                    <span>{item.question}</span>
                    <span className="text-neutral-400">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </GauthShell>
  );
}
