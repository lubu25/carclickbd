"use client";
import { useAppSelector } from "@/Redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthProtect = ({ children }: any) => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return children;
};

export default AuthProtect;
