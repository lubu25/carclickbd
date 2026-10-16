"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const RegisterBanner = () => {
  return (
    <section className="relative overflow-hidden border-y border-slate-800/60 bg-gradient-to-r from-[#0b1727] via-[#102a45] to-[#0b1727] text-white py-14 px-6">
      {/* Top luminous accent line effect */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      {/* Subtle modern square grid pattern effect */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="bannerGrid"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <rect x="2" y="2" width="2" height="2" fill="#ffffff" rx="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bannerGrid)" />
        </svg>
      </div>

      {/* Ambient lighting glow effects */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
        {/* Text section */}
        <div className="max-w-3xl">
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-[32px]">
            Ready to Find Your Next Car on CarClickBD?
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-300 md:text-[16px]">
            Join thousands of smart buyers who find their next{" "}
            <span className="font-semibold text-white">
              used & repairable cars, trucks, SUVs
            </span>{" "}
            and more — all through{" "}
            <span className="font-semibold text-[#fbbf24]">
              verified dealer and private seller listings
            </span>{" "}
            powered by CarClickBD. Safe, fast, and fully transparent.
          </p>
        </div>

        {/* Action card */}
        <div className="w-full max-w-sm rounded-2xl border border-white/90 bg-white p-5 text-left shadow-[0_15px_35px_rgba(0,0,0,0.25)] md:w-auto">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Verified marketplace</p>
              <p className="text-xs font-medium text-slate-500">Browse, compare, inquire.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row">
            <Link
              href="/cars"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0b4df5] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e50914]"
            >
              Browse Verified Cars
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/seller-signup"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Seller Signup
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterBanner;
