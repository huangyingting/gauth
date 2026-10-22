"use client";

import React from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { HISTORY_SIGNATURE_COURSES } from "@/lib/gauth-data/courses-catalog";

export default function HistorySignaturePage() {
  return (
    <GauthShell>
      <div className="max-w-6xl mx-auto pt-6 pb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
            🏛️ Gauth Academy · History Signature
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
            History Signature
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            8 immersive historical narratives with primary source timelines, interactive maps, and AI tutoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HISTORY_SIGNATURE_COURSES.map((course) => (
            <Link
              key={course.slug}
              href={`/course/history/${course.slug}/learn`}
              className="group rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  className="h-36 p-4 flex flex-col justify-between text-white"
                  style={{
                    background: `linear-gradient(135deg, ${course.accentColor}, #1c1917)`,
                  }}
                >
                  <span className="self-start text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                    {course.badge}
                  </span>
                  <span className="text-xs font-medium text-white/90">
                    Interactive History · 6 Chapters
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="text-base font-bold text-neutral-900 group-hover:text-amber-700 transition">
                    {course.title}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-xs font-semibold text-neutral-800">
                <span>Enter Historical Course</span>
                <span className="group-hover:translate-x-0.5 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GauthShell>
  );
}
