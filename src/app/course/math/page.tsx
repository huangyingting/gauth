"use client";

import React from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { MATH_CURRICULUMS } from "@/lib/gauth-data/courses-catalog";

export default function MathCurriculumIndexPage() {
  const defaultCurriculum = MATH_CURRICULUMS[0];

  return (
    <GauthShell>
      <div className="max-w-6xl mx-auto pt-6 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
              📐 Gauth Academy · Math Curriculum
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
              Math Curriculum
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Complete high-school mastery across Algebra 1 (20 Units), Algebra 2 (20 Units), and Geometry (21 Units).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {MATH_CURRICULUMS.map((curr) => (
              <Link
                key={curr.slug}
                href={`/course/math/${curr.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  curr.slug === defaultCurriculum.slug
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                }`}
              >
                {curr.title} ({curr.unitCount} Units)
              </Link>
            ))}
          </div>
        </div>

        {/* Curriculum Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {MATH_CURRICULUMS.map((curr) => (
            <Link
              key={curr.slug}
              href={`/course/math/${curr.slug}`}
              className="rounded-2xl border border-neutral-200 p-5 bg-white hover:border-neutral-400 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-neutral-900">
                  {curr.title}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {curr.unitCount} Units · {curr.lessonCount} Lessons
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Click to browse all {curr.unitCount} units and launch interactive step-by-step lessons.
              </p>
            </Link>
          ))}
        </div>

        {/* Default Algebra 1 Full Unit & Lesson Tree */}
        <div className="space-y-4">
          {defaultCurriculum.units.map((unit) => (
            <div
              key={unit.unitNumber}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Unit {unit.unitNumber}
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">
                    {unit.title}
                  </h2>
                </div>
                <span className="text-xs text-neutral-400 font-medium">
                  {unit.lessons.length} Lessons
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {unit.lessons.map((lesson, lIdx) => (
                  <Link
                    key={lesson.slug}
                    href={`/course/math/${lesson.slug}/learn`}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] hover:bg-neutral-900 hover:text-white text-xs font-medium text-neutral-800 transition group"
                  >
                    <span className="truncate pr-2">
                      {unit.unitNumber}.{lIdx + 1} {lesson.title}
                    </span>
                    <span className="text-neutral-400 group-hover:text-white shrink-0">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GauthShell>
  );
}
