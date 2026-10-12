"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import {
  Download,
  Printer,
  Camera,
  ZoomIn,
  Languages,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  FileText,
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

const EXPLANATIONS = [
  { text: "A1 : Small Scratch | A2 : Scratch | A3 : Big Scratch" },
  { text: "B1 : Small dent with scratch (size like a thumb)" },
  { text: "B2 : Dent with scratch (size like flat of the hand)" },
  { text: "B3 : Big Dent with scratch (size like elbow)" },
  { text: "C1: Corrosion | C2: Heavy Corrosion" },
  { text: "E1: Few Dimples | E2: Several Dimples" },
  { text: "E3: Many Dimples | G: Chip In Glass" },
  { text: "H: Paint faded | X: Need to be replaced" },
  { text: "P: Paint Marked | R: Repaired Crack on Windshield" },
  { text: "RX: Repaired Crack on Windshield (needs to be replaced)" },
  { text: "S1: Rust | S2: Heavy Rust" },
  { text: "U1: Small Dent | U2: Dent | U3: Big Dent" },
  { text: "X: Crack on Windshield (needs to be replaced)" },
  { text: "XX: Replaced" },
  { text: "X1: Small Crack on Windshield (approximately 1cm)" },
  { text: "W1: Repair Mark/Wave (hardly detectable )" },
  { text: "W2: Repair Mark/Wave" },
  { text: "W3: Obvious Repair Mark/Wave (needs to be repainted)" },
  { text: "Y1: Small Hole or Crack | Y2: Hole or Crack | Y3: Big Hole or Crack" },
];

export const getProxiedImageUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("/")) {
    return url;
  }
  return `/api/jpcenter/image?url=${encodeURIComponent(url)}`;
};

