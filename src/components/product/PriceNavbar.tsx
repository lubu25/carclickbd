"use client";

import moment from "moment";
import { useState } from "react";
import ModalWrapper from "@/shared/modal/ModalWrapper";
import MakeBids from "./MakeBids";
import SignInPage from "@/components/auth/signin";
import SignUpPage from "@/components/auth/signup";
import ForgotPassword from "@/components/auth/forgotPassword";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import { IProduct } from "@/Interface/product";
import CustomButton from "@/components/shared/CustomButton"; // ✅ your reusable button

const AUTH_STATES = {
  SIGN_IN: 0,
  SIGN_UP: 1,
  FORGOT_PASSWORD: 3,
};

export interface AuctionNavBarProps {
  product: IProduct;
  className?: string;
}

export default function PriceNavbar({ product, className }: AuctionNavBarProps) {
  const { totalComment, highestBid, minBid, mainPrice, _id } = product;

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authState, setAuthState] = useState<number>(AUTH_STATES.SIGN_IN);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const router = useRouter();

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
    <div
      className={`${className} hidden md:flex flex-col sticky top-0 z-50`}
    >
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-secondary text-white px-6 py-2 shadow-md">
        {/* Left Info */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold uppercase text-gray-200 tracking-wide">
              Price:
            </span>
            <span className="text-2xl font-bold text-yellow-300">
              ${mainPrice?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="uppercase text-gray-200 tracking-wide">
              Comments:
            </span>
            <span className="font-semibold">{totalComment}</span>
          </div>
        </div>

        {/* Actions */}
        <div>
          {mainPrice && (
            <CustomButton
              label="Order Now"
              variant="primary"
              onClick={handleBuyNowClick}
            />
          )}
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
