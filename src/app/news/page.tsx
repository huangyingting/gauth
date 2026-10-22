"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";
import { GAUTH_NEWS_ITEMS } from "@/lib/gauth-data/solver-engine";

export default function NewsPage() {
  return (
    <GauthShell>
      <div className="max-w-5xl mx-auto pt-8 pb-16 space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF385C]">
            Gauth Newsroom
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-1">
            Gauth in the News
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Press releases, product milestones, and global education technology coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GAUTH_NEWS_ITEMS.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                  <span className="font-bold text-neutral-900 px-2.5 py-0.5 rounded-full bg-neutral-100">
                    {item.outlet}
                  </span>
                  <span>
                    {item.category} · {item.date}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-neutral-900">
                  {item.title}
                </h2>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 text-xs font-semibold text-blue-600">
                Verified Press Coverage
              </div>
            </article>
          ))}
        </div>
      </div>
    </GauthShell>
  );
}
