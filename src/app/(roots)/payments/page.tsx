'use client';

import { Suspense, useEffect } from 'react';
import { Button, Result, Spin, message } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileSearch } from 'lucide-react';
import { useSyncBdGatePaymentStatusMutation } from '@/Redux/api/paymentApi';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const token = searchParams.get('token') || searchParams.get('session_token');
  const chassis = searchParams.get('chassis') || '';
  const paymentId = searchParams.get('payment_id') || '';
  const isAuctionSheetPayment = type === 'auction-sheet';
  const [syncBdGatePaymentStatus, { isLoading: isSyncing }] =
    useSyncBdGatePaymentStatusMutation();

  useEffect(() => {
    if (isAuctionSheetPayment || !token || token === '{session_token}') return;

    syncBdGatePaymentStatus(token)
      .unwrap()
      .catch((error: any) => {
        message.error(
          error?.data?.message ||
            error?.message ||
            'Could not verify BDGate payment status',
        );
      });
  }, [isAuctionSheetPayment, syncBdGatePaymentStatus, token]);

  useEffect(() => {
    if (status !== 'success' || !isAuctionSheetPayment) return;

    const timeout = window.setTimeout(() => {
      router.replace(
        chassis || paymentId
          ? `/auction-sheets?${new URLSearchParams({
              ...(chassis ? { chassis } : {}),
              ...(paymentId ? { payment_id: paymentId } : {}),
            }).toString()}`
          : '/auction-sheets',
      );
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [chassis, isAuctionSheetPayment, paymentId, router, status]);

  const resultStatus: ResultStatusType =
    status === 'success'
      ? 'success'
      : status === 'cancelled'
        ? 'warning'
        : 'error';
  const resultTitle =
    status === 'success'
      ? isAuctionSheetPayment
        ? 'Payment return received'
        : 'Payment submitted successfully'
      : status === 'cancelled'
        ? 'Payment cancelled'
        : 'Payment was not completed';
  const resultSubTitle =
    status === 'success' && isAuctionSheetPayment
      ? 'Payment return received. Confirming BDGate payment and opening the protected download...'
      : status === 'success'
        ? 'BDGate has received your payment request. Your order will update after gateway confirmation.'
        : 'You can return and try the BDGate payment again.';

  return (
    <div className="min-h-[55vh] bg-slate-50 px-4 py-16">
      {isSyncing && (
        <div className="mb-6 flex justify-center">
          <Spin />
        </div>
      )}
      <Result
        icon={
          status === 'success' && isAuctionSheetPayment ? (
            <FileSearch />
          ) : undefined
        }
        status={resultStatus}
        title={resultTitle}
        subTitle={resultSubTitle}
        extra={[
          isAuctionSheetPayment ? (
            <Button
              type="primary"
              key="auction-sheets"
              onClick={() => {
                router.push(
                  chassis || paymentId
                    ? `/auction-sheets?${new URLSearchParams({
                        ...(chassis ? { chassis } : {}),
                        ...(paymentId ? { payment_id: paymentId } : {}),
                      }).toString()}`
                    : '/auction-sheets',
                );
              }}
            >
              Go to Auction Sheets
            </Button>
          ) : (
            <Button
              type="primary"
              key="console"
              onClick={() => {
                router.push('/customer/order');
              }}
            >
              View my orders
            </Button>
          ),
          <Button
            key="cars"
            onClick={() => {
              router.push(
                isAuctionSheetPayment ? '/verify-auction-sheet' : '/cars',
              );
            }}
          >
            {isAuctionSheetPayment ? 'Verify another sheet' : 'Browse cars'}
          </Button>,
        ]}
      />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-[55vh] bg-slate-50" />}>
      <PaymentPageContent />
    </Suspense>
  );
}
