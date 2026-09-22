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

const AdminProtect = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);

  const [hasHydrated, setHasHydrated] = useState(false);
  const tokenInfo = getTokenInfo();

  useEffect(() => {
    setHasHydrated(true);
    if (!isLoggedIn) {
      dispatch(setLogOut());
      router.push("/");
      return;
    }

    if (
      !(
        tokenInfo?.role === "admin" ||
        tokenInfo?.role === "super-admin"
      )
    ) {
      dispatch(setLogOut()); 
      router.push("/"); 
    }
  }, [isLoggedIn, dispatch, router, tokenInfo?.role]);

  if (!hasHydrated || !isLoggedIn) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default AdminProtect;
