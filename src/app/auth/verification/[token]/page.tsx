import EmailVerification from "@/components/auth/verification";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "CarEBid || verification ",
  description: "verification in CarEBid",
};
const EmailVerificationPage = ({ params }: any) => {
  const { token } = params;

  return (
    <>
      <EmailVerification token={token} />
    </>
  );
};

export default EmailVerificationPage;
