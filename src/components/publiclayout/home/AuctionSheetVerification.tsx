"use client";

import {
  ArrowRight,
  FileSearch,
  Languages,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { getWhatsAppUrl } from "@/constants/siteContact";

const services = [
  {
    title: "Production Year Check",
    description:
      "Verify production year, Japanese inspection grade, exterior notes, interior grade, and condition remarks before you make a buying decision.",
    icon: ShieldCheck,
    cta: "Verify Sheet",
    href: "https://www.jp.center/month",
    external: true,
    accent: "from-[#003399] to-[#f0b90b]",
  },
  {
    title: "Auction Sheet Translation Service",
    description:
      "Get Japanese auction sheet notes translated into clear buyer-friendly language, including scratches, dents, rust, and repairs.",
    icon: Languages,
    cta: "Contact on WhatsApp",
    href: getWhatsAppUrl("Hello CarClickBD, I need Japanese auction sheet translation service."),
    external: true,
    accent: "from-amber-500 to-orange-600",
  },
];

const AuctionSheetVerification = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#003399] via-[#f0b90b] to-[#003399]" />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f0b90b]/40 bg-[#f0b90b]/10 px-4 py-2 text-sm font-semibold text-[#003399]">
              <FileSearch size={16} />
              Japanese Car Auction Sheet Verification
            </div>

            <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-gray-950 md:text-5xl">
              Know the real condition before you buy.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              CarClickBD helps buyers verify Japanese auction sheets, mileage,
              grades, damage notes, and translated inspection details for
              reconditioned vehicles. Get a clearer view before paying for a car.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/verify-auction-sheet"
                className="inline-flex animate-[redGlowPulse_1.7s_ease-in-out_infinite] items-center justify-center gap-2 rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00266f]"
              >
                Verify Auction Sheet <ArrowRight size={17} />
              </Link>
              <Link
                href="/cars?condition=reconditioned"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
              >
                Browse Reconditioned Cars
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <a
                  key={service.title}
                  href={service.href}
                  target={service.external ? "_blank" : undefined}
                  rel={service.external ? "noreferrer" : undefined}
                  className="group flex min-h-[260px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${service.accent} text-white shadow-lg`}
                  >
                    <Icon size={28} strokeWidth={2.4} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-950">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#003399]">
                    {service.cta}
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionSheetVerification;
