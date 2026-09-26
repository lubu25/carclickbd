'use client';

import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Car,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileSearch,
  Languages,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  useCreateAuctionSheetOrderMutation,
  useLazyGetAuctionSheetReportQuery,
} from '@/Redux/api/auctionSheetApi';
import {
  useInitBdGateAuctionSheetPaymentMutation,
  useLazyGetBdGateAuctionSheetPaymentStatusQuery,
} from '@/Redux/api/paymentApi';
import { getWhatsAppUrl } from '@/constants/siteContact';

// Auction sheet purchase price — change this single value to update both UI and payment
const AUCTION_SHEET_PRICE = 750;

type ReportValue = string | number | boolean | null | undefined;

const getNestedValue = (source: any, keys: string[]): ReportValue => {
  if (!source || typeof source !== 'object') return undefined;

  for (const key of keys) {
    const value = source[key];
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return value;
    }
  }

  for (const value of Object.values(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedValue = getNestedValue(value, keys);
      if (
        nestedValue !== undefined &&
        nestedValue !== null &&
        nestedValue !== ''
      ) {
        return nestedValue;
      }
    }
  }

  return undefined;
};

const getNestedImage = (source: any): string => {
  const image = getNestedValue(source, [
    'image',
    'image_url',
    'imageUrl',
    'photo',
    'photo_url',
    'sheet_image',
    'sheetImage',
    'auction_sheet',
    'auctionSheet',
  ]);

  return typeof image === 'string' && /^https?:\/\//i.test(image) ? image : '';
};

const formatLabel = (label: string) =>
  label
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, char => char.toUpperCase());

const buildReportRows = (report: any) => {
  if (!report || typeof report !== 'object') return [];

  const source = Array.isArray(report) ? report[0] : report;

  return Object.entries(source || {})
    .filter(([, value]) => {
      const valueType = typeof value;
      return (
        value === null ||
        valueType === 'string' ||
        valueType === 'number' ||
        valueType === 'boolean'
      );
    })
    .slice(0, 12);
};

const verificationFeatures = [
  {
    title: 'Auction record check',
    description:
      'Review available auction sheet records by chassis number before making a buying decision.',
    icon: FileSearch,
  },
  {
    title: 'Mileage and grade review',
    description:
      'Check mileage history, auction grade, repair marks, and condition notes where records are available.',
    icon: BadgeCheck,
  },
  {
    title: 'Translation support',
    description:
      'Understand important Japanese sheet notes such as scratches, dents, rust, and replaced parts.',
    icon: Languages,
  },
];

const processSteps = [
  'Enter the chassis number exactly as shown on the vehicle documents.',
  'Review the available match and submit your verification request.',
  'Complete payment and keep your WhatsApp available for follow-up.',
  'Our team checks the report details and guides you with the next steps.',
];

const infoSections = [
  {
    title: 'Why verify before buying?',
    description:
      'A Japanese auction sheet can reveal mileage records, accident notes, repair marks, replaced parts, paint touch-ups, corrosion, and overall condition.',
    icon: ShieldCheck,
  },
  {
    title: 'Manual review when needed',
    description:
      'If an auction sheet is not instantly available, CarClickBD can review the chassis request manually and contact you.',
    icon: ClipboardCheck,
  },
  {
    title: 'For Japanese imports',
    description:
      'This service helps buyers make better decisions before purchasing reconditioned Japanese cars in Bangladesh.',
    icon: Car,
  },
  {
    title: 'Production year confidence',
    description:
      'Use auction sheet checks with production year, registration details, and seller documents to reduce costly mistakes.',
    icon: CalendarCheck,
  },
];

