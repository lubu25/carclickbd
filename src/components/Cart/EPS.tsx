"use client";

import { useInitEpsPaymentMutation } from "@/Redux/api/paymentApi";
import { getPaymentGatewaySettings } from "@/utils/paymentGatewaySettings";
import { Button, message } from "antd";
import { CreditCard, ShieldCheck } from "lucide-react";

const EPS = ({ data, setPaymentStatus }: any) => {
  const [initEpsPayment, { isLoading }] = useInitEpsPaymentMutation();

  const onSubmit = async () => {
    if (!data?._id) {
      message.error("Order information is missing");
      return;
    }

    const settings = getPaymentGatewaySettings();

    if (!settings.enabled || !settings.epsApiKey?.trim()) {
      message.error(
        "EPS is not configured yet. Save the EPS API key in the admin payment settings first.",
      );
      return;
    }

    try {
      const result = await initEpsPayment({
        order: data._id,
        amount: Number(data.totalAmount || 0),
        currency: "BDT",
        api_key: settings.epsApiKey,
        gateway_mode: settings.mode,
        success_url: `${window.location.origin}/payments?status=success&provider=eps&order=${data._id}&token={session_token}`,
        fail_url: `${window.location.origin}/payments?status=failed&provider=eps&order=${data._id}&token={session_token}`,
        cancel_url: `${window.location.origin}/payments?status=cancelled&provider=eps&order=${data._id}&token={session_token}`,
      }).unwrap();

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
