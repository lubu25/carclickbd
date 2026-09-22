"use client";

import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { getProductStatusMeta } from "@/utils/productStatus";

const getNumericPrice = (product: any) => {
  const value =
    product?.mainPrice ||
    product?.price ||
    product?.fixedPrice ||
    product?.highestBid ||
    product?.minBid ||
    0;
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatBdt = (value: number) =>
  `BDT ${Math.max(0, Math.round(value)).toLocaleString("en-US")}/-`;

export default function SaleInformation({ product }: { product: any }) {
  const statusMeta = getProductStatusMeta(product);
  const price = getNumericPrice(product);
  const referenceNumber =
    product?.stockNumber || product?.referenceNumber || product?._id?.slice(-8)?.toUpperCase();
  const rows = [
    ["Price", formatBdt(price)],
    ["Listing status", statusMeta.label],
    ["Seller type", product?.sellerType || "Verified dealer"],
    ["Reference No", referenceNumber],
  ].filter(([, value]) => value);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
        Purchase overview
      </p>

      <div className="mt-5 space-y-3">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 text-sm"
          >
            <span className="font-medium text-slate-500">{label}</span>
            <span className="font-bold text-slate-900">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 text-sm">
        <div className="flex gap-3 rounded-md bg-emerald-50 p-3 text-emerald-800">
          <BadgeCheck className="mt-0.5 shrink-0" size={18} />
          <span className="font-semibold">Verified listing information</span>
        </div>
        <div className="flex gap-3 rounded-md bg-sky-50 p-3 text-sky-800">
          <ShieldCheck className="mt-0.5 shrink-0" size={18} />
          <span className="font-semibold">Inspection support available</span>
        </div>
        <div className="flex gap-3 rounded-md bg-slate-50 p-3 text-slate-700">
          <Clock3 className="mt-0.5 shrink-0" size={18} />
          <span className="font-semibold">Fast response from CarClickBD team</span>
        </div>
      </div>
    </section>
  );
}
