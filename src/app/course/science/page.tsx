"use client";

import React from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { SCIENCE_LABS_COURSES } from "@/lib/gauth-data/courses-catalog";

export default function ScienceLabsPage() {
  return (
    <GauthShell>
      <div className="max-w-6xl mx-auto pt-6 pb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            🔬 Gauth Academy · Science Labs
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
            Science Labs
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Explore 12 interactive STEM simulations across Biology, Physics, Chemistry, and Physiology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCIENCE_LABS_COURSES.map((course, idx) => (
            <Link
              key={course.slug}
              href={`/course/science/${course.slug}/learn`}
              className="group rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  className="h-32 p-4 flex flex-col justify-between text-white"
                  style={{
                    background: `linear-gradient(135deg, ${course.accentColor}, #111827)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                      {course.badge}
                    </span>
                    <span className="text-xs font-semibold text-white/80">
                      Lab #{idx + 1}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white/90">
                    Interactive Simulation · 6 Blocks
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition">
                    {course.title}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between text-xs font-semibold text-neutral-800">
                <span>Start Interactive Lab</span>
                <span className="group-hover:translate-x-0.5 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GauthShell>
  );
}
