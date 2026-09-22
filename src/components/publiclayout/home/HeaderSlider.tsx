"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight, BadgeCheck, FileSearch, Search } from "lucide-react";
import banner01 from "@/assets/banner/banner-01.png";
import banner02 from "@/assets/banner/banner-02.png";
import banner03 from "@/assets/banner/banner-03.png";
import banner04 from "@/assets/banner/banner-04.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  showChassisForm?: boolean;
};

const slides: Slide[] = [
  {
    eyebrow: "Verified dealer and private seller cars",
    title: "Dealer & Private Seller Cars",
    description:
      "Browse new, reconditioned, and local used cars with clear photos, specs, pricing, and direct inquiry support.",
    image: banner01,
    imageAlt: "CarClickBD featured car banner",
    primaryLabel: "Browse Cars",
    primaryHref: "/cars",
    secondaryLabel: "Learn More",
    secondaryHref: "/how-it-works",
  },
  {
    eyebrow: "Inspection confidence",
    title: "Auction Sheet Verification",
    description:
      "Check chassis details, mileage records, grade, and condition notes before making a buying decision.",
    image: banner02,
    imageAlt: "CarClickBD verification banner",
    primaryLabel: "Verify Sheet",
    primaryHref: "/verify-auction-sheet",
    secondaryLabel: "Browse Reconditioned",
    secondaryHref: "/cars?condition=reconditioned",
  },
  {
    eyebrow: "Japanese auction sheet check",
    title: "Verify Auction Sheet Before You Buy",
    description:
      "Submit the chassis number and request available auction sheet details, production year, mileage, grade, and condition notes.",
    image: banner04,
    imageAlt: "Verify Japanese auction sheet with CarClickBD",
    primaryLabel: "Verify Auction Sheet",
    primaryHref: "/verify-auction-sheet",
    secondaryLabel: "Contact Support",
    secondaryHref: "/contact",
    showChassisForm: true,
  },
  {
    eyebrow: "Premium buying support",
    title: "Shortlist Better Cars Faster",
    description:
      "Use smart filters, compare key details, and contact sellers directly when you find the right car.",
    image: banner03,
    imageAlt: "CarClickBD premium buying support banner",
    primaryLabel: "Find Cars",
    primaryHref: "/cars",
    secondaryLabel: "Contact Support",
    secondaryHref: "/contact",
  },
];

export default function HeroSlider() {
  const router = useRouter();
  const [chassisNumber, setChassisNumber] = useState("");

  const handleChassisSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chassis = chassisNumber.trim();
    router.push(
      chassis
        ? `/verify-auction-sheet?chassis=${encodeURIComponent(chassis)}`
        : "/verify-auction-sheet"
    );
  };

  return (
    <section className="relative h-auto w-full overflow-hidden bg-slate-950 lg:h-[280px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="relative min-h-[430px] overflow-hidden bg-gradient-to-br from-[#001b46] via-[#003399] to-[#00142f] text-white sm:min-h-[400px] lg:h-[280px] lg:min-h-[280px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_48%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.22),transparent)]" />
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

              <div className="relative grid min-h-[430px] w-full grid-cols-1 items-center gap-3 px-4 py-5 sm:min-h-[400px] sm:px-5 md:px-10 lg:min-h-[280px] lg:grid-cols-[0.74fr_1.26fr] lg:gap-5 lg:px-16 lg:py-0">
                <div className="z-20">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold backdrop-blur">
                    {slide.primaryHref.includes("verify") ? (
                      <FileSearch size={16} className="text-[#f0b90b]" />
                    ) : (
                      <BadgeCheck size={16} className="text-[#f0b90b]" />
                    )}
                    {slide.eyebrow}
                  </div>

                  <h1 className="max-w-xl text-xl font-black leading-tight tracking-normal sm:text-2xl lg:text-[30px]">
                    {slide.title}
                  </h1>
                  <p className="mt-2 max-w-lg text-xs font-medium leading-5 text-slate-200 lg:text-sm">
                    {slide.description}
                  </p>

                  {slide.showChassisForm ? (
                    <form
                      onSubmit={handleChassisSubmit}
                      className="mt-3 max-w-xl rounded-xl border border-white/20 bg-white/95 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] backdrop-blur"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="relative flex-1">
                          <FileSearch
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#003399]"
                          />
                          <input
                            value={chassisNumber}
                            onChange={(event) =>
                              setChassisNumber(event.target.value)
                            }
                            placeholder="Enter chassis number e.g. NKE165-7245648"
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-xs font-bold uppercase tracking-wide text-slate-900 outline-none transition placeholder:normal-case placeholder:font-semibold placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#e50914] focus:ring-2 focus:ring-red-100"
                          />
                        </label>
                        <button
                          type="submit"
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#e50914] px-5 text-xs font-black uppercase text-white shadow-[0_12px_24px_rgba(229,9,20,0.26)] transition hover:bg-[#b80f17]"
                        >
                          <Search size={17} />
                          Search
                        </button>
                      </div>
                      <p className="mt-1.5 px-1 text-[11px] font-semibold leading-4 text-slate-600">
                        Enter the full chassis number exactly as shown on the
                        vehicle documents.
                      </p>
                    </form>
                  ) : (
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={slide.primaryHref}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#e50914] px-5 text-sm font-extrabold text-white shadow-lg shadow-red-950/20 transition hover:bg-[#b80f17] ${
                          slide.primaryHref.includes("verify")
                            ? "animate-[redGlowPulse_1.7s_ease-in-out_infinite]"
                            : ""
                        }`}
                      >
                        {slide.primaryLabel}
                        <ArrowRight size={17} />
                      </Link>
                      <Link
                        href={slide.secondaryHref}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-white/30 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-slate-950"
                      >
                        {slide.secondaryLabel}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex min-h-[180px] items-center justify-center sm:min-h-[220px] lg:min-h-[270px]">
                  <div className="relative h-[180px] w-full sm:h-[220px] md:h-[250px] lg:h-[270px]">
                    <div className="absolute inset-x-10 bottom-6 h-14 rounded-full bg-black/30 blur-3xl" />
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 760px"
                      className="object-contain object-center drop-shadow-[0_28px_55px_rgba(0,0,0,0.58)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
