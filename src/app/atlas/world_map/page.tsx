"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FEATURED_WORLD_MAP_POIS,
  type WorldMapPoiItem,
} from "@/lib/gauth-data/atlas-catalog";

const CATEGORY_FILTERS = ["All", "Person", "Politics", "Economy", "Other"] as const;

const APUSH_PERIODS = [
  { label: "All Eras (1491–Present)", start: 1491, end: 2026 },
  { label: "Period 1 (1491–1607)", start: 1491, end: 1607 },
  { label: "Period 2 (1607–1754)", start: 1607, end: 1754 },
  { label: "Period 3 (1754–1800)", start: 1754, end: 1800 },
  { label: "Period 4 (1800–1848)", start: 1800, end: 1848 },
  { label: "Period 5 (1844–1877)", start: 1844, end: 1877 },
  { label: "Period 6 (1865–1898)", start: 1865, end: 1898 },
  { label: "Period 7 (1890–1945)", start: 1890, end: 1945 },
  { label: "Period 8 (1945–1980)", start: 1945, end: 1980 },
  { label: "Period 9 (1980–Present)", start: 1980, end: 2026 },
];

export default function AtlasWorldMapPage() {
  const [minePois, setMinePois] = useState<WorldMapPoiItem[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORY_FILTERS)[number]>("All");
  const [maxYear, setMaxYear] = useState<number>(2026);
  const [minYear, setMinYear] = useState<number>(1491);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [libraryTab, setLibraryTab] = useState<"Featured" | "Mine">("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPoi, setSelectedPoi] = useState<WorldMapPoiItem>(
    FEATURED_WORLD_MAP_POIS[0]
  );

  const [createPoiModalOpen, setCreatePoiModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newRegion, setNewRegion] = useState("Philadelphia, Pennsylvania");
  const [newCategory, setNewCategory] = useState<
    "Person" | "Politics" | "Economy" | "Other"
  >("Politics");
  const [newYear, setNewYear] = useState(1776);
  const [savingPoi, setSavingPoi] = useState(false);

  useEffect(() => {
    fetch("/api/atlas/pois")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.mine)) {
          setMinePois(data.mine);
        }
      })
      .catch(() => null);
  }, []);

  const activeSourceList =
    libraryTab === "Featured" ? FEATURED_WORLD_MAP_POIS : minePois;

  const filteredPois = useMemo(() => {
    return activeSourceList.filter((poi) => {
      if (selectedCategory !== "All" && poi.category !== selectedCategory) {
        return false;
      }
      if (poi.startYear > maxYear || poi.endYear < minYear) {
        return false;
      }
      if (
        searchQuery.trim() &&
        !poi.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !poi.region.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activeSourceList, selectedCategory, minYear, maxYear, searchQuery]);

  async function handleCreatePoi(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSavingPoi(true);
    try {
      const res = await fetch("/api/atlas/pois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          summary:
            newSummary ||
            `Historical knowledge point in ${newRegion} (${newYear}).`,
          region: newRegion,
          category: newCategory,
          startYear: newYear,
          endYear: newYear,
          lat: 39.9526,
          lng: -75.1652,
        }),
      });
      const data = await res.json();
      if (data?.poi) {
        setMinePois((prev) => [data.poi, ...prev]);
        setSelectedPoi(data.poi);
        setLibraryTab("Mine");
        setCreatePoiModalOpen(false);
        setNewTitle("");
        setNewSummary("");
      }
    } finally {
      setSavingPoi(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col">
      {/* Top World Map Navigation Bar (Replicated from 13-atlas-world-map.png) */}
      <header className="h-14 bg-[#111827]/95 border-b border-slate-800 px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/atlas"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            ← Back to Atlas
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white">
              Interactive AP US History Map
            </h1>
            <p className="text-[11px] text-slate-400">
              {FEATURED_WORLD_MAP_POIS.length} Featured Historical Knowledge Points ·{" "}
              {minYear} — {maxYear >= 2025 ? "Present" : maxYear}
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full p-1">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCreatePoiModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
          >
            + Create POI
          </button>
          <button
            type="button"
            onClick={() => setLibraryOpen((v) => !v)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
          >
            📚 Knowledge Library ({filteredPois.length})
          </button>
        </div>
      </header>

      {/* Main Map Canvas + Knowledge Library Drawer */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Interactive Spatial Map Viewport */}
        <div className="flex-1 relative bg-[#0B1528] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          {/* Period Quick Selector Bar */}
          <div className="z-10 flex items-center gap-1.5 overflow-x-auto pb-2">
            {APUSH_PERIODS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setMinYear(p.start);
                  setMaxYear(p.end);
                }}
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition ${
                  minYear === p.start && maxYear === p.end
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Interactive SVG North America / Atlantic Historical Map Canvas */}
          <div className="my-auto relative rounded-3xl border border-slate-800/90 bg-[#0F1D36] p-4 sm:p-6 shadow-2xl min-h-[380px] flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 800 420"
              className="w-full h-full max-h-[420px] select-none"
            >
              {/* Subtle Latitude / Longitude Grid */}
              {[80, 160, 240, 320].map((y) => (
                <line
                  key={`lat-${y}`}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray="4 4"
                />
              ))}
              {[150, 300, 450, 600].map((x) => (
                <line
                  key={`lng-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="420"
                  stroke="#1E293B"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Stylized Continental North America & Atlantic Basin Silhouette */}
              <path
                d="M 90 70 L 280 55 L 430 95 L 520 145 L 490 230 L 420 295 L 340 320 L 230 295 L 140 230 L 95 150 Z"
                fill="#162847"
                stroke="#334155"
                strokeWidth="2"
              />
              <path
                d="M 590 95 L 720 80 L 750 185 L 640 220 Z"
                fill="#162847"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Plot Interactive POI Markers */}
              {filteredPois.slice(0, 60).map((poi) => {
                const x = Math.max(
                  60,
                  Math.min(740, ((poi.lng + 130) / 75) * 520 + 80)
                );
                const y = Math.max(
                  45,
                  Math.min(370, ((52 - poi.lat) / 30) * 280 + 50)
                );
                const isSelected = selectedPoi?.id === poi.id;
                const pinColor =
                  poi.category === "Politics"
                    ? "#EF4444"
                    : poi.category === "Economy"
                    ? "#F59E0B"
                    : poi.category === "Person"
                    ? "#3B82F6"
                    : "#10B981";

                return (
                  <g
                    key={poi.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedPoi(poi)}
                  >
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill={pinColor}
                        opacity="0.28"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "7" : "5"}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? "2" : "1"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Selected POI Floating Detail Overlay Card */}
            {selectedPoi && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 shadow-2xl">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300">
                    {selectedPoi.category} · {selectedPoi.startYear}
                    {selectedPoi.endYear !== selectedPoi.startYear
                      ? `–${selectedPoi.endYear}`
                      : ""}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    📍 {selectedPoi.region}
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-white mt-2">
                  {selectedPoi.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedPoi.summary}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Timeline Scrubber (1491 — Present) */}
          <div className="z-10 rounded-2xl bg-slate-900/95 border border-slate-800 px-5 py-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-300">
                Chronological Timeline Filter
              </span>
              <span className="font-mono font-bold text-amber-400">
                {minYear} — {maxYear >= 2025 ? "Present" : maxYear} (
                {filteredPois.length} Events)
              </span>
            </div>
            <input
              type="range"
              min={1491}
              max={2026}
              value={maxYear}
              onChange={(e) => setMaxYear(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
              aria-label="Timeline Year Scrubber"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1491</span>
              <span>1607</span>
              <span>1776</span>
              <span>1865</span>
              <span>1945</span>
              <span>Present</span>
            </div>
          </div>
        </div>

        {/* Right Collapsible Knowledge Library Drawer (Replicated from 14-atlas-world-map-knowledge-library.png) */}
        {libraryOpen && (
          <aside
            className="w-full sm:w-96 bg-[#111827] border-l border-slate-800 flex flex-col h-[calc(100vh-3.5rem)]"
            aria-label="Knowledge Library"
          >
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-white">
                  Knowledge Library
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatePoiModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white"
                  >
                    + Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setLibraryOpen(false)}
                    className="text-xs text-slate-400 hover:text-white px-1.5"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Featured vs Mine Tabs */}
              <div className="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLibraryTab("Featured")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    libraryTab === "Featured"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Featured ({FEATURED_WORLD_MAP_POIS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryTab("Mine")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
                    libraryTab === "Mine"
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Mine ({minePois.length})
                </button>
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge points or regions..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Scrollable POI List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredPois.length === 0 ? (
                <div className="text-center py-12 px-4 text-xs text-slate-400">
                  No knowledge points match this filter. Click{" "}
                  <button
                    type="button"
                    onClick={() => setCreatePoiModalOpen(true)}
                    className="text-blue-400 underline font-semibold"
                  >
                    + Create
                  </button>{" "}
                  to add your own POI.
                </div>
              ) : (
                filteredPois.map((poi) => {
                  const active = selectedPoi?.id === poi.id;
                  return (
                    <button
                      key={poi.id}
                      type="button"
                      onClick={() => setSelectedPoi(poi)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        active
                          ? "bg-blue-950/60 border-blue-500"
                          : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-blue-400">
                          {poi.category}
                        </span>
                        <span className="font-mono">
                          {poi.startYear}
                          {poi.endYear !== poi.startYear
                            ? `–${poi.endYear}`
                            : ""}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1">
                        {poi.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        📍 {poi.region}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Create Custom Knowledge Point Modal */}
      {createPoiModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Create Knowledge Point"
        >
          <div className="bg-[#111827] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-white">
                Create Custom Knowledge Point
              </h2>
              <button
                type="button"
                onClick={() => setCreatePoiModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePoi} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Constitutional Convention of 1787"
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as
                          | "Person"
                          | "Politics"
                          | "Economy"
                          | "Other"
                      )
                    }
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  >
                    <option value="Politics">Politics</option>
                    <option value="Economy">Economy</option>
                    <option value="Person">Person</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    min={1491}
                    max={2026}
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Region / Location
                </label>
                <input
                  type="text"
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Historical Summary
                </label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe the historical significance..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreatePoiModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPoi}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
                >
                  {savingPoi ? "Saving…" : "Save to My Library"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
