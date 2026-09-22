"use client";

import { useInitBdGatePaymentMutation } from "@/Redux/api/paymentApi";
import { Button, message } from "antd";
import { CreditCard, ShieldCheck } from "lucide-react";

const BDGate = ({ data, setPaymentStatus }: any) => {
  const [initBdGatePayment, { isLoading }] = useInitBdGatePaymentMutation();

  const onSubmit = async () => {
    if (!data?._id) {
      message.error("Order information is missing");
      return;
    }

    try {
      const result = await initBdGatePayment({
        order: data._id,
        amount: data.totalAmount,
        currency: "BDT",
        success_url: `${window.location.origin}/payments?status=success&provider=bdgate&order=${data._id}&token={session_token}`,
        fail_url: `${window.location.origin}/payments?status=failed&provider=bdgate&order=${data._id}&token={session_token}`,
        cancel_url: `${window.location.origin}/payments?status=cancelled&provider=bdgate&order=${data._id}&token={session_token}`,
      }).unwrap();

      const paymentUrl =
        result?.data?.payment_url ||
        result?.data?.paymentUrl ||
        result?.data?.checkout_url ||
        result?.payment_url;
      if (!paymentUrl) {
        message.error("BDGate payment URL was not returned");
        return;
      }

      setPaymentStatus?.("Pending");
      window.location.href = paymentUrl;
    } catch (error: any) {
      message.error(
        error?.data?.message || error?.message || "BDGate payment failed",
      );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f5bd05] text-slate-950">
          <CreditCard size={21} />
        </span>
        <div>
          <h3 className="text-base font-extrabold text-slate-950">
            BDGate Secure Payment
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Pay safely in BDT through BDGate hosted checkout.
          </p>
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        block
        loading={isLoading}
        onClick={onSubmit}
        className="!h-12 !rounded-md !border-none !bg-[#f5bd05] !text-sm !font-extrabold !text-slate-950 hover:!bg-[#e4ad00]"
      >
        Pay with BDGate
      </Button>
      <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700">
        <ShieldCheck size={14} />
        You will be redirected to BDGate to complete payment.
      </p>
    </div>
  );
};

export default BDGate;
