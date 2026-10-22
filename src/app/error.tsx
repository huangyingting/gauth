"use client";

import React from "react";
import Link from "next/link";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center shadow-lg space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#FF385C] flex items-center justify-center mx-auto text-xl font-black">
          !
        </div>
        <h1 className="text-xl font-extrabold text-neutral-900">
          Something went wrong
        </h1>
        <p className="text-xs text-neutral-500">
          {error.message || "An unexpected error occurred while rendering this view."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-400 text-neutral-800 text-xs font-bold transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
