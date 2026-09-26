import Image from "next/image";

const PaymentMethodsBanner = () => {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Image
        src="/assets/shared/payment-methods-verified-eps.png"
        alt="Available payment methods, verified by EPS Easy Payment System"
        width={2000}
        height={360}
        className="h-auto w-full"
        sizes="(max-width: 768px) 100vw, 720px"
      />
    </div>
  );
};

export default PaymentMethodsBanner;
