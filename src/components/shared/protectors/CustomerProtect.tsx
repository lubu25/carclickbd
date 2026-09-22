"use client";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setLogOut } from "@/Redux/Slices/authSlice";
import { getTokenInfo } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import PageLoader from "../spinners/PageLoader";

interface PrivateRouteProps {
  children: ReactNode;
}

const CustomerProtect = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const profileRole = useAppSelector((state) => state.authReducer.profile?.role);

  const [hasHydrated, setHasHydrated] = useState(false);
  const tokenInfo = getTokenInfo();

  useEffect(() => {
    setHasHydrated(true);
    const userRole = profileRole || tokenInfo?.role;

    if (!isLoggedIn) {
      dispatch(setLogOut());
      router.push("/");
      return;
    }

    if (!(userRole === "customer" || userRole === "buyer")) {
      router.push("/");
    }
  }, [isLoggedIn, dispatch, router, profileRole, tokenInfo?.role]);

  if (!hasHydrated || !isLoggedIn) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default CustomerProtect;
