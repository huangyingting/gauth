"use client";

import React from "react";
import { GauthShell } from "@/components/GauthShell";

export default function DownloadAppPage() {
  return (
    <GauthShell>
      <div className="max-w-5xl mx-auto pt-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF385C] text-white text-xs font-bold">
              📱 Gauth Mobile App
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3">
              Snap &amp; Solve Homework in Seconds
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-3 leading-relaxed">
              Download Gauth on iOS and Android to scan printed or handwritten math, physics, chemistry, and biology problems with your camera.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="px-5 py-3 rounded-2xl bg-white text-neutral-900 font-bold text-xs">
                🍎 Download on the App Store (4.8 ★ · 1.3M+ Reviews)
              </div>
              <div className="px-5 py-3 rounded-2xl bg-neutral-700 text-white font-bold text-xs">
                ▶️ Get it on Google Play (4.8 ★ · 628K+ Reviews)
              </div>
            </div>
          </div>

          <div className="bg-white text-neutral-900 rounded-3xl p-6 text-center max-w-xs mx-auto shadow-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Scan QR Code for Free Trial
            </div>
            <div className="w-40 h-40 mx-auto rounded-2xl bg-neutral-100 border-2 border-neutral-900 flex items-center justify-center font-mono text-xs font-bold text-neutral-800 p-4">
              [GAUTH MOBILE APP QR]
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              Point your phone camera here to install Gauth iOS / Android
            </p>
          </div>
        </div>
      </div>
    </GauthShell>
  );
}
