"use client";
import React, { useEffect, useState } from "react";
import {  Modal } from "antd";

import logo from "../../../../public/assets/Logo/car.png";
import SignInPage from "@/components/auth/signin";
import SignUpPage from "@/components/auth/signup";
import ForgotPassword from "@/components/auth/forgotPassword";

import Image from "next/image";

import ResetPasswordWithOTP from "@/components/auth/resetPassword";
import { getTokenInfo } from "@/service/auth.service";
import Button from "@/components/shared/PrimaryButton";

const AUTH_STATES = {
  SIGN_IN: 0,
  SIGN_UP: 1,
  FORGOT_PASSWORD: 3,
};

const AuthModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [authState, setAuthState] = useState<number>(AUTH_STATES.SIGN_IN);

  // const tokenInfo = getTokenInfo();

  const toggleAuthModel = () => {
    setIsModalVisible(!isModalVisible);
  };

  const renderModalContent = () => {
    // Clear previous content before rendering new state
    switch (authState) {
      case AUTH_STATES.SIGN_IN:
        return <SignInPage setAuthState={setAuthState} />;
      case AUTH_STATES.SIGN_UP:
        return <SignUpPage setAuthState={setAuthState} />;
      case AUTH_STATES.FORGOT_PASSWORD:
        return <ForgotPassword setAuthState={setAuthState} />;
      // case AUTH_STATES.EMAIL_VERIFICATION:
      // return <EmailVerification setAuthState={setAuthState} />;
      default:
        return <SignInPage setAuthState={setAuthState} />;
    }
  };

  return (
    <>
      {/* Reusable Button */}
     
      <Button size="sm" variant="secondary" onClick={toggleAuthModel}>Sign in</Button>
      <Modal
        key={authState}
        title={
          <div className="flex items-center justify-center">
            <Image
              src={logo}
              className="w-16 h-16"
              width={64}
              height={64}
              alt="CarClickBD Logo"
            />
          </div>
        }
        open={isModalVisible}
        footer={null}
        onCancel={toggleAuthModel}
        centered
        closeIcon={<span className="text-lg">✕</span>}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default AuthModal;
