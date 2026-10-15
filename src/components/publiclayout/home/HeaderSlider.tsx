"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight, BadgeCheck, FileSearch, Search, ShieldCheck } from "lucide-react";
import banner01 from "@/assets/banner/banner-01.png";
import banner02 from "@/assets/banner/banner-02.png";
import banner03 from "@/assets/banner/banner-03.png";
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
    eyebrow: "Japanese auction sheet check",
    title: "Verify Auction Sheet Before You Buy",
    description:
      "Submit the chassis number and request available auction sheet details, production year, mileage, grade, and condition notes.",
    image: banner01,
    imageAlt: "Toyota Land Cruiser 300 ZX and Toyota Harrier luxury Japanese cars in showroom",
    primaryLabel: "Verify Auction Sheet",
    primaryHref: "/verify-auction-sheet",
    secondaryLabel: "Contact Support",
    secondaryHref: "/contact",
    showChassisForm: true,
  },
  {
    eyebrow: "Verified dealer and private seller cars",
    title: "Dealer & Private Seller Cars",
    description:
      "Browse new, reconditioned, and local used cars with clear photos, specs, pricing, and direct inquiry support.",
    image: banner02,
    imageAlt: "Toyota Crown luxury sedan and Land Cruiser Prado in showroom",
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
    image: banner03,
    imageAlt: "Toyota Alphard Executive Lounge and Lexus RX luxury Japanese cars in showroom",
    primaryLabel: "Verify Sheet",
    primaryHref: "/verify-auction-sheet",
    secondaryLabel: "Browse Reconditioned",
    secondaryHref: "/cars?condition=reconditioned",
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
    <section className="relative w-full overflow-hidden border-b border-slate-200/70 bg-white">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        loop
        className="hero-slider-swiper h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="relative min-h-[440px] sm:min-h-[410px] lg:h-[350px] xl:h-[370px] w-full overflow-hidden bg-gradient-to-r from-white via-slate-50/60 to-white text-slate-900">
              {/* Background Japanese Luxury Car Image in White Studio */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1920px"
                  className="object-cover object-right md:object-center"
                />

                {/* White Theme Gradient Overlays for Flawless Readability & Header Blend */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/85 lg:via-white/70 via-45% to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent lg:hidden" />

                {/* Soft ambient brand tints matching white aesthetic */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
                <div className="pointer-events-none absolute right-1/4 -bottom-10 h-72 w-96 rounded-full bg-amber-400/5 blur-3xl" />
              </div>

              {/* Foreground Content Layer */}
              <div className="relative z-10 mx-auto flex h-full max-w-[1720px] flex-col justify-center px-4 py-8 sm:px-8 md:px-12 lg:px-16">
                <div className="max-w-xl">
                  {/* Eyebrow Badge */}
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-bold text-slate-800 backdrop-blur-md shadow-xs">
                    {slide.primaryHref.includes("verify") ? (
                      <ShieldCheck size={15} className="text-[#e50914] stroke-[2.5]" />
                    ) : (
                      <BadgeCheck size={15} className="text-[#d97706] stroke-[2.5]" />
                    )}
                    <span>{slide.eyebrow}</span>
                  </div>

                  {/* Slide Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-[35px] font-black leading-tight tracking-tight text-slate-950">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-2.5 max-w-lg text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                    {slide.description}
                  </p>

                  {/* Chassis Search Form (Slide 1) */}
                  {slide.showChassisForm ? (
                    <form
                      onSubmit={handleChassisSubmit}
                      className="mt-4 max-w-xl rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md ring-1 ring-slate-100"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="relative flex-1">
                          <FileSearch
                            size={18}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            value={chassisNumber}
                            onChange={(event) =>
                              setChassisNumber(event.target.value)
                            }
                            placeholder="Enter chassis number e.g. NKE165-7245648"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 outline-none transition placeholder:normal-case placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:border-[#e50914] focus:bg-white focus:ring-2 focus:ring-red-100"
                          />
                        </label>
                        <button
                          type="submit"
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b80f17] px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(229,9,20,0.3)] transition-all duration-200 hover:from-[#c50812] hover:to-[#9f0d14] hover:shadow-[0_8px_20px_rgba(229,9,20,0.45)] active:scale-95 shrink-0"
                        >
                          <Search size={16} />
                          <span>Search</span>
                        </button>
                      </div>
                      <p className="mt-1.5 px-1 text-[11px] font-semibold text-slate-500">
                        Enter the full chassis number exactly as shown on the
                        vehicle documents.
                      </p>
                    </form>
                  ) : (
                    /* Action Buttons (Slides 2 & 3) */
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <Link
                        href={slide.primaryHref}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e50914] to-[#b80f17] px-6 text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(229,9,20,0.3)] transition-all duration-200 hover:from-[#c50812] hover:to-[#9f0d14] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(229,9,20,0.45)] active:translate-y-0"
                      >
                        <span>{slide.primaryLabel}</span>
                        <ArrowRight size={17} />
                      </Link>
                      <Link
                        href={slide.secondaryHref}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-800 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-950 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>{slide.secondaryLabel}</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
