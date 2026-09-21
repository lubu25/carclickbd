"use client";

import { Button, message } from "antd";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { getPaymentGatewaySettings } from "@/utils/paymentGatewaySettings";

const EPS = ({ data, setPaymentStatus }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!data?._id) {
      message.error("Order information is missing");
      return;
    }

    try {
      setIsLoading(true);
      const settings = getPaymentGatewaySettings();
      const response = await fetch("/api/eps/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: data._id,
          amount: Number(data.totalAmount || 0),
          currency: "BDT",
          gateway_mode: settings.mode,
          success_url: `${window.location.origin}/payments?status=success&provider=eps&order=${data._id}&token={token}`,
          fail_url: `${window.location.origin}/payments?status=failed&provider=eps&order=${data._id}&token={token}`,
          cancel_url: `${window.location.origin}/payments?status=cancelled&provider=eps&order=${data._id}&token={token}`,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "EPS initialization failed");
      }

      const paymentUrl =
        result?.data?.payment_url ||
        result?.data?.paymentUrl ||
        result?.data?.checkout_url ||
        result?.payment_url ||
        result?.redirect_url ||
        result?.data?.redirect_url;

      if (!paymentUrl) {
        message.error("EPS payment URL was not returned");
        return;
      }

      setPaymentStatus?.("Pending");
      window.location.href = paymentUrl;
    } catch (error: any) {
      message.error(
        error?.data?.message || error?.message || "EPS payment failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1d4ed8] text-white">
          <CreditCard size={21} />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-slate-950">
            EPS Secure Payment
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Pay safely in BDT through the EPS payment gateway.
          </p>
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        block
        loading={isLoading}
        onClick={onSubmit}
        className="!h-12 !rounded-md !border-none !bg-[#1d4ed8] !text-sm !font-extrabold !text-white hover:!bg-[#183eb7]"
      >
        Pay with EPS
      </Button>
      <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
        <ShieldCheck size={14} />
        You will be redirected to EPS to complete payment.
      </p>
    </div>
  );
};

export default EPS;
