"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { getTokenInfo, isLoggedIn } from "@/service/auth.service";
import handleRedirect from "@/utils/handleRedirect";

type AuthAwareSignupLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

const AuthAwareSignupLink = ({
  href,
  children,
  className,
}: AuthAwareSignupLinkProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (isLoggedIn()) {
      const user = getTokenInfo();
      message.info("You are already logged in. Please logout first to create another account.");
      handleRedirect(user?.role, router);
      return;
    }

    router.push(href);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default AuthAwareSignupLink;
