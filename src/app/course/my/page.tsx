"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { SUGGESTED_COURSE_PROMPTS } from "@/lib/gauth-data/courses-catalog";

interface CustomCourseItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  createdAt: string;
}

export default function MyCoursePage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [customCourses, setCustomCourses] = useState<CustomCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.customCourses)) {
          setCustomCourses(data.customCourses);
        }
      })
      .finally(() => setLoading(false));
  }, [createOpen]);

  return (
    <GauthShell
      externalCreateModalOpen={createOpen}
      onExternalCreateModalClose={() => setCreateOpen(false)}
    >
      <div className="max-w-5xl mx-auto pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900">My Course</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Generate custom interactive AI courses on any topic or continue your saved courses.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Create a Course</span>
          </button>
        </div>

        {customCourses.length === 0 && !loading ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-[#F9FAFB] p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white mx-auto flex items-center justify-center text-xl font-bold mb-4">
              🎓
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Create Your First Interactive AI Course
            </h2>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1.5">
              Enter any subject, scientific mechanism, math theorem, or historical era and Gauth Academy will build a 6-block interactive simulation course.
            </p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#FF385C] hover:bg-[#E03150] text-white text-xs font-bold transition shadow-sm"
            >
              + Create a Course
            </button>

            <div className="mt-8 pt-6 border-t border-neutral-200/80">
              <div className="text-xs font-semibold text-neutral-500 mb-3">
                Popular AI Course Prompts
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTED_COURSE_PROMPTS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-700 font-medium transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customCourses.map((course) => (
              <Link
                key={course.id}
                href={`/course/my/${course.slug}/learn`}
                className="rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    Custom AI Course · 6 Blocks
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mt-3">
                    {course.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {course.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900">
                  <span>Continue Course</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </GauthShell>
  );
}
