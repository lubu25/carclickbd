'use client';

import { Suspense, useEffect, useState } from 'react';
import { Button, Result, Spin, message } from 'antd';
import { ResultStatusType } from 'antd/es/result';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileSearch } from 'lucide-react';
import { useSyncBdGatePaymentStatusMutation } from '@/Redux/api/paymentApi';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const token = searchParams.get('token') || searchParams.get('session_token');
  const chassis = searchParams.get('chassis') || '';
  const paymentId = searchParams.get('payment_id') || '';
  const isAuctionSheetPayment = type === 'auction-sheet';
  const orderId = searchParams.get('order') || searchParams.get('order_id') || '';
  const [syncBdGatePaymentStatus, { isLoading: isSyncing }] =
    useSyncBdGatePaymentStatusMutation();
  const [isVerifyingEps, setIsVerifyingEps] = useState(false);
  const [epsVerificationFailed, setEpsVerificationFailed] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

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

  // Reliable Gateway Verification for Auction Sheet Payments
  useEffect(() => {
    if (!isAuctionSheetPayment) return;

    if (status !== 'success') {
      return;
    }

    let isMounted = true;
    setIsVerifyingEps(true);

    const verifyWithBackend = async () => {
      try {
        const res = await fetch('/api/eps/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, chassis }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (data.verified) {
          setIsVerifyingEps(false);

          // Dispatch confirmation email
          if (typeof window !== 'undefined') {
            const pendingData = window.localStorage.getItem('pendingAuctionOrder');
            if (pendingData) {
              try {
                const parsedData = JSON.parse(pendingData);
                const effectiveChassis = chassis || parsedData.chassis;
                window.localStorage.removeItem('pendingAuctionOrder');
                parsedData.orderId = orderId;
                parsedData.downloadUrl =
                  window.location.origin +
                  `/auction-sheets?chassis=${encodeURIComponent(effectiveChassis)}${orderId ? `&order=${encodeURIComponent(orderId)}` : ''}`;
                fetch('/api/auction-sheet/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(parsedData),
                  keepalive: true,
                }).catch((error) => console.error('Failed to send email:', error));
              } catch (e) {
                console.error('Failed to parse pending auction order data');
              }
            }
          }

          // Redirect to unlocked True Report
          const redirectTimeout = window.setTimeout(() => {
            router.replace(
              `/auction-sheets?${new URLSearchParams({
                ...(chassis ? { chassis } : {}),
                ...(orderId ? { order: orderId } : {}),
                status: 'success',
              }).toString()}`
            );
          }, 1500);

          return () => window.clearTimeout(redirectTimeout);
        } else {
          setIsVerifyingEps(false);
          setEpsVerificationFailed(true);
          setVerificationMessage(
            data.message || 'Payment could not be verified by the payment gateway.'
          );
        }
      } catch (err: any) {
        if (!isMounted) return;
        setIsVerifyingEps(false);
        setEpsVerificationFailed(true);
        setVerificationMessage(
          err.message || 'Network error verifying payment with gateway.'
        );
      }
    };

    verifyWithBackend();

    return () => {
      isMounted = false;
    };
  }, [chassis, isAuctionSheetPayment, orderId, router, status]);

  const resultStatus: ResultStatusType = epsVerificationFailed
    ? 'error'
    : isVerifyingEps
      ? 'info'
      : status === 'success'
        ? 'success'
        : status === 'cancelled'
          ? 'warning'
          : 'error';

  const resultTitle = epsVerificationFailed
    ? 'Payment Verification Unsuccessful'
    : isVerifyingEps
      ? 'Verifying Payment With Gateway...'
      : status === 'success'
        ? isAuctionSheetPayment
          ? 'Payment Verified Successfully!'
          : 'Payment submitted successfully'
        : status === 'cancelled'
          ? 'Payment cancelled'
          : 'Payment was not completed';

  const resultSubTitle = epsVerificationFailed
    ? (verificationMessage || 'The payment could not be confirmed by the payment gateway. If money was debited, please contact CarClickBD WhatsApp support with Order ID: ' + (orderId || 'N/A'))
    : isVerifyingEps
      ? 'Please wait a moment while we securely verify your transaction with the payment provider...'
      : status === 'success' && isAuctionSheetPayment
        ? 'Your payment has been verified. Redirecting to your Official True Report...'
        : status === 'success'
          ? 'BDGate has received your payment request. Your order will update after gateway confirmation.'
          : 'You can return and try the payment again.';

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
                        ...(status ? { status } : {}),
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
