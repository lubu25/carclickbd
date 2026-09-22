"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

const RegisterBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#002b8f] via-[#0046ff] to-[#002b8f] text-white py-14 px-6">
      {/* Background dotted pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dotPattern"
              x="0"
              y="0"
              width="25"
              height="25"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        {/* Text section */}
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Find Your Next Car on CarClickBD?
          </h2>
          <p className="text-[15px] md:text-[16px] text-white/90 leading-relaxed">
            Join thousands of smart buyers who find their next{" "}
            <span className="font-semibold text-white">
              used & repairable cars, trucks, SUVs
            </span>{" "}
            and more — all through{" "}
            <span className="text-[#F0B90B] font-semibold">
              verified dealer and private seller listings
            </span>{" "}
            powered by CarClickBD. Safe, fast, and fully transparent.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-lg border border-white/15 bg-white/10 p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur md:w-auto">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F0B90B] text-slate-950">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-white">Verified marketplace</p>
              <p className="text-xs font-medium text-white/70">Browse, compare, inquire.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col xl:flex-row">
            <Link
              href="/cars"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-[#111111] transition hover:bg-[#e50914] hover:text-white"
            >
              Browse Verified Cars
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/seller-signup"
              className="inline-flex h-11 items-center justify-center rounded-md border border-white/25 px-5 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
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
