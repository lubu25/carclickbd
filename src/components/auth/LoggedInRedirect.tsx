"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { getTokenInfo, isLoggedIn } from "@/service/auth.service";
import handleRedirect from "@/utils/handleRedirect";

const LoggedInRedirect = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getTokenInfo();
      message.info("You are already logged in. Please logout first to use this page.");
      handleRedirect(user?.role, router);
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) return null;

  return <>{children}</>;
};

export default LoggedInRedirect;
