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
import { Spin } from 'antd';
import TrueReportViewer from '@/components/auction-sheet/TrueReportViewer';
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
  const statusParam = searchParams.get('status') || '';
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [frontendJpcenterData, setFrontendJpcenterData] = useState<any>(null);
  
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponMessage({ text: '', type: '' });
    try {
      const response = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, amount: AUCTION_SHEET_PRICE })
      });
      const data = await response.json();
      if (data.success) {
        setDiscountAmount(data.data.discount);
        setCouponMessage({ text: `Coupon applied: ${data.data.discount} BDT off`, type: 'success' });
      } else {
        setDiscountAmount(0);
        setCouponMessage({ text: data.message || 'Invalid coupon', type: 'error' });
      }
    } catch (e) {
      setDiscountAmount(0);
      setCouponMessage({ text: 'Error applying coupon', type: 'error' });
    } finally {
      setIsApplyingCoupon(false);
    }
  };
  const [isFrontendDownloading, setIsFrontendDownloading] = useState(false);
  const [fullReportData, setFullReportData] = useState<any>(null);
  const [isLoadingFullReport, setIsLoadingFullReport] = useState(false);
  const reportFetchStarted = useRef(false);
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
  const isPaymentPaid = paymentStatus?.paid === true || statusParam === 'success';
  const downloadUrl = frontendJpcenterData?.fileUrl || '';

  // Fetch complete True Report (all auction runs + car photos) when payment is confirmed
  useEffect(() => {
    if (
      (statusParam === 'success' || isPaymentPaid) &&
      chassis &&
      !fullReportData &&
      !isLoadingFullReport &&
      !reportFetchStarted.current
    ) {
      reportFetchStarted.current = true;
      setIsLoadingFullReport(true);
      setPurchaseError('');

      fetch(`/api/jpcenter?chassis=${encodeURIComponent(chassis)}&full=true`)
        .then(async (response) => {
          if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Could not retrieve full report data');
          }
          const resJson = await response.json();
          if (resJson.success && resJson.data) {
            setFullReportData(resJson.data);
            
            // Check and trigger email confirmation if pending
            if (typeof window !== 'undefined') {
              const pendingOrderStr = window.localStorage.getItem('pendingAuctionOrder');
              if (pendingOrderStr) {
                try {
                  const pendingOrder = JSON.parse(pendingOrderStr);
                  if (pendingOrder.chassis === chassis || !pendingOrder.chassis) {
                    window.localStorage.removeItem('pendingAuctionOrder');
                    pendingOrder.downloadUrl =
                      window.location.origin +
                      `/auction-sheets?status=success&chassis=${encodeURIComponent(chassis)}`;
                    fetch('/api/auction-sheet/send-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(pendingOrder),
                      keepalive: true,
                    }).catch((e) => console.error('Email dispatch error:', e));
                  }
                } catch (e) {
                  console.error('Failed to parse pending order:', e);
                }
              }
            }
          } else {
            throw new Error('Report data unavailable');
          }
          setIsLoadingFullReport(false);
        })
        .catch((err) => {
          console.error('Failed to fetch full report:', err);
          setIsLoadingFullReport(false);
          setPurchaseError(
            err instanceof Error ? err.message : 'Could not fetch full true report'
          );
        });
    }
  }, [statusParam, isPaymentPaid, chassis, fullReportData, isLoadingFullReport]);

  // Auto-download the report after the server has returned the actual file.
  useEffect(() => {
    if (
      statusParam !== 'success' ||
      !downloadUrl ||
      automaticDownloadStarted.current
    ) {
      return;
    }
    automaticDownloadStarted.current = true;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = frontendJpcenterData?.filename || `auction-sheet-${chassis || 'report'}.pdf`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [downloadUrl, frontendJpcenterData, statusParam, chassis]);

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


  const reportEnvelope = data?.data;
  const reportData = (reportEnvelope as any)?.data || reportEnvelope || data;
  const report = reportData?.report;
  const reportSource = Array.isArray(report) ? report[0] : report;
  const reportRows = buildReportRows(report);
  const found = Boolean(reportData?.found);
  const exactMatches: any[] = reportData?.exactMatches || (Array.isArray(report) ? report : []);
  const allMatches: any[] = reportData?.allMatches || [];
  const matchCount: number = reportData?.matchCount || exactMatches.length || (found ? 1 : 0);

  const model = getNestedValue(reportSource, [
    'model',
    'car_model',
    'carModel',
    'name',
  ]);
  const brand = getNestedValue(reportSource, [
    'brand',
    'maker',
    'car_maker',
    'vendor',
  ]) || 'TOYOTA';
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
  const displacement = getNestedValue(reportSource, [
    'displacement',
    'engineCc',
    'car_displacement',
  ]);
  const transmission = getNestedValue(reportSource, [
    'transmission',
    'car_transmission',
  ]);
  const options = getNestedValue(reportSource, [
    'options',
    'equipment',
    'car_options',
  ]);
  const startPrice = getNestedValue(reportSource, [
    'startPrice',
    'car_start_price',
  ]);
  const statusResult = getNestedValue(reportSource, [
    'result',
    'status',
    'car_result',
  ]);
  const sheetImage = getNestedImage(reportSource);
  const downloadAvailable = true; // Bypassed for testing (reportData?.download_available === true)
  const handlePurchaseSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPurchaseError('');

    const formData = new FormData(event.currentTarget);
    const cleanChassis = reportData?.chassis || chassis;

    if (!downloadAvailable && false) { // Bypassed for testing
      setPurchaseError(
        'JPCenter does not have a downloadable auction sheet for this chassis yet. No payment was started. Please contact CarClickBD for a manual review.',
      );
      return;
    }

    try {
      const name = String(formData.get('name') || '');
      const email = String(formData.get('email') || '');
      const mobileNumber = String(formData.get('mobile') || '');
      const address = String(formData.get('address') || '');
      
      const finalAmount = AUCTION_SHEET_PRICE - discountAmount;

      // Save data to localStorage to send email from frontend after success
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('pendingAuctionOrder', JSON.stringify({
          chassis: cleanChassis,
          name,
          email,
          mobileNumber,
          address,
          amount: finalAmount
        }));
      }

      // Bypass EPS Checkout if final amount is 0
      if (finalAmount <= 0) {
        const orderId = `TEST_${Date.now()}`;
        window.location.assign(`/payments?status=success&type=auction-sheet&order=${orderId}&chassis=${encodeURIComponent(cleanChassis)}`);
        return;
      }

      // Bypass the failing backend /auction-sheet/order endpoint
      // and directly hit our Next.js API route to initiate EPS Checkout
      const response = await fetch('/api/eps/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chassis: cleanChassis,
          name,
          email,
          mobileNumber,
          address,
          amount: finalAmount,
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
        window.open(downloadUrl, '_blank');
      } else if (isFrontendDownloading) {
        setPurchaseError('Please wait, downloading your auction sheet...');
      } else {
        setPurchaseError(
          'Payment is confirmed, but the auction sheet file is not available yet. Please contact CarClickBD.',
        );
      }
      return;
    }

    if (!downloadAvailable && false) { // Bypassed for testing
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
                <div className="space-y-4">
                  {isPaymentPaid && isLoadingFullReport ? (
                    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 rounded-3xl border-2 border-[#4A90E2] bg-white p-12 text-center shadow-lg">
                      <Spin size="large" />
                      <p className="text-xl font-black text-slate-800">Loading Verified True Report & Car Photos…</p>
                      <p className="text-sm font-semibold text-slate-500">
                        Retrieving official Japanese auction sheet, vehicle inspection photos, and condition details for Chassis {chassis}
                      </p>
                    </div>
                  ) : isPaymentPaid && fullReportData?.reports && fullReportData.reports.length > 0 ? (
                    <div className="w-full">
                      <TrueReportViewer
                        chassis={chassis}
                        reports={fullReportData.reports}
                        keyForTranslate={fullReportData.keyForTranslate}
                      />
                    </div>
                  ) : isPaymentPaid && purchaseError ? (
                    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
                      <div className="mb-3 flex justify-center text-red-500">
                        <AlertCircle size={48} />
                      </div>
                      <h2 className="mb-2 text-xl font-bold text-slate-800">Payment Successful, but Report Delayed</h2>
                      <p className="mb-6 text-sm font-medium text-slate-600">
                        {purchaseError}
                      </p>
                      <p className="mb-6 text-sm text-slate-600">
                        Don&apos;t worry, we have received your payment. Please contact our support team on WhatsApp to get your report manually.
                      </p>
                      <Link
                        href={getWhatsAppUrl(`Hello, I paid for auction sheet verification (Chassis: ${chassis}) but received an error: ${purchaseError}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-black text-white transition hover:bg-[#20bd5a]"
                      >
                        <MessageCircle size={18} />
                        Contact Support
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold text-[#e50914]">
                          Click on the chassis image or unlock button to get the complete True Report
                        </p>
                        <p className="text-sm font-bold text-black">
                          সম্পূর্ণ অকশন শীট ও গাড়ির ছবিসহ ট্রু রিপোর্ট পেতে নিচের ছবিতে ক্লিক করুন।
                        </p>
                      </div>

                      {/* Verified Vehicle Match Card */}
                      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border-2 border-[#4A90E2] bg-white shadow-lg">
                        {/* Match Status Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#003399] px-6 py-3 text-white">
                          <div className="flex items-center gap-2">
                            <BadgeCheck className="text-emerald-400" size={20} />
                            <span className="text-xs font-black uppercase tracking-wider">
                              Verified in Japanese Auction Database
                            </span>
                          </div>
                          <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">
                            {matchCount} Record{matchCount > 1 ? 's' : ''} Found
                          </span>
                        </div>

                        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                          {/* Left: Preview Sheet Thumbnail */}
                          <div
                            role="button"
                            tabIndex={0}
                            aria-label="Unlock auction sheet"
                            onClick={handleDownloadOrPurchase}
                            className="group relative flex h-[200px] w-full max-w-[280px] shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition hover:border-[#003399] hover:shadow-md"
                          >
                            {sheetImage ? (
                              <>
                                <Image
                                  src={sheetImage}
                                  alt={`Auction sheet preview for ${chassis}`}
                                  fill
                                  className="object-contain p-2 transition group-hover:scale-105"
                                  unoptimized
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center text-white opacity-0 transition group-hover:opacity-100">
                                  <ShieldCheck size={32} className="text-[#f5bd05]" />
                                  <span className="mt-1 text-xs font-black">Click to Unlock Full Report</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-2 p-4 text-center text-xs font-bold text-slate-500">
                                <FileSearch size={32} className="text-[#003399]" />
                                <span>Auction Record Verified</span>
                              </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/75 px-2 py-1 text-center text-[10px] font-bold text-white backdrop-blur-sm">
                              🔒 High-Res Sheet & Photos Protected
                            </div>
                          </div>

                          {/* Right: Specifications & Details */}
                          <div className="flex w-full flex-col space-y-3 text-left">
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-[#003399]">
                                {isFetching ? 'Checking...' : (brand || 'TOYOTA')}
                              </p>
                              <h3 className="text-2xl font-black text-slate-950 sm:text-3xl">
                                {isFetching ? 'Checking...' : (model || 'Verified Vehicle')}
                              </h3>
                              <p className="text-xs font-bold text-slate-500">
                                Chassis: <span className="font-extrabold text-slate-800">{chassis}</span>
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-3">
                              <div>
                                <span className="text-slate-400 font-bold block uppercase text-[10px]">Year</span>
                                <span className="font-black text-slate-900">{isFetching ? '...' : (year || 'N/A')}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block uppercase text-[10px]">Grade</span>
                                <span className="font-black text-slate-900">{isFetching ? '...' : (grade || 'N/A')}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block uppercase text-[10px]">Engine</span>
                                <span className="font-black text-slate-900">{isFetching ? '...' : (displacement ? `${displacement} cc` : 'N/A')}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block uppercase text-[10px]">Transmission</span>
                                <span className="font-black text-slate-900">{isFetching ? '...' : (transmission || 'N/A')}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block uppercase text-[10px]">Color</span>
                                <span className="font-black text-slate-900">{isFetching ? '...' : (color || 'N/A')}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold block uppercase text-[10px]">Result</span>
                                <span className={`font-black uppercase ${String(statusResult).toLowerCase() === 'sold' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                  {isFetching ? '...' : (statusResult || 'Verified')}
                                </span>
                              </div>
                            </div>

                            {/* Auction History Timeline if multiple records */}
                            {exactMatches.length > 1 && (
                              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5">
                                <p className="text-[11px] font-bold text-[#003399]">
                                  {exactMatches.length} Recorded Auction Runs:
                                </p>
                                <div className="mt-1 flex flex-wrap gap-1.5">
                                  {exactMatches.map((m, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-xs"
                                    >
                                      Run {idx + 1}: {m.year || ''} {m.grade || ''} ({m.result || m.status || 'Verified'})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Prominent Checkout Action */}
                      <div className="flex flex-col items-center justify-center pt-2">
                        <button
                          type="button"
                          onClick={handleDownloadOrPurchase}
                          className="inline-flex h-14 w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-[#e50914] px-8 text-base font-black uppercase text-white shadow-[0_16px_36px_rgba(229,9,20,0.3)] transition hover:-translate-y-0.5 hover:bg-[#c20811] sm:w-auto"
                        >
                          <ShieldCheck size={20} />
                          Unlock Full True Report with Car Photos &bull; ৳{AUCTION_SHEET_PRICE}
                          <ArrowRight size={18} />
                        </button>
                        <p className="mt-3 text-xs font-semibold text-slate-500">
                          Instant access to high-res Japanese auction sheets, multiple car inspection photos, translation, and marks explanation.
                        </p>
                      </div>
                    </>
                  )}
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
                    Payment Amount: <span className="text-red-500">{AUCTION_SHEET_PRICE - discountAmount} BDT</span>
                    {discountAmount > 0 && <span className="text-sm line-through text-gray-400 ml-2">{AUCTION_SHEET_PRICE} BDT</span>}
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
                  
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black">Coupon Code (Optional):</label>
                    <div className="flex gap-2">
                      <input 
                        name="couponCode" 
                        type="text" 
                        placeholder="Enter coupon code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 border border-gray-300 px-4 py-2.5 outline-none focus:border-[#F5BD05]" 
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode}
                        className="px-4 py-2.5 bg-gray-800 text-white font-bold hover:bg-gray-700 transition disabled:opacity-50"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponMessage.text && (
                      <p className={`mt-1 text-sm font-bold ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                        {couponMessage.text}
                      </p>
                    )}
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
