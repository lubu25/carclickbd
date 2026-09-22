"use client";
import { useCreatePaymentMutation } from "@/Redux/api/paymentApi";
import { Card, message } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const order = searchParams.get("ref");
  const session_id = searchParams.get("session_id");
  const amountParam = searchParams.get("amount");
  const amount = amountParam !== null ? parseFloat(amountParam) : 0;

  const [createPayment] = useCreatePaymentMutation();
  const isPaymentInitiatedRef = useRef(false);

  useEffect(() => {
    if (!session_id || isPaymentInitiatedRef.current) {
      return;
    }

    const paymentData = {
      amount,
      paymentStatus: "PAID",
      transactionId: session_id,
      order,
      paymentMethod: "bdgate",
    };

    const makePayment = async () => {
      isPaymentInitiatedRef.current = true;
      const res = await createPayment(paymentData).unwrap();

      if (res?._id) {
        message.success("Payment success");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        isPaymentInitiatedRef.current = false;
      }
    };

    makePayment().catch((error) => {
      console.error("Payment failed:", error);
      isPaymentInitiatedRef.current = false;
    });
  }, [session_id, amount, order, createPayment, router]);

  return (
    <div className="page-content">
      <Card>
        <div className="text-center">
          <h1 className="display-1">Thank You</h1>
          <p className="lead">Your payment has been successfully processed</p>
          <p className="lead">
            You will be redirected to the dashboard in a few seconds
          </p>
        </div>
      </Card>
    </div>
  );
}
