"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock3, SearchCheck, ShieldCheck } from "lucide-react";

const tiles = [
  {
    title: "Browse Anywhere",
    subtitle: "Compare verified vehicles from your phone, tablet, or desktop.",
    cta: "Learn More",
    href: "/about",
    image:
      "https://www.copart.com/content/us/en/banners/homepage-300x250/4-300x250.jpg",
    icon: SearchCheck,
    accent: "from-sky-500 to-blue-700",
  },
  {
    title: "Fresh Listings",
    subtitle: "Discover newly added cars with clear photos, specs, and pricing.",
    cta: "Explore Cars",
    href: "/cars",
    image:
      "https://www.copart.com/content/us/en/banners/homepage-300x250/3-300x250.jpg",
    icon: Clock3,
    accent: "from-indigo-500 to-slate-900",
  },
  {
    title: "Verified Details",
    subtitle: "Review condition, mileage, and important vehicle information before inquiry.",
    cta: "View Inventory",
    href: "/cars",
    image:
      "https://www.copart.com/content/us/en/banners/homepage-300x250/2-300x250.jpg",
    icon: ShieldCheck,
    accent: "from-cyan-500 to-blue-900",
  },
  {
    title: "Buyer Support",
    subtitle: "Shortlist cars and contact the team for quick guidance when needed.",
    cta: "View Cars",
    href: "/cars",
    image:
      "https://www.copart.com/content/us/en/banners/homepage-300x250/1-300x250.jpg",
    icon: BadgeCheck,
    accent: "from-blue-500 to-slate-950",
  },
];

const PromoTiles = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="absolute inset-x-0 bottom-0 h-24 border-t border-slate-100 bg-[radial-gradient(circle,#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-700">
            <BadgeCheck size={15} />
            CarClickBD Advantage
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-normal text-slate-950 md:text-4xl">
            A cleaner way to find the right vehicle.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600 md:text-base">
            Search verified listings, compare key details, and move from browsing
            to inquiry with a smoother marketplace experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, index) => {
            const Icon = tile.icon;

            return (
              <motion.article
                key={tile.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:border-sky-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]"
              >
                <div className="relative h-40 overflow-hidden bg-slate-900">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${tile.accent} opacity-35`} />
                  <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-slate-950 shadow-lg shadow-slate-950/20">
                    <Icon size={21} />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-black leading-snug text-slate-950">
                    {tile.title}
                  </h3>
                  <p className="mt-2 min-h-[66px] text-sm font-medium leading-6 text-slate-600">
                    {tile.subtitle}
                  </p>

                  <Link
                    href={tile.href}
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-extrabold text-white transition hover:bg-sky-600"
                  >
                    {tile.cta}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoTiles;
