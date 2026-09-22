"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";

const CarsSearchSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("searchTerm") || "");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) params.set("searchTerm", trimmedKeyword);
    else params.delete("searchTerm");

    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden rounded-b-2xl bg-slate-950">
      <Image
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop"
        alt="Car driving on an open road"
        fill
        priority
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/45" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-8 lg:py-14">
        <form
          onSubmit={handleSearch}
          className="rounded-lg border border-white/15 bg-white/95 p-5 shadow-2xl backdrop-blur md:p-6"
        >
          <div className="mb-5 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
              Search Inventory
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Find Your Next Car
            </h1>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search by car name, maker, title, or reference ID"
                className="h-12 w-full rounded-md border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-8 text-sm font-bold text-white shadow-lg transition hover:bg-sky-600"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CarsSearchSection;
