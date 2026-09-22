"use client";

import { useState } from "react";
import Image from "next/image";
import { FileSearch, Search, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import AuctionSheetVerification from "@/components/publiclayout/home/AuctionSheetVerification";
import { useLazyGetAuctionSheetReportQuery } from "@/Redux/api/auctionSheetApi";

const VerifyAuctionSheetPage = () => {
  const router = useRouter();
  const [chassisNo, setChassisNo] = useState("");
  const [searchError, setSearchError] = useState("");
  const [checkChassis, { isFetching: isCheckingChassis }] =
    useLazyGetAuctionSheetReportQuery();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chassis = chassisNo.trim();
    setSearchError("");

    if (!chassis) {
      setSearchError("Please enter a chassis number.");
      return;
    }

    try {
      const response = await checkChassis(chassis).unwrap();
      const lookup = response?.data?.data || response?.data;

      if (!lookup?.found) {
        setSearchError(
          "এই chassis number-এর কোনো auction record পাওয়া যায়নি। সঠিক chassis number দিয়ে আবার চেষ্টা করুন.",
        );
        return;
      }

      router.push(`/auction-sheets?chassis=${encodeURIComponent(chassis)}`);
    } catch (error: any) {
      setSearchError(
        error?.data?.message ||
          error?.message ||
          "Chassis number যাচাই করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন.",
      );
    }
  };

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-4 py-14 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f0b90b]/40 bg-[#fff7d6] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#003399]">
              <ShieldCheck size={15} />
              Japanese Auction Sheet Check
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.04] text-slate-950 md:text-6xl">
              Verify Japanese Auction Sheets Before You Buy
            </h1>

            <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              Search by chassis number to request verification of available
              Japanese auction records, including production year, mileage,
              auction grade, and condition notes.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-[#003399]/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
              <div className="relative h-64 bg-slate-900 md:h-80">
                <Image
                  src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop"
                  alt="Japanese car auction verification"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#003399]">
                    Chassis Verification
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-slate-950">
                    Enter Chassis Number
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-3">
                  <label className="relative">
                    <FileSearch
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#003399]"
                    />
                    <input
                      value={chassisNo}
                      onChange={(event) => {
                        setChassisNo(event.target.value);
                        if (searchError) setSearchError("");
                      }}
                      placeholder="e.g. NKE165-7245648"
                      className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm font-semibold uppercase tracking-wide text-slate-800 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-[#003399] focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isCheckingChassis}
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#e50914] px-8 text-sm font-extrabold uppercase text-white shadow-[0_14px_30px_rgba(229,9,20,0.28)] transition hover:-translate-y-0.5 hover:bg-[#b80f17]"
                  >
                    <Search size={17} />
                    {isCheckingChassis ? "Checking..." : "Search"}
                  </button>

                  {searchError && (
                    <p
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700"
                    >
                      {searchError}
                    </p>
                  )}
                </form>

                <p className="mt-4 text-xs font-medium leading-6 text-slate-500">
                  Enter the full chassis number exactly as shown on the vehicle
                  documents. Our team will review the available auction sheet
                  details after submission.
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>

      <AuctionSheetVerification />
    </main>
  );
};

export default VerifyAuctionSheetPage;
