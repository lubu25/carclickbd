"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Download, ExternalLink, RefreshCw, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Spin } from "antd";
import { getWhatsAppUrl } from "@/constants/siteContact";

interface TrueReportViewerProps {
  chassis: string;
  reportKey?: string;
  onReady?: () => void;
}

interface OriginalReport {
  chassis: string;
  url: string;
  filename: string;
}

const getFilename = (disposition: string | null, chassis: string) => {
  const match = disposition?.match(/filename="([^"\r\n]+)"/i);
  return (
    match?.[1] || `original-report-${chassis.replace(/[^a-z0-9-]/gi, "")}.pdf`
  );
};

// Display and download the provider's original bytes. Never rebuild a report
// from XML, images, an HTML screenshot, or a locally generated QR code.
export const TrueReportViewer = ({
  chassis,
  reportKey,
  onReady,
}: TrueReportViewerProps) => {
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const [report, setReport] = useState<OriginalReport | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    setReport(null);
    setError("");
    setIsLoading(true);

    const loadOriginal = async () => {
      try {
        const params = new URLSearchParams({ chassis });
        if (reportKey) params.set("key", reportKey);
        const response = await fetch(
          `/api/jpcenter/download?${params.toString()}`,
          { signal: controller.signal, cache: "no-store" },
        );
        if (!response.ok) {
          const failure = await response.json().catch(() => null);
          throw new Error(
            failure?.error || "The original PDF is currently unavailable.",
          );
        }
        const blob = await response.blob();
        const signature = await blob.slice(0, 5).text();
        if (signature !== "%PDF-") {
          throw new Error(
            "The provider did not return an original PDF report.",
          );
        }
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setReport({
          chassis,
          url: objectUrl,
          filename: getFilename(
            response.headers.get("content-disposition"),
            chassis,
          ),
        });
        onReadyRef.current?.();
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(
            failure instanceof Error
              ? failure.message
              : "Could not load the original PDF.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    void loadOriginal();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [chassis, attempt, reportKey]);

  if (isLoading || (report && report.chassis !== chassis)) {
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
          Downloading official Japanese auction inspection sheet, high-resolution vehicle photos, and verified inspection data for Chassis {chassis}
        </p>
      </div>
    );
  }

  if (error || !report) {
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
          {error}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Don&apos;t worry, your payment or order is confirmed. If the provider takes extra time, please retry or contact our support team.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#002575]"
          >
            <RefreshCw size={16} /> Retry Download
          </button>
          <a
            href={getWhatsAppUrl(
              `Hello CarClickBD, I need the verified original Japanese auction sheet PDF for chassis ${chassis}.`,
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
    <div className="mx-auto w-full max-w-5xl space-y-4">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border-2 border-[#4A90E2] bg-white p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={22} />
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-950 sm:text-xl">
              Official True Report &bull; {chassis}
            </h2>
          </div>
          <p className="text-xs font-semibold text-slate-600">
            Authentic Japanese Auction Sheet &bull; All Photos Included &bull; Bank Verified Document
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={report.url}
            download={report.filename}
            className="inline-flex items-center gap-2 rounded-xl bg-[#f5bd05] px-5 py-3 text-sm font-black text-slate-950 shadow-md transition hover:bg-[#dfaa00] hover:shadow-lg"
          >
            <Download size={18} />
            Download Official PDF
          </a>
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#003399] bg-white px-5 py-3 text-sm font-bold text-[#003399] shadow-sm transition hover:bg-blue-50"
          >
            <ExternalLink size={18} />
            Fullscreen / Print
          </a>
        </div>
      </div>

      {/* Trust & Bank Notice Box */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs font-medium text-emerald-900">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
        <div className="space-y-0.5">
          <p className="font-bold">
            100% Unaltered Provider Document &bull; All Images & Markings Preserved
          </p>
          <p className="text-emerald-800">
            This authentic multi-page PDF contains the complete vehicle inspection diagram, inspector notes, high-definition car yard photos, and auction house QR code. It is completely untouched and accepted by banks for car loans and customs verification.
          </p>
        </div>
      </div>

      {/* Embedded PDF Viewer */}
      <div className="overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-xl">
        <iframe
          src={report.url}
          title={`Official auction report for ${chassis}`}
          className="h-[85vh] min-h-[650px] w-full border-none bg-slate-100"
        />
      </div>

      {/* Bottom Download Helper */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-100 px-5 py-3 text-xs text-slate-600">
        <span>File Name: <strong>{report.filename}</strong></span>
        <a
          href={report.url}
          download={report.filename}
          className="font-bold text-[#003399] underline hover:text-blue-800"
        >
          Click here if the PDF does not display automatically
        </a>
      </div>
    </div>
  );
};

export default TrueReportViewer;
