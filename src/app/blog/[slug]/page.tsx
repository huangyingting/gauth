"use client";

import React, { use } from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";
import { GAUTH_BLOG_ARTICLES } from "@/lib/gauth-data/solver-engine";

export default function BlogArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article =
    GAUTH_BLOG_ARTICLES.find((a) => a.slug === slug) || GAUTH_BLOG_ARTICLES[0];

  return (
    <GauthShell>
      <article className="max-w-3xl mx-auto pt-8 pb-16 space-y-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
        >
          ← Back to Blog &amp; Study Guides
        </Link>

        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
              {article.category}
            </span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
            {article.title}
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-[#F9FAFB] p-6 space-y-4">
          {article.content.map((para, idx) => (
            <p
              key={idx}
              className="text-sm text-neutral-800 leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>
      </article>
    </GauthShell>
  );
}
