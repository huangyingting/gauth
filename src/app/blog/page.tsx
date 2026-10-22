"use client";

import React from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { GAUTH_BLOG_ARTICLES } from "@/lib/gauth-data/solver-engine";

export default function BlogIndexPage() {
  return (
    <GauthShell>
      <div className="max-w-6xl mx-auto pt-8 pb-16 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Gauth Study Resources
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-1">
            Gauth Blog &amp; Study Guides
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            In-depth study guides, formula references, practice problems, and essay writing tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAUTH_BLOG_ARTICLES.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 hover:border-neutral-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2.5">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition">
                  {post.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-900 flex items-center justify-between">
                <span>Read Study Guide</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GauthShell>
  );
}
