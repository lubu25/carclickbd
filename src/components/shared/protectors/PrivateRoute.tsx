"use client";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { getTokenInfo } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import LoadingSpinner from "../spinners/loadingSpinner";
import { setLogOut } from "@/Redux/Slices/authSlice";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const [hasHydrated, setHasHydrated] = useState(false);

  const tokenInfo = getTokenInfo();

  useEffect(() => {
    setHasHydrated(true);

    if (!isLoggedIn) {
      dispatch(setLogOut());
      router.push("/auth/signin");
    }
  }, [isLoggedIn, dispatch, router, tokenInfo?.role,]);

  if (!hasHydrated || !isLoggedIn) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
