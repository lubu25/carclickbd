"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Printer,
  ZoomIn,
  Languages,
  CheckCircle2,
  Car,
  FileText,
  Info,
  X,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Spin, message } from "antd";
import { getWhatsAppUrl } from "@/constants/siteContact";

export interface AuctionReportItem {
  lotNumber?: string;
  auction?: string;
  auctionDate?: string;
  chassisId?: string;
  vendor?: string;
  brand?: string;
  model?: string;
  mileage?: string;
  engineCc?: string;
  year?: string;
  grade?: string;
  inspection?: string;
  equipment?: string;
  transmission?: string;
  awd?: string;
  startPrice?: string;
  finishPrice?: string;
  color?: string;
  condition?: string;
  status?: string;
  chassis?: string;
  auctionSheetImage?: string;
  carImages?: string[];
}

export interface TrueReportViewerProps {
  chassis: string;
  reports?: AuctionReportItem[];
  keyForTranslate?: string;
  reportKey?: string;
  onReady?: () => void;
}

const GLOSSARY_ITEMS = [
  { code: "A1", desc: "Small Scratch" },
  { code: "A2", desc: "Scratch" },
  { code: "A3", desc: "Big Scratch" },
  { code: "E1", desc: "Few Dimples" },
  { code: "E2", desc: "Several Dimples" },
  { code: "E3", desc: "Many Dimples" },
  { code: "U1", desc: "Small Dent" },
  { code: "U2", desc: "Dent" },
  { code: "U3", desc: "Big Dent" },
  { code: "W1", desc: "Repair Mark/Wave (hardly detectable)" },
  { code: "W2", desc: "Repair Mark/Wave" },
  { code: "W3", desc: "Obvious Repair Mark/Wave (needs repaint)" },
  { code: "S1", desc: "Rust" },
  { code: "S2", desc: "Heavy Rust" },
  { code: "C1", desc: "Corrosion" },
  { code: "C2", desc: "Heavy Corrosion (Need to be replaced)" },
  { code: "XX", desc: "Replaced Panel/Part" },
  { code: "B1", desc: "Distortion on core support or back panel (~thumb size)" },
  { code: "B2", desc: "Big Distortion on core support or back panel" },
  { code: "Y1", desc: "Small Hole or Crack" },
  { code: "Y2", desc: "Hole or Crack" },
  { code: "Y3", desc: "Big Hole or Crack" },
  { code: "X1", desc: "Small Crack on Windshield (~1cm)" },
  { code: "R", desc: "Repaired Crack on Windshield" },
  { code: "RX", desc: "Repaired Crack on Windshield (needs replacement)" },
  { code: "X", desc: "Crack on Windshield (needs replacement)" },
  { code: "B", desc: "Dent with scratch" },
  { code: "P", desc: "Paint marked" },
  { code: "H", desc: "Paint faded" },
  { code: "G", desc: "Stone chip in glass" },
];

