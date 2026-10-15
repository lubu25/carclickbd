"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SignInPage from "@/components/auth/signin";
import SignUpPage from "@/components/auth/signup";
import ForgotPassword from "@/components/auth/forgotPassword";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";
import logo from "../../../public/assets/Logo/car.png";

const AUTH_STATES = {
  SIGN_IN: 0,
  SIGN_UP: 1,
  FORGOT_PASSWORD: 3,
};

const LoginPage: React.FC = () => {
  const [authState, setAuthState] = useState<number>(AUTH_STATES.SIGN_IN);

  const renderContent = () => {
    switch (authState) {
      case AUTH_STATES.SIGN_IN:
        return <SignInPage setAuthState={setAuthState} />;
      case AUTH_STATES.SIGN_UP:
        return <SignUpPage setAuthState={setAuthState} />;
      case AUTH_STATES.FORGOT_PASSWORD:
        return <ForgotPassword setAuthState={setAuthState} />;
      default:
        return <SignInPage setAuthState={setAuthState} />;
    }
  };

  return (
    <LoggedInRedirect>
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Brand Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src={logo}
                alt="CarClick BD"
                width={72}
                height={72}
                className="mx-auto h-16 w-16 object-contain"
                priority
              />
            </Link>
            <h1 className="mt-2 text-xl font-black text-slate-900 tracking-tight">
              CARCLICK BD
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Japanese Car Auction & Verification Portal
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
            {renderContent()}
          </div>

          {/* Footer Back Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-[#003399] transition"
            >
              &larr; Back to CarClick BD Homepage
            </Link>
          </div>
        </div>
      </main>
    </LoggedInRedirect>
  );
};

export default LoginPage;

