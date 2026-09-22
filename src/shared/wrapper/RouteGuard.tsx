"use client";

import { useAppSelector } from "@/Redux/hooks";
import { getTokenInfo } from "@/service/auth.service";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const isCustomerRole = (role?: string) => role === "customer" || role === "buyer";
const isAdminRole = (role?: string) =>
  role === "admin" ||
  role === "super-admin" ||
  role === "agent" ||
  role === "sub-agent";

const RouteGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const profileRole = useAppSelector((state) => state.authReducer.profile?.role);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const tokenInfo = getTokenInfo();
    const userRole = profileRole || tokenInfo?.role;

    if (!isLoggedIn && !tokenInfo) {
      setIsAuthorized(false);
      router.push("/login");
      return;
    }

    if (!userRole) {
      setIsAuthorized(false);
      router.push("/");
      return;
    }

    const restrictedRoutes: Record<string, boolean> = {
      "/admin/create-admin": userRole !== "super-admin",
      "/admin/admins": userRole !== "super-admin",
      "/admin": !isAdminRole(userRole),
      "/seller": userRole !== "seller",
      "/customer": !isCustomerRole(userRole),
      "/profile": userRole === "admin" || userRole === "super-admin",
    };

    for (const route in restrictedRoutes) {
      if (pathname.startsWith(route) && restrictedRoutes[route]) {
        setIsAuthorized(false);
        router.push("/");
        return;
      }
    }

    setIsAuthorized(true);
  }, [isLoggedIn, pathname, profileRole, router]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <section className="min-h-screen">{children}</section>;
};

export default RouteGuard;
