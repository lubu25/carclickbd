"use client";
import React, { useState } from "react";
import SignInPage from "@/components/auth/signin";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";

const LoginPage: React.FC = () => {
  const [authState, setAuthState] = useState<number>(0);

  return (
    <LoggedInRedirect>
      <div className="flex h-screen max-w-96 mx-auto">
        <SignInPage setAuthState={setAuthState} />
      </div>
    </LoggedInRedirect>
  );
};

export default LoginPage;
