"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getProductStatusMeta } from "@/utils/productStatus";
import { IProduct } from "@/Interface/product";
import { getMediaUrl } from "@/utils/media";

interface GalleryProps {
  product: Partial<IProduct> & {
    title: string;
    photos: {
      mainPhoto: string;
      others?: string[];
    };
    status?: any;
    isDraft?: boolean;
    isSoldOut?: boolean;
  };
}

export default function Gallery({ product }: GalleryProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const allPhotos: string[] = [
    product.photos?.mainPhoto,
    ...(product.photos?.others || []),
  ].filter(Boolean);

  if (!allPhotos.length) return null;

  return (
    <div className="w-full">
      {isMobile ? (
        <MobileGallery photos={allPhotos} title={product.title} product={product} />
      ) : (
        <DesktopGallery photos={allPhotos} title={product.title} product={product} />
      )}
    </div>
  );
}

function DesktopGallery({
  photos,
  title,
  product,
}: {
  photos: string[];
  title: string;
  product: GalleryProps["product"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePhoto = getMediaUrl(photos[activeIndex]);
  const statusMeta = getProductStatusMeta(product);

  const goToPhoto = (direction: "prev" | "next") => {
    setActiveIndex((current) => {
      if (direction === "prev") {
        return (current - 1 + photos.length) % photos.length;
      }
      return (current + 1) % photos.length;
    });
  };

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <div className="relative h-[340px] w-full overflow-hidden bg-slate-100 md:h-[440px] xl:h-[520px]">
        <Image
          src={activePhoto}
          alt={`${title} - photo ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/75 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 shadow-lg backdrop-blur ${statusMeta.badgeClass}`}
            style={statusMeta.badgeStyle}
          >
            {statusMeta.label}
          </span>
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={() => goToPhoto("prev")}
              className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg backdrop-blur transition hover:bg-white md:left-4 md:h-11 md:w-11"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => goToPhoto("next")}
              className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg backdrop-blur transition hover:bg-white md:right-4 md:h-11 md:w-11"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-900 shadow-lg backdrop-blur">
          <Images size={17} />
          {activeIndex + 1} / {photos.length} photos
        </div>
      </div>

      {photos.length > 1 && (
        <div className="flex gap-3 overflow-x-auto p-3">
          {photos.map((photo, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={`${photo}-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-md border transition ${
                  isActive
                    ? "border-sky-500 ring-2 ring-sky-200"
                    : "border-slate-200 opacity-80 hover:opacity-100"
                }`}
                aria-label={`Show photo ${index + 1}`}
              >
                <Image
                  src={getMediaUrl(photo)}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MobileGallery({
  photos,
  title,
  product,
}: {
  photos: string[];
  title: string;
  product: GalleryProps["product"];
}) {
  const statusMeta = getProductStatusMeta(product);
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={12}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
    >
      {photos.map((photo, idx) => (
        <SwiperSlide key={`${photo}-${idx}`}>
          <div className="relative h-72 w-full sm:h-80">
            <Image
              src={getMediaUrl(photo)}
              alt={`${title} - ${idx + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute left-4 top-4">
              <span
                className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide ring-1 shadow-lg backdrop-blur ${statusMeta.badgeClass}`}
                style={statusMeta.badgeStyle}
              >
                {statusMeta.label}
              </span>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
