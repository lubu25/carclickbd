"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  homeFilterMakers,
  homeFilterModelsByMaker,
} from "@/content/product.constant";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

const sortFilters = [
  { label: "Newly listed", value: "listed" },
  { label: "Lowest mileage", value: "lowestMileage" },
  { label: "Highest mileage", value: "highestMileage" },
];

const years = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, index) => String(new Date().getFullYear() - index),
);

const statuses = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "upcoming", label: "Upcoming" },
  { value: "approval", label: "Available" },
  { value: "reserve", label: "Reserve" },
  { value: "under_negotiations", label: "Under Negotiation" },
  { value: "sold", label: "Sold" },
];

const conditions = [
  { value: "all", label: "All Conditions" },
  { value: "new", label: "New" },
  { value: "reconditioned", label: "Reconditioned" },
  { value: "local-used", label: "Local Used" },
  { value: "pre-owned", label: "Pre Owned" },
  { value: "used", label: "Used" },
];

const uniqueOptions = (options: { value: string; label: string }[]) => {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = option.value.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default function CarFilters(_props: { isWinner?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") || "";
  const [maker, setMaker] = useState(searchParams.get("make") || "all");
  const [model, setModel] = useState(searchParams.get("model") || "all");
  const [year, setYear] = useState(searchParams.get("startYear") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [condition, setCondition] = useState(
    searchParams.get("condition") || "all",
  );

  const modelOptions = useMemo(() => {
    if (maker === "all") {
      return uniqueOptions([
        { value: "all", label: "All Car Names" },
        ...Object.values(homeFilterModelsByMaker).flat(),
      ]);
    }

    return uniqueOptions([
      { value: "all", label: "All Car Names" },
      ...(homeFilterModelsByMaker[maker] || []),
    ]);
  }, [maker]);

  const updateParams = (params: URLSearchParams) => {
    router.push(`/cars?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("sort", value);
    updateParams(newSearchParams);
  };

  const handleFilterApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (maker === "all") params.delete("make");
    else params.set("make", maker);

    if (model === "all") params.delete("model");
    else params.set("model", model);

    if (year === "all") {
      params.delete("startYear");
      params.delete("endYear");
    } else {
      params.set("startYear", year);
      params.set("endYear", year);
    }

    if (status === "all") params.delete("status");
    else params.set("status", status);

    if (condition === "all") params.delete("condition");
    else params.set("condition", condition);

    updateParams(params);
  };

  const handleReset = () => {
    setMaker("all");
    setModel("all");
    setYear("all");
    setStatus("all");
    setCondition("all");
    router.push("/cars");
  };

  return (
    <div className="mx-auto mb-8 w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-950 text-white">
                <SlidersHorizontal size={14} />
              </span>
              Refine Listings
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <FilterSelect
                label="Maker"
                value={maker}
                options={homeFilterMakers}
                onChange={(value) => {
                  setMaker(value);
                  setModel("all");
                }}
              />
              <FilterSelect
                label="Car Name"
                value={model}
                options={modelOptions}
                onChange={setModel}
              />
              <FilterSelect
                label="Year"
                value={year}
                options={[
                  { value: "all", label: "All Years" },
                  ...years.map((item) => ({ value: item, label: item })),
                ]}
                onChange={setYear}
              />
              <FilterSelect
                label="Status"
                value={status}
                options={statuses}
                onChange={setStatus}
              />
              <FilterSelect
                label="Condition"
                value={condition}
                options={conditions}
                onChange={setCondition}
              />
            </div>
          </div>

          <div className="flex gap-2 xl:pb-0.5">
            <button
              type="button"
              onClick={handleFilterApply}
              className="h-11 flex-1 rounded-md bg-slate-950 px-6 text-sm font-extrabold text-white shadow-lg shadow-slate-950/10 transition hover:bg-[#e50914] xl:flex-none"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-11 flex-1 rounded-md border border-slate-200 bg-slate-50 px-5 text-sm font-extrabold text-slate-600 transition hover:border-slate-300 hover:bg-white xl:flex-none"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            <ArrowUpDown size={14} />
            Sort
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:flex">
            {sortFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleSortChange(filter.value)}
                className={`h-10 whitespace-nowrap rounded-md border px-4 text-sm font-bold transition ${
                  activeSort === filter.value
                    ? "border-[#e50914] bg-[#e50914] text-white shadow-md shadow-red-500/15"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-950"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) => {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 outline-none transition hover:bg-white focus:border-[#e50914] focus:bg-white focus:ring-2 focus:ring-red-100"
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