export const convertUrlToDataUrl = async (url?: string): Promise<string> => {
  if (!url) return "";
  if (url.startsWith("data:")) return url;

  const fetchUrl = url.startsWith("http")
    ? `/api/jpcenter/image?url=${encodeURIComponent(url)}`
    : url;

  try {
    const res = await fetch(fetchUrl);
    if (!res.ok) return "";
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Could not convert image to Data URL:", url, err);
    return "";
  }
};

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
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [isPrintingReport, setIsPrintingReport] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [sheetDataUrl, setSheetDataUrl] = useState<string>("");
  const [carPhotosDataUrls, setCarPhotosDataUrls] = useState<string[]>([]);
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");

  const reportContainerRef = useRef<HTMLDivElement>(null);

  // Generate QR Code linking to online verification report
  useEffect(() => {
    if (!chassis) return;
    const url = `https://carclickbd.com/auction-sheets?status=success&chassis=${encodeURIComponent(chassis)}`;
    QRCode.toDataURL(url, { margin: 1, width: 256 })
      .then(setQrCodeDataUrl)
      .catch((err) => console.warn("Failed to generate QR Code:", err));
  }, [chassis]);

  // Preload logo as Data URL for canvas and print
  useEffect(() => {
    convertUrlToDataUrl("/assets/logo.png")
      .then((dataUrl) => {
        if (dataUrl) setLogoDataUrl(dataUrl);
      })
      .catch(() => {});
  }, []);

  // Sync when initialReports changes
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

  // Preload auction sheet and car photos as Data URLs whenever currentReport changes
  useEffect(() => {
    let isCancelled = false;

    if (currentReport.auctionSheetImage) {
      convertUrlToDataUrl(currentReport.auctionSheetImage).then((dUrl) => {
        if (!isCancelled && dUrl) setSheetDataUrl(dUrl);
      });
    } else {
      setSheetDataUrl("");
    }

    if (currentReport.carImages && currentReport.carImages.length > 0) {
      Promise.all(
        currentReport.carImages.slice(0, 2).map((imgUrl) => convertUrlToDataUrl(imgUrl))
      ).then((urls) => {
        if (!isCancelled) setCarPhotosDataUrls(urls);
      });
    } else {
      setCarPhotosDataUrls([]);
    }

    return () => {
      isCancelled = true;
    };
  }, [currentReport.auctionSheetImage, currentReport.carImages]);

  // 1. Download PDF Handler (Preserved without modification)
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    message.loading({ content: "Preparing Official True Report PDF...", key: "pdf_dl" });

    try {
      // Direct server download
      const params = new URLSearchParams({ chassis });
      if (reportKey) params.set("key", reportKey);
      const res = await fetch(`/api/jpcenter/download?${params.toString()}`);

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 15000) {
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

      // Fallback: html2canvas + jsPDF client-side generator
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const element = reportContainerRef.current;
      if (!element) throw new Error("Report element not found");

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`True-Report-${chassis}.pdf`);
      message.success({ content: "PDF generated and downloaded!", key: "pdf_dl" });
    } catch (err: any) {
      console.error("PDF Download Error:", err);
      message.info({ content: "Opening print dialog as PDF fallback...", key: "pdf_dl" });
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // 2. Download Screenshot (Image) Handler with 100% Auction Sheet Rendering
  const handleDownloadScreenshot = async () => {
    setIsCapturingScreenshot(true);
    message.loading({ content: "Generating True Report screenshot...", key: "img_dl" });

    try {
      const element = reportContainerRef.current;
      if (!element) throw new Error("Report element not found");

      // 1. Ensure sheet data URL is ready
      let currentSheetUrl = sheetDataUrl;
      if (!currentSheetUrl && currentReport.auctionSheetImage) {
        currentSheetUrl = await convertUrlToDataUrl(currentReport.auctionSheetImage);
        if (currentSheetUrl) setSheetDataUrl(currentSheetUrl);
      }

      // 2. Ensure car photos data URLs are ready
      let currentPhotos = [...carPhotosDataUrls];
      if (currentReport.carImages && currentReport.carImages.length > 0) {
        const loadedPhotos = await Promise.all(
          currentReport.carImages.slice(0, 2).map((img, i) =>
            currentPhotos[i] ? Promise.resolve(currentPhotos[i]) : convertUrlToDataUrl(img)
          )
        );
        currentPhotos = loadedPhotos;
      }

      // 3. Wait for all <img> elements inside reportContainerRef to be loaded and decoded
      const imgElements = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        imgElements.map(async (img) => {
          if (!img.complete) {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          if ("decode" in img) {
            try {
              await img.decode();
            } catch {}
          }
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 80));

      const { default: html2canvas } = await import("html2canvas");

      const canvas = await html2canvas(element, {
        scale: 3, // Ultra-high resolution crisp quality
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          // Guarantee that in cloned DOM, the auction sheet and car photos have data URLs
          const clonedSheet = clonedDoc.getElementById("true-report-auction-sheet-img") as HTMLImageElement | null;
          if (clonedSheet && currentSheetUrl) {
            clonedSheet.src = currentSheetUrl;
          }
          const clonedPhoto0 = clonedDoc.getElementById("true-report-car-photo-0") as HTMLImageElement | null;
          if (clonedPhoto0 && currentPhotos[0]) {
            clonedPhoto0.src = currentPhotos[0];
          }
          const clonedPhoto1 = clonedDoc.getElementById("true-report-car-photo-1") as HTMLImageElement | null;
          if (clonedPhoto1 && currentPhotos[1]) {
            clonedPhoto1.src = currentPhotos[1];
          }
          if (logoDataUrl) {
            const clonedLogo = clonedDoc.getElementById("true-report-logo-img") as HTMLImageElement | null;
            if (clonedLogo) clonedLogo.src = logoDataUrl;
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `True-Report-${chassis}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success({ content: "Screenshot image downloaded successfully!", key: "img_dl" });
    } catch (err: any) {
      console.error("Screenshot Download Error:", err);
      message.error({ content: "Could not generate screenshot image", key: "img_dl" });
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  // 3. Print Handler (Isolated 1-Page A4 True Report with Auction Sheet)
  const handlePrint = async () => {
    setIsPrintingReport(true);
    message.loading({ content: "Preparing report for print...", key: "print_prep", duration: 1.5 });

    const element = reportContainerRef.current;
    if (!element) {
      window.print();
      setIsPrintingReport(false);
      return;
    }

    try {
      // 1. Ensure sheet data URL is ready
      let currentSheetUrl = sheetDataUrl;
      if (!currentSheetUrl && currentReport.auctionSheetImage) {
        currentSheetUrl = await convertUrlToDataUrl(currentReport.auctionSheetImage);
        if (currentSheetUrl) setSheetDataUrl(currentSheetUrl);
      }

      // 2. Ensure car photos data URLs are ready
      let currentPhotos = [...carPhotosDataUrls];
      if (currentReport.carImages && currentReport.carImages.length > 0) {
        const loadedPhotos = await Promise.all(
          currentReport.carImages.slice(0, 2).map((img, i) =>
            currentPhotos[i] ? Promise.resolve(currentPhotos[i]) : convertUrlToDataUrl(img)
          )
        );
        currentPhotos = loadedPhotos;
      }

      // 3. Wait for images to decode
      const imgElements = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        imgElements.map(async (img) => {
          if (!img.complete) {
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
            });
          }
          if ("decode" in img) {
            try {
              await img.decode();
            } catch {}
          }
        })
      );

      // 4. Create isolated print iframe
      const printFrame = document.createElement("iframe");
      printFrame.setAttribute("id", "true-report-print-frame");
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
      printFrame.style.visibility = "hidden";
      document.body.appendChild(printFrame);

      const frameDoc = printFrame.contentWindow?.document;
      if (!frameDoc) {
        window.print();
        setIsPrintingReport(false);
        return;
      }

      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>True Report - ${chassis}</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              @page {
                size: A4 portrait;
                margin: 5mm 6mm;
              }
              * {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                width: 100% !important;
              }
              #true-report-sheet {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 auto !important;
                padding: 4mm 6mm !important;
                box-shadow: none !important;
                border: none !important;
                background: #ffffff !important;
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              #true-report-auction-sheet-img {
                max-height: 400px !important;
                width: auto !important;
                height: auto !important;
                max-width: 100% !important;
                object-fit: contain !important;
                display: block !important;
                margin: 0 auto !important;
              }
              img {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
          </head>
          <body>
            <div id="print-root"></div>
          </body>
        </html>
      `);

      // Copy all style sheets and style elements from head
      document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
        try {
          frameDoc.head.appendChild(node.cloneNode(true));
        } catch {}
      });

      // Clone report element and attach into iframe
      const clonedNode = element.cloneNode(true) as HTMLElement;
      clonedNode.style.boxShadow = "none";
      clonedNode.style.border = "none";
      clonedNode.style.maxWidth = "100%";
      clonedNode.style.margin = "0 auto";

      if (currentSheetUrl) {
        const clonedSheet = clonedNode.querySelector("#true-report-auction-sheet-img") as HTMLImageElement | null;
        if (clonedSheet) clonedSheet.src = currentSheetUrl;
      }
      if (currentPhotos[0]) {
        const clonedPhoto0 = clonedNode.querySelector("#true-report-car-photo-0") as HTMLImageElement | null;
        if (clonedPhoto0) clonedPhoto0.src = currentPhotos[0];
      }
      if (currentPhotos[1]) {
        const clonedPhoto1 = clonedNode.querySelector("#true-report-car-photo-1") as HTMLImageElement | null;
        if (clonedPhoto1) clonedPhoto1.src = currentPhotos[1];
      }
      if (logoDataUrl) {
        const clonedLogo = clonedNode.querySelector("#true-report-logo-img") as HTMLImageElement | null;
        if (clonedLogo) clonedLogo.src = logoDataUrl;
      }

      frameDoc.getElementById("print-root")?.appendChild(clonedNode);
      frameDoc.close();

      // Wait for images inside iframe
      const iframeImgs = Array.from(frameDoc.querySelectorAll("img"));
      await Promise.all(
        iframeImgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setIsPrintingReport(false);

        setTimeout(() => {
          try {
            document.body.removeChild(printFrame);
          } catch {}
        }, 3000);
      }, 350);
    } catch (err) {
      console.error("Print Error:", err);
      window.print();
      setIsPrintingReport(false);
    }
  };

  const specRows = [
    { label: "Auction", value: currentReport.auction || "N/A" },
    { label: "Auction date", value: currentReport.auctionDate || "N/A" },
    { label: "Lot number", value: currentReport.lotNumber || "N/A" },
    { label: "Frame", value: currentReport.chassisId || currentReport.chassis || chassis },
    { label: "Vendor", value: currentReport.brand || currentReport.vendor || "TOYOTA" },
    { label: "Model", value: currentReport.model || "N/A" },
    { label: "Mileage", value: currentReport.mileage || "N/A" },
    {
      label: "Displacement",
      value: currentReport.engineCc
        ? `${currentReport.engineCc}`.includes("cc")
          ? currentReport.engineCc
          : `${currentReport.engineCc}`
        : "N/A",
    },
    { label: "Year", value: currentReport.year || "N/A" },
    { label: "Grade", value: currentReport.grade || "N/A" },
    { label: "Equipment", value: currentReport.equipment || "AAC" },
    { label: "Transmission", value: currentReport.transmission || "N/A" },
    { label: "Color", value: currentReport.color || "N/A" },
    { label: "Score", value: currentReport.condition || "N/A" },
    { label: "Status", value: (currentReport.status || "SOLD").toUpperCase() },
    { label: "Powered By", value: "CARCLICK BD", isBrand: true },
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
          Retrieving authentic Japanese auction inspection sheet, vehicle photos, and verified inspection data for Chassis {chassis}
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

        <div className="flex flex-wrap items-center gap-2.5">
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

          {/* Download Official PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f5bd05] px-4 py-2.5 text-xs font-black text-slate-950 shadow-md transition hover:bg-[#dfaa00] hover:shadow-lg disabled:opacity-50"
          >
            {isDownloadingPdf ? <Spin size="small" /> : <Download size={16} />}
            Download Official PDF
          </button>

          {/* Download Screenshot / Image */}
          <button
            onClick={handleDownloadScreenshot}
            disabled={isCapturingScreenshot}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-4 py-2.5 text-xs font-black text-white shadow-md transition hover:bg-[#002675] hover:shadow-lg disabled:opacity-50"
          >
            {isCapturingScreenshot ? <Spin size="small" /> : <Camera size={16} />}
            স্ক্রিনশট ডাউনলোড
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            disabled={isPrintingReport}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            {isPrintingReport ? <Spin size="small" /> : <Printer size={16} />}
            Print
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXACT 1-PAGE TRUE REPORT CONTAINER (MATCHING USER SAMPLE PDF) */}
      {/* ============================================================== */}
      <div className="flex justify-center overflow-x-auto py-2">
        <div
          ref={reportContainerRef}
          id="true-report-sheet"
          className="w-full max-w-[850px] bg-white p-6 sm:p-8 border border-slate-300 shadow-2xl rounded-lg text-slate-900 select-text print:border-none print:shadow-none print:p-4 print:max-w-none"
          style={{ minHeight: "1150px" }}
        >
          {/* 1. TOP HEADER */}
          <div className="flex items-center justify-between pb-3">
            {/* Left: CarClick BD Logo */}
            <div className="relative h-12 w-48 sm:h-14 sm:w-56 shrink-0">
              <img
                id="true-report-logo-img"
                src={logoDataUrl || "/assets/logo.png"}
                crossOrigin="anonymous"
                loading="eager"
                decoding="sync"
                alt="CarClick BD"
                className="h-full w-full object-contain object-left"
              />
            </div>

            {/* Right: Red Serif Title */}
            <div className="text-right">
              <h1
                className="font-serif italic font-extrabold tracking-tight text-[#c00000]"
                style={{ fontSize: "1.45rem" }}
              >
                True Report of {chassis}
              </h1>
            </div>
          </div>

          {/* 2. THREE-COLUMN MAIN GRID */}
          <div className="grid grid-cols-12 gap-3.5 pt-2">
            {/* COLUMN 1: LEFT SPECIFICATIONS TABLE (3.5 cols) */}
            <div className="col-span-12 sm:col-span-4 print:col-span-4 flex flex-col">
              {/* Amber Box Header */}
              <div className="bg-[#b26610] text-white text-center py-2 px-1 rounded-t shadow-sm">
                <h2 className="font-serif font-bold text-base tracking-wider uppercase">
                  TRUE REPORT
                </h2>
                <p className="font-sans font-bold text-xs tracking-wide text-amber-100">
                  {chassis}
                </p>
              </div>

              {/* Specs Table Rows */}
              <div className="border border-slate-200 border-t-0 rounded-b overflow-hidden shadow-xs divide-y divide-slate-200 text-[11px]">
                {specRows.map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-2.5 py-1.5 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                    }`}
                  >
                    <span className="font-medium text-slate-600">{row.label}</span>
                    <span
                      className={`font-bold ${
                        row.isBrand
                          ? "text-[#c00000] font-black tracking-wide"
                          : row.label === "Status" && row.value.toLowerCase() === "sold"
                          ? "text-emerald-700"
                          : "text-slate-900"
                      }`}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: CENTER - ORIGINAL JAPANESE AUCTION SHEET (4.8 cols) */}
            <div className="col-span-12 sm:col-span-5 print:col-span-5 flex flex-col">
              <div
                onClick={() =>
                  currentReport.auctionSheetImage &&
                  setActiveModalImage(currentReport.auctionSheetImage)
                }
                className="relative flex h-full min-h-[350px] w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-slate-300 bg-white p-1 shadow-xs transition hover:border-[#003399] print:h-auto print:min-h-0 print:overflow-visible print:border-slate-300"
                title="Click to view full screen"
              >
                {currentReport.auctionSheetImage ? (
                  <img
                    id="true-report-auction-sheet-img"
                    src={sheetDataUrl || getProxiedImageUrl(currentReport.auctionSheetImage)}
                    crossOrigin="anonymous"
                    loading="eager"
                    decoding="sync"
                    alt={`Auction sheet for ${chassis}`}
                    className="h-auto max-h-[420px] w-auto max-w-full object-contain print:max-h-[390px] print:w-auto"
                    style={{
                      maxHeight: "420px",
                      maxWidth: "100%",
                      height: "auto",
                      width: "auto",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-8 text-center text-slate-400">
                    <FileText size={44} />
                    <p className="text-xs font-bold">Auction Sheet Image Processing</p>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 3: RIGHT - AUCTION SHEET EXPLANATION (3.7 cols) */}
            <div className="col-span-12 sm:col-span-3 print:col-span-3 flex flex-col">
              <div className="border-b border-slate-800 pb-1 mb-2">
                <h3 className="font-serif italic font-bold text-xs sm:text-sm text-slate-900">
                  Auction Sheet Explanation
                </h3>
              </div>

              <div className="space-y-1 text-[9.5px] leading-tight text-slate-800">
                {EXPLANATIONS.map((item, idx) => {
                  if (item.text.includes("|")) {
                    const parts = item.text.split("|");
                    return (
                      <p key={idx} className="leading-tight">
                        {parts.map((p, pIdx) => {
                          const seg = p.trim();
                          const colonIdx = seg.indexOf(":");
                          return (
                            <React.Fragment key={pIdx}>
                              {colonIdx !== -1 ? (
                                <>
                                  <strong className="text-[#c00000]">
                                    {seg.substring(0, colonIdx + 1)}
                                  </strong>
                                  <span>{seg.substring(colonIdx + 1)}</span>
                                </>
                              ) : (
                                <span>{seg}</span>
                              )}
                              {pIdx < parts.length - 1 && (
                                <span className="text-slate-400 font-normal"> | </span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </p>
                    );
                  }

                  const colonIdx = item.text.indexOf(":");
                  return (
                    <p key={idx} className="leading-tight">
                      {colonIdx !== -1 ? (
                        <>
                          <strong className="text-[#c00000]">
                            {item.text.substring(0, colonIdx + 1)}
                          </strong>
                          <span>{item.text.substring(colonIdx + 1)}</span>
                        </>
                      ) : (
                        <span>{item.text}</span>
                      )}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. BOTTOM SECTION: CAR PHOTOS & QR CODE */}
          <div className="grid grid-cols-12 gap-3.5 pt-4">
            {/* Car Photo 1 */}
            <div className="col-span-6 sm:col-span-4 print:col-span-4">
              <div
                onClick={() =>
                  currentReport.carImages?.[0] &&
                  setActiveModalImage(currentReport.carImages[0])
                }
                className="group relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-slate-300 bg-slate-50 transition hover:border-[#003399]"
              >
                {currentReport.carImages?.[0] ? (
                  <img
                    id="true-report-car-photo-0"
                    src={carPhotosDataUrls[0] || getProxiedImageUrl(currentReport.carImages[0])}
                    crossOrigin="anonymous"
                    loading="eager"
                    decoding="sync"
                    alt={`Photo 1 for ${chassis}`}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Photo 1</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100 print:hidden">
                  <ZoomIn className="text-white" size={20} />
                </div>
              </div>
            </div>

            {/* Car Photo 2 */}
            <div className="col-span-6 sm:col-span-4 print:col-span-4">
              <div
                onClick={() =>
                  currentReport.carImages?.[1] &&
                  setActiveModalImage(currentReport.carImages[1])
                }
                className="group relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-slate-300 bg-slate-50 transition hover:border-[#003399]"
              >
                {currentReport.carImages?.[1] ? (
                  <img
                    id="true-report-car-photo-1"
                    src={carPhotosDataUrls[1] || getProxiedImageUrl(currentReport.carImages[1])}
                    crossOrigin="anonymous"
                    loading="eager"
                    decoding="sync"
                    alt={`Photo 2 for ${chassis}`}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <span className="text-xs text-slate-400">Photo 2</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100 print:hidden">
                  <ZoomIn className="text-white" size={20} />
                </div>
              </div>
            </div>

            {/* Live Verification QR Code */}
            <div className="col-span-12 sm:col-span-4 print:col-span-4 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center rounded border border-slate-300 bg-white p-2 shadow-xs">
                {qrCodeDataUrl ? (
                  <img
                    id="true-report-qr-img"
                    src={qrCodeDataUrl}
                    loading="eager"
                    decoding="sync"
                    alt="Scan to verify"
                    className="h-28 w-28 object-contain"
                  />
                ) : (
                  <div className="h-28 w-28 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                    QR Code
                  </div>
                )}
                <span className="mt-1 text-[9px] font-bold text-slate-600">
                  Scan to Verify Online
                </span>
              </div>
            </div>
          </div>

          {/* 4. FOOTER (Red divider line & CarClick BD link) */}
          <div className="mt-6 pt-3 border-t-2 border-[#c00000] flex items-center justify-between text-xs">
            <p className="font-bold text-[#c00000]">
              A product by{" "}
              <a
                href="https://carclickbd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                https://carclickbd.com/
              </a>
            </p>
            <p className="font-serif italic text-slate-700">Page 1 of 1</p>
          </div>
        </div>
      </div>

      {/* Global Print Styles for Ctrl+P */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 6mm;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          header, nav, footer, aside, .print\\:hidden, #__next-route-announcer__ {
            display: none !important;
          }
          #true-report-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 4mm 6mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #true-report-auction-sheet-img {
            max-height: 400px !important;
            width: auto !important;
            height: auto !important;
            max-width: 100% !important;
            object-fit: contain !important;
            display: block !important;
            margin: 0 auto !important;
          }
        }
      `}</style>

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
                  {currentReport.brand || currentReport.vendor} {currentReport.model} &bull; Year{" "}
                  {currentReport.year} &bull; Grade {currentReport.grade}
                </p>
                <p className="text-xs text-slate-600">
                  Mileage: {currentReport.mileage || "N/A"} &bull; Transmission:{" "}
                  {currentReport.transmission || "N/A"}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Inspection Grade Evaluation:</p>
                <p className="mt-1 text-slate-600">
                  Overall Grade: <strong className="text-slate-900">{currentReport.grade || "N/A"}</strong>
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-3">
                <a
                  href={getWhatsAppUrl(
                    `Hello CarClickBD, I need dedicated Japanese auction sheet translation for chassis ${chassis}.`
                  )}
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
        </div>
      )}
    </div>
  );
};

export default TrueReportViewer;
