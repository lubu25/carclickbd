"use client";
import React from "react";
import Link from "next/link";
import CarFilters from "@/components/publiclayout/home/AcutionProducts/CarFilters";
import ProductsResult from "@/components/publiclayout/home/AcutionProducts/ProductsResult";
import { AuctionProductsProps } from "@/types/products.types";


const AuctionProducts = ({
  isPaginate = true,
  isShowAll,
  isWinner, 
  isDraft,
  isFeatured
}:AuctionProductsProps) => {
  const isHomePreview = !isPaginate;

  return (
    <section
      className={
        isHomePreview
          ? "bg-white py-14 md:py-16"
          : "lg:my-6 lg:px-6"
      }
    >
      {isHomePreview ? (
        <div className="mx-auto mb-8 flex max-w-7xl flex-col gap-4 px-4 md:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xl font-black uppercase tracking-[0.16em] text-slate-950 md:text-2xl">
              Featured Inventory
            </p>
            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500">
              Verified listings with clear photos, specs, prices, and direct
              detail pages.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#e50914] bg-[#e50914] px-5 text-sm font-bold text-white shadow-sm transition hover:border-[#b80f17] hover:bg-[#b80f17]"
          >
            View All Cars
          </Link>
        </div>
      ) : null}
      <div className={isHomePreview ? "mx-auto max-w-7xl px-4 md:px-8" : ""}>
        {!isHomePreview && <CarFilters />}
        <ProductsResult
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          isPaginate={isPaginate}
          isShowAll={isShowAll}
          isWinner={isWinner}
          isDraft={isDraft}
          isFeatured={isFeatured}
        />
      </div>
    </section>
  );
};

export default AuctionProducts;
