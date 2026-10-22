import React from "react";
import Link from "next/link";
import { GauthShell } from "@/components/GauthShell";

export default function NotFoundPage() {
  return (
    <GauthShell>
      <div className="max-w-2xl mx-auto py-24 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900 text-white text-2xl font-extrabold">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900">
          Page or Study Resource Not Found
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          The requested Gauth route, course lesson, or study article does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition"
          >
            Go to Homework Helper
          </Link>
          <Link
            href="/course/science"
            className="px-5 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-400 text-neutral-800 text-xs font-bold transition"
          >
            Explore Gauth Academy
          </Link>
        </div>
      </div>
    </GauthShell>
  );
}
