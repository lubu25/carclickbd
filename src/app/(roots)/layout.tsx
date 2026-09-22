"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/publiclayout/navbar";
import AppFooter from "../shared/footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hideFooterPaths = [
    "/user",
    "/my-products",
    "/live-auction",
    "/auction-comments",
  ];
  const shouldShowFooter = !hideFooterPaths.includes(pathname);

  return (
    <main className="min-w-0 overflow-x-hidden">
      <Navbar />
      <div className="min-w-0">{children}</div>
      {shouldShowFooter && <AppFooter />}
    </main>
  );
}
