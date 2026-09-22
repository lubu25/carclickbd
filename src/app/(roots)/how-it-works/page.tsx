"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "1. Browse Verified Cars",
    desc: "Explore listings from dealers and private sellers. Filter by maker, car name, year, mileage, price, status, and location.",
    icon: "01",
  },
  {
    id: 2,
    title: "2. Review Details",
    desc: "Check photos, specifications, chassis number, production year, registration year, condition, and seller information.",
    icon: "02",
  },
  {
    id: 3,
    title: "3. Send an Inquiry",
    desc: "Use the listing contact form or WhatsApp option. CarClickBD helps connect you with the seller safely.",
    icon: "03",
  },
  {
    id: 4,
    title: "4. Inspect & Verify",
    desc: "Meet in a safe location, inspect the car in daylight, verify documents, and take a test drive when possible.",
    icon: "04",
  },
  {
    id: 5,
    title: "5. Complete the Purchase",
    desc: "Finalize payment only after both parties agree and you are satisfied with the vehicle and documents.",
    icon: "05",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent)]" />
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 text-4xl font-bold md:text-5xl"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-2xl text-lg text-blue-100"
          >
            From browsing to inquiry, inspection, and final purchase,
            CarClickBD keeps the car buying process simple and transparent.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0b90b] text-sm font-black text-slate-950">
                {step.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Find Your Next Car?
          </h2>
          <p className="mb-8 text-blue-100">
            Browse verified listings, compare details, and contact sellers with
            confidence.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/cars"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Browse Cars
            </Link>
            <Link
              href="/sell-item"
              className="rounded-lg bg-[#e50914] px-6 py-3 font-semibold text-white transition hover:bg-[#b80f17]"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
