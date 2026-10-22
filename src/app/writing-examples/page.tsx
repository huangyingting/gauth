"use client";

import React from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { GAUTH_BLOG_ARTICLES } from "@/lib/gauth-data/solver-engine";

export default function WritingExamplesPage() {
  const writingPosts = GAUTH_BLOG_ARTICLES.filter(
    (p) =>
      p.category.includes("Writing") ||
      p.category.includes("Essay") ||
      p.category.includes("Literature")
  );

  return (
    <GauthShell>
      <div className="max-w-5xl mx-auto pt-8 pb-16 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Gauth Writing &amp; Literature Companion
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-1">
            Writing Examples &amp; Essay Guides
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Model essays, transition phrase guides, and narrative poetry frameworks for students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {writingPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  {post.category}
                </span>
                <h2 className="text-base font-bold text-neutral-900 mt-3">
                  {post.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center justify-between">
                <span>Read Writing Example</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GauthShell>
  );
}
