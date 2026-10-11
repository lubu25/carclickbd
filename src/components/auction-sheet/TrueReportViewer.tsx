'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Download,
  Printer,
  ZoomIn,
  Languages,
  CheckCircle2,
  Calendar,
  DollarSign,
  Gauge,
  Car,
  FileText,
  AlertTriangle,
  Info,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Spin, message } from 'antd';
import { getWhatsAppUrl } from '@/constants/siteContact';

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

interface TrueReportViewerProps {
  chassis: string;
  reports: AuctionReportItem[];
  keyForTranslate?: string;
}

const GLOSSARY_ITEMS = [
  { code: 'A1', desc: 'Small Scratch' },
  { code: 'A2', desc: 'Scratch' },
  { code: 'A3', desc: 'Big Scratch' },
  { code: 'E1', desc: 'Few Dimples' },
  { code: 'E2', desc: 'Several Dimples' },
  { code: 'E3', desc: 'Many Dimples' },
  { code: 'U1', desc: 'Small Dent' },
  { code: 'U2', desc: 'Dent' },
  { code: 'U3', desc: 'Big Dent' },
  { code: 'W1', desc: 'Repair Mark/Wave (hardly detectable)' },
  { code: 'W2', desc: 'Repair Mark/Wave' },
  { code: 'W3', desc: 'Obvious Repair Mark/Wave (needs repaint)' },
  { code: 'S1', desc: 'Rust' },
  { code: 'S2', desc: 'Heavy Rust' },
  { code: 'C1', desc: 'Corrosion' },
  { code: 'C2', desc: 'Heavy Corrosion (Need to be replaced)' },
  { code: 'XX', desc: 'Replaced Panel/Part' },
  { code: 'B1', desc: 'Distortion on core support or back panel (~thumb size)' },
  { code: 'B2', desc: 'Big Distortion on core support or back panel' },
  { code: 'Y1', desc: 'Small Hole or Crack' },
  { code: 'Y2', desc: 'Hole or Crack' },
  { code: 'Y3', desc: 'Big Hole or Crack' },
  { code: 'X1', desc: 'Small Crack on Windshield (~1cm)' },
  { code: 'R', desc: 'Repaired Crack on Windshield' },
  { code: 'RX', desc: 'Repaired Crack on Windshield (needs replacement)' },
  { code: 'X', desc: 'Crack on Windshield (needs replacement)' },
  { code: 'B', desc: 'Dent with scratch' },
  { code: 'P', desc: 'Paint marked' },
  { code: 'H', desc: 'Paint faded' },
  { code: 'G', desc: 'Stone chip in glass' },
];

