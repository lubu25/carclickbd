"use client";

import { FiClock } from "react-icons/fi";
import moment from "moment";
import { useState, useEffect } from "react";
import ModalWrapper from "@/shared/modal/ModalWrapper";
import { ArrowUpOutlined } from "@ant-design/icons";
import MakeBids from "./MakeBids";
import SignInPage from "@/components/auth/signin";
import SignUpPage from "@/components/auth/signup";
import ForgotPassword from "@/components/auth/forgotPassword";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import { IProduct } from "@/Interface/product";
import { Progress } from "antd";
import CustomButton from "@/components/shared/CustomButton"; // ✅ your custom button

const AUTH_STATES = {
  SIGN_IN: 0,
  SIGN_UP: 1,
  FORGOT_PASSWORD: 3,
};

export interface AuctionNavBarProps {
  product: IProduct;
  className?: string;
}

export default function AuctionNavBar({ product, className }: AuctionNavBarProps) {
  const {
    endBid,
    startBid,
    totalComment,
    totalBids,
    highestBid,
    minBid,
    mainPrice,
    _id,
  } = product;

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authState, setAuthState] = useState<number>(AUTH_STATES.SIGN_IN);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const router = useRouter();

  const handlePlaceBidClick = () => {
    if (isLoggedIn) {
      setIsBidModalOpen(true);
    } else {
      setRedirectUrl(null);
      setAuthState(AUTH_STATES.SIGN_IN);
      setIsLoginModalOpen(true);
    }
  };

  const handleBuyNowClick = () => {
    if (isLoggedIn) {
      router.push(`/purchase/${_id}`);
    } else {
      setRedirectUrl(`/purchase/${_id}`);
      setAuthState(AUTH_STATES.SIGN_IN);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const parsedHighestBid =
    typeof highestBid === "string" ? parseFloat(highestBid) : highestBid;
  const parsedMinBid = typeof minBid === "string" ? parseFloat(minBid) : minBid;

  const endTime = moment(endBid);
  const startTime = startBid ? moment(startBid) : moment().subtract(1, "day");
  const totalDuration = endTime.diff(startTime, "seconds");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const remaining = endTime.diff(now, "seconds");
      const percent = Math.max(
        0,
        Math.min(100, ((totalDuration - remaining) / totalDuration) * 100)
      );
      setProgress(percent);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, totalDuration]);

  const timeLeft = moment(endBid).fromNow(true);

  const renderAuthContent = () => {
    switch (authState) {
      case AUTH_STATES.SIGN_IN:
        return (
          <SignInPage
            setAuthState={(state) => {
              if (typeof state === "number") setAuthState(state);
              else handleLoginSuccess();
            }}
          />
        );
      case AUTH_STATES.SIGN_UP:
        return <SignUpPage setAuthState={(state) => setAuthState(state)} />;
      case AUTH_STATES.FORGOT_PASSWORD:
        return <ForgotPassword setAuthState={(state) => setAuthState(state)} />;
      default:
        return (
          <SignInPage
            setAuthState={(state) => {
              if (typeof state === "number") setAuthState(state);
              else handleLoginSuccess();
            }}
          />
        );
    }
  };

  return (
    <div className={`${className} hidden md:flex flex-col sticky top-0 z-50`}>
      {/* Status Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white rounded-b-xl shadow-md">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side info */}
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-yellow-300" />
              <span className="font-medium">Time Left:</span>
              <span className="font-semibold">{timeLeft}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpOutlined className="text-green-300" />
              <span className="font-medium">
                {parsedHighestBid > 0
                  ? `Latest Offer: $${parsedHighestBid.toLocaleString()}`
                  : `Minimum Offer: $${parsedMinBid.toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Inquiries:</span>
              <span className="font-semibold">{totalBids}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Comments:</span>
              <span className="font-semibold">{totalComment}</span>
            </div>
          </div>

          {/* Actions (using CustomButton) */}
          <div className="flex gap-3">
            <CustomButton
              label="Send Inquiry"
              variant="primary"
              onClick={handlePlaceBidClick}
            />
            {mainPrice && (
              <CustomButton
                label="Buy Now"
                variant="secondary"
                onClick={handleBuyNowClick}
              />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-3">
          <Progress
            percent={Math.round(progress)}
            showInfo={false}
            strokeColor={{
              from: "#22c55e",
              to: "#ef4444",
            }}
            trailColor="#1e3a8a"
          />
          <p className="text-xs text-gray-200 mt-1">
            Auction ends in {timeLeft}
          </p>
        </div>
      </div>

      {/* Bid Modal */}
      <ModalWrapper isOpen={isBidModalOpen} setIsOpen={setIsBidModalOpen}>
        <MakeBids
          setOpen={setIsBidModalOpen}
          bidInfo={{ highestBid: parsedHighestBid, minBid: parsedMinBid }}
          productId={_id}
        />
      </ModalWrapper>

      {/* Auth Modal */}
      <ModalWrapper isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}>
        {renderAuthContent()}
      </ModalWrapper>
    </div>
  );
}
