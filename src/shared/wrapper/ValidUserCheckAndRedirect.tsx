"use client";

import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { toggleAuthModal } from "@/Redux/Slices/authSlice";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const ValidUserCheckAndRedirect = ({
  children,
  redirectUrl,
  onClick,
}: {
  redirectUrl?: string;
  children: ReactNode;
  onClick?: () => void;
}) => {
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAction = () => {
    if (!isLoggedIn) {
      dispatch(toggleAuthModal());
    } else if (redirectUrl) {
      // If logged in and `redirectUrl` is provided, navigate to the URL
      router.push(redirectUrl);
    } else if (onClick) {
      // If logged in and `onClick` is provided, execute it
      onClick();
    }
  };

  return React.cloneElement(children as React.ReactElement, {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      handleAction();
    },
  });
};

export default ValidUserCheckAndRedirect;
