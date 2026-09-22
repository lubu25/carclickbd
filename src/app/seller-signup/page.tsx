"use client";
import React, { useState } from "react";
import SignUpPage from "@/components/auth/signup";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";
const SellerSignUpPage = () => {
const [authState, setAuthState] = useState<number>(0);

  return (
    <LoggedInRedirect>
      <div className="max-w-96 mx-auto min-h-screen grid place-items-center">
        <SignUpPage setAuthState={setAuthState} />
      </div>
    </LoggedInRedirect>
  );
};

export default SellerSignUpPage;