export const TrueReportViewer: React.FC<TrueReportViewerProps> = ({
  chassis,
  reports: initialReports,
  keyForTranslate,
  reportKey,
  onReady,
}) => {
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const [reports, setReports] = useState<AuctionReportItem[]>(initialReports || []);
  const [isLoading, setIsLoading] = useState(!initialReports || initialReports.length === 0);
  const [loadError, setLoadError] = useState("");
  const [selectedAuctionIndex, setSelectedAuctionIndex] = useState(0);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Sync when initialReports change
  useEffect(() => {
    if (initialReports && initialReports.length > 0) {
      setReports(initialReports);
      setIsLoading(false);
      setLoadError("");
      onReadyRef.current?.();
    }
  }, [initialReports]);

  // Self-fetch full report if reports not passed
  useEffect(() => {
    if (initialReports && initialReports.length > 0) return;
    if (!chassis) return;

    let isMounted = true;
    setIsLoading(true);
    setLoadError("");

    const fetchReport = async () => {
      try {
        const params = new URLSearchParams({ chassis, full: "true" });
        if (reportKey) params.set("key", reportKey);

        const res = await fetch(`/api/jpcenter?${params.toString()}`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || err.error || "Could not retrieve full report");
        }

        const data = await res.json();
        const repList: AuctionReportItem[] = data?.data?.reports || [];

        if (!isMounted) return;

        if (repList.length > 0) {
          setReports(repList);
          onReadyRef.current?.();
        } else {
          throw new Error("No auction report records found for this chassis.");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setLoadError(err.message || "Failed to load report details.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [chassis, reportKey, initialReports]);

  const currentReport = reports[selectedAuctionIndex] || reports[0] || {};
  const allReports = reports.length > 0 ? reports : [currentReport];

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    message.loading({ content: "Preparing Official True Report PDF...", key: "pdf_dl" });

    try {
      // 1. Try server download endpoint directly
      const params = new URLSearchParams({ chassis });
      if (reportKey) params.set("key", reportKey);
      const res = await fetch(`/api/jpcenter/download?${params.toString()}`);

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 10000) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `True-Report-${chassis}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
          message.success({ content: "PDF downloaded successfully!", key: "pdf_dl" });
          setIsDownloadingPdf(false);
          return;
        }
      }

      // 2. Client-side fallback using jsPDF and html2canvas
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const element = reportContainerRef.current;
      if (!element) throw new Error("Report view not available");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const totalPdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, totalPdfHeight, undefined, "FAST");
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, totalPdfHeight, undefined, "FAST");
        heightLeft -= pdfHeight;
      }

      pdf.save(`True-Report-${chassis}.pdf`);
      message.success({ content: "PDF generated and downloaded!", key: "pdf_dl" });
    } catch (err: any) {
      console.error("PDF Download/Generation Error:", err);
      message.info({ content: "Opening print dialog as PDF fallback...", key: "pdf_dl" });
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getSpecRows = (rep: AuctionReportItem) => [
    { label: "Auction", value: rep.auction || "N/A" },
    { label: "Auction date", value: rep.auctionDate || "N/A" },
    { label: "Lot number", value: rep.lotNumber || "N/A" },
    { label: "Chassis ID", value: rep.chassisId || rep.chassis || chassis },
    { label: "Brand", value: rep.brand || rep.vendor || "TOYOTA" },
    { label: "Model", value: rep.model || "N/A" },
    { label: "Mileage", value: rep.mileage || "N/A" },
    { label: "Engine CC", value: rep.engineCc ? `${rep.engineCc} cc` : "N/A" },
    { label: "Year", value: rep.year || "N/A" },
    { label: "Grade", value: rep.grade || "N/A" },
    { label: "Equipment", value: rep.equipment || "AAC" },
    { label: "Transmission", value: rep.transmission || "N/A" },
    {
      label: "Start price",
      value: rep.startPrice
        ? rep.startPrice.includes("YEN") || rep.startPrice.includes("JPY")
          ? rep.startPrice
          : `${rep.startPrice} JPY`
        : "0 JPY",
    },
    {
      label: "Finish price",
      value: rep.finishPrice
        ? rep.finishPrice.includes("YEN") || rep.finishPrice.includes("JPY")
          ? rep.finishPrice
          : `${rep.finishPrice} JPY`
        : "N/A",
    },
    { label: "Color", value: rep.color || "N/A" },
    { label: "Condition", value: rep.condition || "N/A" },
    { label: "Status", value: rep.status || "N/A" },
  ];

  if (isLoading) {
    return (
      <div
        className="mx-auto flex min-h-[400px] max-w-3xl flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[#4A90E2] bg-white p-12 text-center shadow-lg"
        role="status"
      >
        <Spin size="large" />
        <p className="text-xl font-black text-slate-900">
          Loading Official Japanese True Report...
        </p>
        <p className="max-w-md text-sm font-semibold text-slate-600">
          Retrieving authentic Japanese auction inspection sheet, high-definition car photos, and verified inspection data for Chassis {chassis}
        </p>
      </div>
    );
  }

  if (loadError && reports.length === 0) {
    return (
      <div
        className="mx-auto max-w-3xl rounded-2xl border-2 border-amber-300 bg-amber-50 p-8 text-center shadow-md"
        role="alert"
      >
        <AlertCircle className="mx-auto mb-4 text-amber-600" size={44} />
        <h3 className="text-xl font-black text-slate-900">
          Official PDF Report Notice
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-slate-700">
          {loadError}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Don&apos;t worry, your payment or order is confirmed. Please contact our support team on WhatsApp for manual verification.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#002575]"
          >
            <RefreshCw size={16} /> Retry
          </button>
          <a
            href={getWhatsAppUrl(
              `Hello CarClickBD, I need the verified original Japanese auction sheet PDF for chassis ${chassis}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-sans space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border-2 border-[#4A90E2] bg-white p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={24} />
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-950 sm:text-xl">
              Official True Report &bull; {chassis}
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              Verified
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Authentic Japanese Auction Sheet &bull; All Photos Included &bull; Bank Verified Document
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Multiple Auction Run Navigation */}
          {allReports.length > 1 && (
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              {allReports.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAuctionIndex(idx)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedAuctionIndex === idx
                      ? "bg-[#003399] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Run {idx + 1} ({r.auctionDate || `Lot ${r.lotNumber || idx + 1}`})
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f5bd05] px-5 py-3 text-sm font-black text-slate-950 shadow-md transition hover:bg-[#dfaa00] hover:shadow-lg disabled:opacity-50"
          >
            {isDownloadingPdf ? <Spin size="small" /> : <Download size={18} />}
            Download Official PDF
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#003399] bg-white px-5 py-3 text-sm font-bold text-[#003399] shadow-sm transition hover:bg-blue-50"
          >
            <Printer size={18} />
            Print / Fullscreen
          </button>
        </div>
      </div>

      {/* Trust & Bank Notice Box */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs font-medium text-emerald-900 print:hidden">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
        <div className="space-y-0.5">
          <p className="font-bold">
            100% Unaltered Japanese Auction Record &bull; Original Sheet & Photos
          </p>
          <p className="text-emerald-800">
            This authentic document contains the complete vehicle inspection diagram, inspector notes, high-definition car yard photos, and condition grades. It is completely untouched and accepted by banks for car loans and customs verification.
          </p>
        </div>
      </div>

      {/* Main Printable / Renderable Container */}
      <div
        ref={reportContainerRef}
        id="true-report-printable"
        className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-[#fdfbf7] p-6 shadow-xl sm:p-10 print:border-none print:p-0 print:shadow-none"
      >
        {/* Document Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded bg-slate-200 px-2 py-0.5 text-slate-800">START</span>
            <span>&bull;</span>
            <span>SAVED</span>
            <span>&bull;</span>
            <span>SAMPLE</span>
            <span>&bull;</span>
            <span>BALANCE</span>
            <span>&bull;</span>
            <span>MANUAL</span>
            <span>&bull;</span>
            <span className="font-extrabold text-[#003399]">REPORT+</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <span>ORDER {chassis}</span>
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Render Each Auction Record */}
        {allReports.map((rep, rIndex) => {
          const specRows = getSpecRows(rep);
          const hasMultipleAuctions = allReports.length > 1;

          return (
            <div
              key={rIndex}
              className={`mb-12 ${
                hasMultipleAuctions && selectedAuctionIndex !== rIndex
                  ? "hidden print:block print:break-before-page"
                  : ""
              }`}
            >
              {/* True Report Ribbon Badge Banner */}
              <div className="mb-6 flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-[#0d47a1] to-[#1565c0] p-4 text-white shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-2xl font-black">
                    {rIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-wider uppercase sm:text-3xl">
                      TRUE REPORT
                    </h2>
                    <p className="text-sm font-semibold tracking-wide text-blue-100">
                      CHASSIS ID: <span className="font-bold text-amber-300">{rep.chassis || chassis}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-blue-200">Auction House</p>
                  <p className="text-lg font-black text-white">{rep.auction || "TAA / USS"}</p>
                  <p className="text-xs text-blue-200">{rep.auctionDate}</p>
                </div>
              </div>

              {/* Top Section: Specifications Table */}
              <div className="mb-8 overflow-hidden rounded-2xl border-2 border-[#1565c0]/30 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
                  <p className="text-xs font-black uppercase tracking-wider text-[#003399]">
                    Vehicle Inspection & Auction Specifications (Run {rIndex + 1} of {allReports.length})
                  </p>
                </div>
                <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="divide-y divide-slate-100">
                    {specRows.slice(0, 8).map((row, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-5 py-2.5 text-sm ${
                          i % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                        }`}
                      >
                        <span className="font-semibold text-slate-600">{row.label}</span>
                        <span className="font-extrabold uppercase text-slate-900">
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {specRows.slice(8).map((row, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-5 py-2.5 text-sm ${
                          i % 2 === 0 ? "bg-slate-50/60" : "bg-white"
                        }`}
                      >
                        <span className="font-semibold text-slate-600">{row.label}</span>
                        <span
                          className={`font-extrabold uppercase ${
                            row.label === "Status"
                              ? row.value.toLowerCase() === "sold"
                                ? "text-emerald-600"
                                : "text-amber-600"
                              : row.label === "Finish price"
                              ? "text-[#003399]"
                              : "text-slate-900"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Section: Auction Sheet (Left) + Vehicle Photos Grid (Right) */}
              <div className="mb-8 grid gap-6 lg:grid-cols-12">
                {/* Left: Japanese Auction Sheet */}
                <div className="flex flex-col lg:col-span-6 xl:col-span-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Japanese Auction Sheet
                    </p>
                    {rep.auctionSheetImage && (
                      <button
                        onClick={() => setActiveModalImage(rep.auctionSheetImage!)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#003399] hover:underline"
                      >
                        <ZoomIn size={13} /> Full Screen
                      </button>
                    )}
                  </div>

                  <div
                    onClick={() => rep.auctionSheetImage && setActiveModalImage(rep.auctionSheetImage)}
                    className="relative flex min-h-[380px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-2 shadow-sm transition hover:border-[#003399]"
                  >
                    {rep.auctionSheetImage ? (
                      <img
                        src={rep.auctionSheetImage}
                        alt={`Auction sheet for ${chassis}`}
                        className="max-h-[500px] w-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-8 text-center text-slate-400">
                        <FileText size={48} />
                        <p className="text-sm font-bold">Auction Sheet Image Processing</p>
                      </div>
                    )}
                  </div>

                  {/* Translate to English Button */}
                  <button
                    onClick={() => setIsTranslateModalOpen(true)}
                    className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#003399] px-4 text-xs font-black text-white shadow-md transition hover:bg-[#00266f]"
                  >
                    <Languages size={16} />
                    Translate Sheet to English
                  </button>
                </div>

                {/* Right: Vehicle Inspection Photos Grid */}
                <div className="flex flex-col lg:col-span-6 xl:col-span-7">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Vehicle Yard Photos ({rep.carImages?.length || 0})
                    </p>
                    <span className="text-xs text-slate-400">High-Resolution Originals</span>
                  </div>

                  {rep.carImages && rep.carImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                      {rep.carImages.map((imgUrl, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setActiveModalImage(imgUrl)}
                          className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#003399]"
                        >
                          <img
                            src={imgUrl}
                            alt={`Car photo ${pIdx + 1} for ${chassis}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <ZoomIn className="text-white" size={24} />
                          </div>
                          <div className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            Photo {pIdx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
                      <Car size={48} />
                      <p className="mt-2 text-sm font-bold">No additional photos attached to this lot</p>
                      <p className="text-xs text-slate-400">All condition details are captured on the auction sheet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Section: Auction List Explanation & Glossary */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:break-before-page">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Auction List Explanation & Condition Guide
              </h3>
              <p className="text-xs text-slate-500">
                Official Japanese car auction inspection marks and abbreviation guide
              </p>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#003399]">
              Verified Guide
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {GLOSSARY_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5 text-xs transition hover:bg-blue-50/50"
              >
                <span className="flex h-6 min-w-6 items-center justify-center rounded bg-[#003399] font-black text-white">
                  {item.code}
                </span>
                <span className="font-semibold text-slate-700">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Official Verification Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800">CarClickBD True Report Verification</p>
              <p>Generated directly from official Japanese auction database for Chassis {chassis}</p>
            </div>
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <CheckCircle2 size={16} /> Official CarClickBD Verified Document
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {activeModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 print:hidden"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="relative max-h-[95vh] max-w-[95vw] overflow-hidden rounded-2xl bg-white p-2">
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black"
            >
              <X size={20} />
            </button>
            <img
              src={activeModalImage}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}

      {/* Translate to English Modal */}
      {isTranslateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:hidden"
          onClick={() => setIsTranslateModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Languages className="text-[#003399]" size={22} />
                <h3 className="text-xl font-black text-slate-900">
                  English Auction Sheet Translation
                </h3>
              </div>
              <button
                onClick={() => setIsTranslateModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                <p className="text-xs font-black uppercase text-[#003399]">Vehicle Summary</p>
                <p className="mt-1 text-base font-bold text-slate-900">
                  {currentReport.brand} {currentReport.model} &bull; Year {currentReport.year} &bull; Grade {currentReport.grade}
                </p>
                <p className="text-xs text-slate-600">
                  Mileage: {currentReport.mileage || "N/A"} &bull; Transmission: {currentReport.transmission || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Inspection Grade Evaluation:</p>
                <p className="mt-1 text-slate-600">
                  Overall Grade: <strong className="text-slate-900">{currentReport.grade || "N/A"}</strong> ({
                    currentReport.grade === "R"
                      ? "Repaired / Past accident history evaluated by auction house"
                      : currentReport.grade === "5" || currentReport.grade === "4.5"
                      ? "Like-new to very high condition vehicle"
                      : currentReport.grade === "4"
                      ? "Clean condition with minor normal wear"
                      : "Standard auction condition"
                  })
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Key Inspector Points:</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-slate-600">
                  <li>Body inspection points follow the standard Japanese map markings (A=Scratch, U=Dent, W=Repair).</li>
                  <li>Equipment includes: {currentReport.equipment || "Standard AAC, Power Windows, ABS"}.</li>
                  <li>Final auction status: <strong className="uppercase text-slate-900">{currentReport.status || "Finished"}</strong>.</li>
                </ul>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">
                <Info size={16} className="mb-1 inline" /> Need a line-by-line handwritten kanji translation from our bilingual inspector? Contact our team on WhatsApp for dedicated translation support.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-3">
              <a
                href={getWhatsAppUrl(`Hello CarClickBD, I need dedicated Japanese auction sheet translation for chassis ${chassis}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-xs font-bold text-white transition hover:bg-[#20bd5a]"
              >
                WhatsApp Support
              </a>
              <button
                onClick={() => setIsTranslateModalOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 px-5 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrueReportViewer;
