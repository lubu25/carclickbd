"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

const tabs = ["Makes", "Models", "Featured", "Types", "Trending"];

const data: Record<string, string[]> = {
  Makes: [
    "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge",
    "Ford", "Freightliner", "GMC", "Harley", "Honda", "Hummer", "Hyundai", "Infiniti",
    "International", "Isuzu", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus",
    "Lincoln", "Lotus", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi",
    "Nissan", "Polaris", "Pontiac", "Porsche", "Ram", "Rolls-Royce", "Saab", "Scion",
    "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo", "Yamaha",
  ],
  Models: [
    "Chevrolet Camaro", "Chevrolet Colorado", "Chevrolet Corvette", "Chevrolet Cruze",
    "Chevrolet Equinox", "Chevrolet Impala", "Chevrolet Malibu", "Chevrolet Silverado",
    "Chevrolet Tahoe", "Chevrolet Traverse", "Chrysler Town & Country", "Dodge Charger",
    "Dodge Grand Caravan", "Ford Econoline", "Ford Escape", "Ford Explorer", "Ford F150",
    "Ford F250", "Ford Focus", "Ford Fusion", "Ford Mustang", "Honda Accord", "Honda Civic",
    "Honda CR-V", "Honda Odyssey", "Hyundai Elantra", "Hyundai Sonata", "Jeep Grand Cherokee",
    "Kia Optima", "Nissan Altima", "Nissan Maxima", "Nissan Rogue", "Nissan Sentra",
    "Nissan Versa", "Toyota 4Runner", "Toyota Camry", "Toyota Corolla", "Toyota Highlander",
    "Toyota Prius", "Toyota RAV4", "Toyota Tacoma",
  ],
  Featured: [
    "Dealer Listings", "Private Seller Cars", "Clean Title Cars", "Featured Vehicles",
    "Fleet Cars", "Classic Cars", "Minor Dents/Scratches", "Newly Added Vehicles",
    "New Cars", "Reconditioned Cars", "Local Used Cars", "Low Mileage Cars",
    "Verified Listings", "TRUE REPORT Available", "Finance Available",
  ],
  Types: [
    "Automobiles", "Pickup Trucks", "SUVs", "Sedans", "Hatchbacks", "Crossovers",
    "Motorcycles", "Commercial Vehicles", "Vans", "Wagons", "Coupes", "Convertibles",
  ],
  Trending: [
    "ALL MODELS", "COROLLA", "CAMRY", "RAV4", "CIVIC", "ACCORD", "CR-V",
    "ALTIMA", "ROGUE", "TOYOTA", "FORD", "HONDA", "CHEVROLET", "NISSAN",
    "HYUNDAI", "MERCEDES-BENZ", "BMW", "KIA", "JEEP",
  ],
};

const CarClickBDAutoAuction = () => {
  const [activeTab, setActiveTab] = useState("Makes");

  return (
    <section className="bg-slate-50 py-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-700">
              <Sparkles size={15} />
              Marketplace Explorer
            </div>
            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-normal text-slate-950 md:text-4xl">
              Explore CarClickBD by maker, model, body type, and featured picks.
            </h2>
          </div>
          <Link
            href="/cars"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:bg-sky-600"
          >
            Browse Inventory <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-6">
            <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                    activeTab === tab
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/15"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {data[activeTab].map((item) => (
                  <Link
                    key={`${activeTab}-${item}`}
                    href={`/cars?searchTerm=${encodeURIComponent(item)}`}
                    className="group flex min-h-[46px] items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                    title={item}
                  >
                    <span className="truncate">{item}</span>
                    <ArrowRight
                      size={14}
                      className="shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="overflow-hidden rounded-lg border border-sky-200 bg-gradient-to-b from-[#003399] to-[#001f66] text-white shadow-[0_24px_60px_rgba(0,51,153,0.24)]">
            <div className="relative p-6">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:18px_18px]" />
              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f0b90b] px-4 py-1.5 text-xs font-black uppercase text-slate-950">
                  <BadgeCheck size={14} />
                  Verified Listings
                </div>
                <h3 className="text-3xl font-black leading-tight">
                  Thousands of vehicles, curated for smarter browsing.
                </h3>
              </div>
            </div>

            <div className="relative mx-5 overflow-hidden rounded-lg border border-white/15 bg-white/10">
              <img
                src="https://www.copart.com/content/minor-damage-370x520.png"
                alt="Verified vehicle inventory"
                className="h-72 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-bold text-white/80">Cars, Trucks & SUVs</p>
                <p className="mt-1 text-xl font-black text-white">Ready to compare now</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              {[
                ["40+", "Photos"],
                ["Fast", "Inquiry"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md bg-white/10 p-4">
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CarClickBDAutoAuction;