export const TrueReportViewer: React.FC<TrueReportViewerProps> = ({
  chassis,
  reports = [],
}) => {
  const [selectedAuctionIndex, setSelectedAuctionIndex] = useState(0);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const currentReport = reports[selectedAuctionIndex] || reports[0] || {};
  const allReports = reports.length > 0 ? reports : [currentReport];

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    message.loading({ content: 'Generating True Report PDF...', key: 'pdf_gen' });
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const element = reportContainerRef.current;
      if (!element) throw new Error('Report element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const totalPdfHeight = (imgHeight * pdfWidth) / imgWidth;

      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalPdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`True-Report-${chassis}.pdf`);
      message.success({ content: 'PDF downloaded successfully!', key: 'pdf_gen' });
    } catch (err: any) {
      console.error('PDF Generation Error:', err);
      // Fallback: window.print()
      message.info({
        content: 'Opening print dialog as PDF fallback...',
        key: 'pdf_gen',
      });
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getSpecRows = (rep: AuctionReportItem) => [
    { label: 'Auction', value: rep.auction || 'N/A' },
    { label: 'Auction date', value: rep.auctionDate || 'N/A' },
    { label: 'Lot number', value: rep.lotNumber || 'N/A' },
    { label: 'Chassis ID', value: rep.chassisId || rep.chassis || chassis },
    { label: 'Brand', value: rep.brand || rep.vendor || 'TOYOTA' },
    { label: 'Model', value: rep.model || 'N/A' },
    { label: 'Mileage', value: rep.mileage || 'N/A' },
    { label: 'Engine CC', value: rep.engineCc ? `${rep.engineCc} cc` : 'N/A' },
    { label: 'Year', value: rep.year || 'N/A' },
    { label: 'Grade', value: rep.grade || 'N/A' },
    { label: 'Equipment', value: rep.equipment || 'AAC' },
    { label: 'Transmission', value: rep.transmission || 'N/A' },
    { label: 'Start price', value: rep.startPrice ? (rep.startPrice.includes('YEN') || rep.startPrice.includes('JPY') ? rep.startPrice : `${rep.startPrice} JPY`) : '0 JPY' },
    { label: 'Finish price', value: rep.finishPrice ? (rep.finishPrice.includes('YEN') || rep.finishPrice.includes('JPY') ? rep.finishPrice : `${rep.finishPrice} JPY`) : 'N/A' },
    { label: 'Color', value: rep.color || 'N/A' },
    { label: 'Condition', value: rep.condition || 'N/A' },
    { label: 'Status', value: rep.status || 'N/A' },
  ];

  return (
    <div className="w-full font-sans">
      {/* Top Action Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003399] text-white">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">Order</span>
              <span className="text-base font-black text-slate-900">{chassis}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Verified True Report
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {allReports.length} Auction record{allReports.length > 1 ? 's' : ''} found in database
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Auction Navigation Tabs */}
          {allReports.length > 1 && (
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              {allReports.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAuctionIndex(idx)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    selectedAuctionIndex === idx
                      ? 'bg-[#003399] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Run {idx + 1} ({r.auctionDate || `Lot ${r.lotNumber || idx + 1}`})
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#f5bd05] px-4 text-xs font-black text-slate-950 shadow-sm transition hover:bg-[#e4ad00] disabled:opacity-50"
          >
            {isGeneratingPdf ? <Spin size="small" /> : <Download size={15} />}
            Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Printer size={15} />
            Print
          </button>
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
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">PDF</span>
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
                  ? 'hidden print:block print:break-before-page'
                  : ''
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
                  <p className="text-lg font-black text-white">{rep.auction || 'TAA / USS'}</p>
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
                          i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
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
                          i % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
                        }`}
                      >
                        <span className="font-semibold text-slate-600">{row.label}</span>
                        <span
                          className={`font-extrabold uppercase ${
                            row.label === 'Status'
                              ? row.value.toLowerCase() === 'sold'
                                ? 'text-emerald-600'
                                : 'text-amber-600'
                              : row.label === 'Finish price'
                              ? 'text-[#003399]'
                              : 'text-slate-900'
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
                    TRANSLATE TO ENGLISH
                  </button>
                </div>

                {/* Right: Vehicle Photos */}
                <div className="flex flex-col lg:col-span-6 xl:col-span-7">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Vehicle Inspection Photos ({rep.carImages?.length || 0} Photos)
                    </p>
                    <span className="text-xs text-slate-400">Click any photo to zoom</span>
                  </div>

                  {rep.carImages && rep.carImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                      {rep.carImages.map((photoUrl, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => setActiveModalImage(photoUrl)}
                          className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm transition hover:shadow-md"
                        >
                          <img
                            src={photoUrl}
                            alt={`Car angle ${pIdx + 1} for ${chassis}`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                          <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white">
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

        {/* Bottom Section: Auction List Explanation & Glossary (Pages 5 & 6 of PDF) */}
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
                  Mileage: {currentReport.mileage || 'N/A'} &bull; Transmission: {currentReport.transmission || 'N/A'}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Inspection Grade Evaluation:</p>
                <p className="mt-1 text-slate-600">
                  Overall Grade: <strong className="text-slate-900">{currentReport.grade || 'N/A'}</strong> ({
                    currentReport.grade === 'R'
                      ? 'Repaired / Past accident history evaluated by auction house'
                      : currentReport.grade === '5' || currentReport.grade === '4.5'
                      ? 'Like-new to very high condition vehicle'
                      : currentReport.grade === '4'
                      ? 'Clean condition with minor normal wear'
                      : 'Standard auction condition'
                  })
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Key Inspector Points:</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-slate-600">
                  <li>Body inspection points follow the standard Japanese map markings (A=Scratch, U=Dent, W=Repair).</li>
                  <li>Equipment includes: {currentReport.equipment || 'Standard AAC, Power Windows, ABS'}.</li>
                  <li>Final auction status: <strong className="uppercase text-slate-900">{currentReport.status || 'Finished'}</strong>.</li>
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