const AuctionSheetsPageContent = () => {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const chassis = searchParams.get('chassis') || '';
  const paymentId = searchParams.get('payment_id') || '';
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const automaticDownloadStarted = useRef(false);
  const [getAuctionSheetReport, { data, error, isFetching }] =
    useLazyGetAuctionSheetReportQuery();
  const [createAuctionSheetOrder, { isLoading: isCreatingOrder }] =
    useCreateAuctionSheetOrderMutation();
  const [initBdGateAuctionSheetPayment, { isLoading: isStartingPayment }] =
    useInitBdGateAuctionSheetPaymentMutation();
  const [getAuctionSheetPaymentStatus, { data: paymentStatusResponse }] =
    useLazyGetBdGateAuctionSheetPaymentStatusQuery();
  const isPurchasing = isCreatingOrder || isStartingPayment;

  const paymentStatus =
    paymentStatusResponse?.data?.data || paymentStatusResponse?.data;
  const isPaymentPaid = paymentStatus?.paid === true;
  const downloadUrl = paymentStatus?.download_url;

  useEffect(() => {
    const cleanChassis = chassis.trim();
    if (!cleanChassis) return;
    getAuctionSheetReport(cleanChassis);
  }, [chassis, getAuctionSheetReport]);

  useEffect(() => {
    if (!paymentId || isPaymentPaid) return;

    getAuctionSheetPaymentStatus(paymentId);
    const interval = window.setInterval(() => {
      getAuctionSheetPaymentStatus(paymentId);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [getAuctionSheetPaymentStatus, isPaymentPaid, paymentId]);

  useEffect(() => {
    automaticDownloadStarted.current = false;
  }, [paymentId]);

  useEffect(() => {
    if (
      !paymentId ||
      !isPaymentPaid ||
      !downloadUrl ||
      automaticDownloadStarted.current
    ) {
      return;
    }

    automaticDownloadStarted.current = true;
    setPurchaseError('');
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = '';
    downloadLink.rel = 'noopener';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  }, [downloadUrl, isPaymentPaid, paymentId]);

  const reportEnvelope = data?.data;
  const reportData = (reportEnvelope as any)?.data || reportEnvelope || data;
  const report = reportData?.report;
  const reportSource = Array.isArray(report) ? report[0] : report;
  const reportRows = buildReportRows(report);
  const found = Boolean(reportData?.found);
  const model = getNestedValue(reportSource, [
    'model',
    'car_model',
    'carModel',
    'name',
  ]);
  const year = getNestedValue(reportSource, [
    'year',
    'car_year',
    'production_year',
    'productionYear',
    'model_year',
  ]);
  const color = getNestedValue(reportSource, ['car_color', 'color', 'colour']);
  const grade = getNestedValue(reportSource, [
    'grade',
    'auction_grade',
    'auctionGrade',
    'car_grade',
  ]);
  const sheetImage = getNestedImage(reportSource);
  const downloadAvailable = reportData?.download_available === true;
  const handlePurchaseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPurchaseError('');

    const formData = new FormData(event.currentTarget);
    const cleanChassis = reportData?.chassis || chassis;

    if (!downloadAvailable) {
      setPurchaseError(
        'JPCenter does not have a downloadable auction sheet for this chassis yet. No payment was started. Please contact CarClickBD for a manual review.',
      );
      return;
    }

    try {
      // Bypass the failing backend /auction-sheet/order endpoint
      // and directly hit our Next.js API route to initiate EPS Checkout
      const response = await fetch('/api/eps/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chassis: cleanChassis,
          name: String(formData.get('name') || ''),
          email: String(formData.get('email') || ''),
          mobileNumber: String(formData.get('mobile') || ''),
          address: String(formData.get('address') || ''),
          amount: AUCTION_SHEET_PRICE,
          termsAccepted: formData.get('termsAccepted') === 'on',
        })
      });

      const paymentResponse = await response.json();

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || 'Failed to initiate EPS payment.');
      }

      const paymentUrl = paymentResponse?.data?.payment_url;


      if (!paymentUrl) {
        throw new Error(
          'BDGate did not return a payment URL. Please check the backend BDGate response.',
        );
      }

      window.location.assign(paymentUrl);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'Could not create the auction sheet order. Please try again.';

      setPurchaseError(message);
    }
  };

  const handleDownloadOrPurchase = () => {
    if (isPaymentPaid) {
      if (downloadUrl) {
        window.location.assign(downloadUrl);
      } else {
        setPurchaseError(
          'Payment is confirmed, but the auction sheet file is not available yet. Please contact CarClickBD.',
        );
      }
      return;
    }

    if (!downloadAvailable) {
      setPurchaseError(
        'The auction sheet file is not available for this chassis yet. Payment has not been started.',
      );
      return;
    }

    setPurchaseError('');
    setIsPurchaseModalOpen(true);
  };

  return (
    <main className="bg-slate-50">
      <section className="bg-white px-4 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#e50914]">
              Japanese auction sheet verification
            </p>
            <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-slate-950 md:text-5xl">
              Chassis Search Result and True Report Request
            </h1>
            <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-[#f5bd05]" />
            <p className="mx-auto mt-7 max-w-2xl text-base font-semibold leading-7 text-slate-600">
              Review the chassis result first, then continue to payment or
              contact CarClickBD for manual verification support.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] md:p-6">
            {!chassis ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-center gap-3 text-amber-700">
                  <AlertCircle size={22} />
                  <h2 className="text-xl font-black">
                    Chassis number required
                  </h2>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Please enter a chassis number from the verification page
                  first.
                </p>
                <Link
                  href="/verify-auction-sheet"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#f5bd05] px-5 text-sm font-black text-slate-950"
                >
                  Search again
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-4 text-center">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[#e50914]">
                      Click on the chassis image to get the true report
                    </p>
                    <p className="text-sm font-bold text-black">
                      অকশন শীট ভ্যারিফাই করতে নিচের ছবিতে ক্লিক করুন ।
                    </p>
                  </div>

                  <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 border-2 border-[#4A90E2] p-6 sm:flex-row sm:items-start sm:p-8">
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Download auction sheet"
                      onClick={handleDownloadOrPurchase}
                      className="relative flex h-[120px] w-full max-w-[260px] shrink-0 cursor-pointer items-center justify-center bg-white transition hover:opacity-80"
                    >
                      {sheetImage ? (
                        <Image
                          src={sheetImage}
                          alt={`Auction sheet preview for ${chassis}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center border border-gray-300 p-4 text-center text-xs font-bold text-slate-500">
                          Image preview
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-col space-y-4 text-left sm:w-auto">
                      <p className="text-xl font-bold text-black md:text-2xl">
                        Model:{' '}
                        <span className="uppercase text-[#e50914]">
                          {isFetching ? 'Checking...' : (model || 'N/A')}
                        </span>
                      </p>
                      <p className="text-xl font-bold text-black md:text-2xl">
                        Year:{' '}
                        <span className="uppercase text-[#e50914]">
                          {isFetching ? 'Checking...' : (year || 'N/A')}
                        </span>
                      </p>
                      <p className="text-xl font-bold text-black md:text-2xl">
                        Color:{' '}
                        <span className="uppercase text-[#e50914]">
                          {isFetching ? 'Checking...' : (color || 'N/A')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleDownloadOrPurchase}
                    className="inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#f5bd05] px-5 text-sm font-black text-slate-950 shadow-[0_14px_30px_rgba(245,189,5,0.25)] transition hover:-translate-y-0.5 hover:bg-[#e4ad00] sm:w-auto"
                  >
                    {downloadAvailable
                      ? 'Download Auction Sheet'
                      : 'Auction Sheet Pending'}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8fafc_0%,#eef5ff_100%)] px-4 py-14 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#003399]">
                Verification service
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-slate-950 md:text-4xl">
                Verify Japanese car auction records with a clearer process.
              </h2>
              <p className="mt-4 max-w-4xl text-base font-medium leading-8 text-slate-600">
                CarClickBD helps buyers request auction sheet verification by
                chassis number before purchasing a Japanese vehicle. The goal is
                simple: check available records, understand condition notes, and
                make a more confident buying decision.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {verificationFeatures.map(feature => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff3bf] text-[#003399]">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f5bd05]">
                  How it works
                </p>
                <h3 className="mt-3 text-2xl font-black">Four simple steps</h3>
                <div className="mt-6 space-y-4">
                  {processSteps.map((step, index) => (
                    <div key={step} className="flex gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5bd05] text-sm font-black text-slate-950">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-sm font-semibold leading-6 text-white/85">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {infoSections.map(section => {
                  const Icon = section.icon;

                  return (
                    <div
                      key={section.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#003399]">
                          <Icon size={20} />
                        </div>
                        <h3 className="text-base font-black text-slate-950">
                          {section.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        {section.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {Boolean(error) && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
                <div className="flex items-center gap-3 font-black text-rose-800">
                  <AlertCircle size={20} />
                  Report service is temporarily unavailable
                </div>
                <p className="mt-2 text-sm font-medium leading-6">
                  Please continue with payment or contact CarClickBD on WhatsApp
                  so our team can check the auction sheet manually.
                </p>
              </div>
            )}

            {reportRows.length > 0 && (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
                <h3 className="text-xl font-black text-slate-950">
                  Available report details
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {reportRows.map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                        {formatLabel(key)}
                      </p>
                      <p className="mt-2 break-words text-sm font-bold text-slate-900">
                        {String(value ?? 'N/A')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5bd05]">
                <ClipboardCheck size={26} />
              </div>
              <h3 className="mt-5 text-2xl font-black">
                Download Auction Sheet
              </h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                Submit the chassis number and complete payment to request full
                auction sheet verification.
              </p>
              <button
                type="button"
                onClick={handleDownloadOrPurchase}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f5bd05] px-5 text-sm font-black text-slate-950 transition hover:bg-[#e4ad00]"
              >
                {downloadAvailable
                  ? 'Download Auction Sheet'
                  : 'Auction Sheet Pending'}
                <ArrowRight size={17} />
              </button>
            </div>

            <a
              href={getWhatsAppUrl(
                `Hello CarClickBD, I want to verify auction sheet for chassis ${chassis || ''}.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-black text-white transition hover:bg-[#1ebe5d]"
            >
              <MessageCircle size={18} />
              Contact on WhatsApp
            </a>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-700">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#003399]" />
                <p className="text-sm font-bold">
                  Always verify documents, chassis number, seller ownership, and
                  vehicle condition before payment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-white shadow-[0_30px_100px_rgba(15,23,42,0.35)]">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#F5BD05] px-6 py-4">
              <h2 className="text-xl font-medium text-black">Your Information</h2>
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-black hover:text-gray-800 transition"
                aria-label="Close"
              >
                <X size={28} strokeWidth={3} />
              </button>
            </div>

            <div className="flex flex-col gap-8 p-6 md:flex-row md:p-8">
              {/* Left Column */}
              <div className="w-full md:w-1/2 flex flex-col gap-6">
                <div className="border border-red-500 p-2">
                  <p className="text-lg font-bold text-black">
                    Payment Amount: <span className="text-red-500">{AUCTION_SHEET_PRICE} BDT</span>
                  </p>
                </div>
                
                <div className="relative h-[180px] w-full max-w-[320px] bg-white border border-gray-300 flex items-center justify-center">
                  {sheetImage ? (
                    <Image
                      src={sheetImage}
                      alt="Chassis Image"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">Image preview</span>
                  )}
                </div>

                <div className="text-left font-bold text-black text-lg space-y-1">
                  <p>Model: <span className="uppercase text-black">{model || 'N/A'}</span></p>
                  <p>Year: <span className="uppercase text-black">{year || 'N/A'}</span></p>
                  <p>Color: <span className="uppercase text-black">{color || 'N/A'}</span></p>
                </div>

                <div className="w-full max-w-[320px] overflow-hidden rounded-md border border-slate-200 bg-white">
                  <Image
                    src="/assets/shared/payment-methods-verified-eps.png"
                    alt="Payment methods verified by EPS"
                    width={2000}
                    height={360}
                    className="block h-auto w-full"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/2">
                <form id="purchaseForm" onSubmit={handlePurchaseSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">Your Name:</label>
                    <input required name="name" type="text" placeholder="Name" className="w-full border border-gray-300 px-4 py-2.5 outline-none focus:border-[#F5BD05]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">Your Email:</label>
                    <input required name="email" type="email" placeholder="Insert Your Email" className="w-full border border-gray-300 px-4 py-2.5 outline-none focus:border-[#F5BD05]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">Mobile Number:</label>
                    <input required name="mobile" type="tel" placeholder="01XXXXXXXXX" className="w-full border border-gray-300 px-4 py-2.5 outline-none focus:border-[#F5BD05]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">Country</label>
                    <select className="w-full border border-gray-300 px-4 py-2.5 outline-none focus:border-[#F5BD05]">
                      <option value="Bangladesh">Bangladesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">Address:</label>
                    <textarea required name="address" rows={3} placeholder="address" className="w-full border border-gray-300 px-4 py-2.5 outline-none focus:border-[#F5BD05] resize-none" />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <input required name="termsAccepted" type="checkbox" className="h-4 w-4" />
                    <span className="text-sm font-bold text-black">
                      I read and agree to the <a href="/terms-privacy-refund" className="text-blue-600 hover:underline">Terms and Policies</a>
                    </span>
                  </div>

                  {purchaseError && (
                    <div className="mt-4 rounded border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
                      {purchaseError}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 bg-white px-6 py-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="px-6 py-2.5 bg-[#f0f0f0] text-black font-medium hover:bg-gray-200 transition"
              >
                Close
              </button>
              <button
                type="submit"
                form="purchaseForm"
                disabled={isPurchasing}
                className="px-6 py-2.5 bg-[#2980b9] text-white font-medium hover:bg-[#3498db] transition flex items-center gap-2"
              >
                {isPurchasing ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}

      {purchaseError && !isPurchaseModalOpen && (
        <div
          role="alert"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.28)]"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={22} />
            <div className="min-w-0 flex-1">
              <p className="font-black">Auction sheet is not ready</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                {purchaseError}
              </p>
              <a
                href={getWhatsAppUrl(
                  `Hello CarClickBD, please manually check auction sheet availability for chassis ${chassis || ''}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-black text-white"
              >
                <MessageCircle size={16} />
                Request manual review
              </a>
            </div>
            <button
              type="button"
              onClick={() => setPurchaseError('')}
              aria-label="Close message"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default function AuctionSheetsPage() {
  return (
    <Suspense fallback={<div className="min-h-[65vh] bg-slate-50" />}>
      <AuctionSheetsPageContent />
    </Suspense>
  );
}
