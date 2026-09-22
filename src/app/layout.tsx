import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import QueryProvider from "@/lib/query-provider";
import ChunkLoadRecovery from "@/components/ChunkLoadRecovery";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://carclickbd.com"),
  title: "CarClickBD",
  description:
    "CarClickBD is a car marketplace for browsing verified vehicle listings, comparing details, contacting sellers, and managing dealer or private seller listings from one simple platform.",
  keywords:
    "car marketplace, used cars Bangladesh, reconditioned cars, vehicle listings, dealer dashboard, seller dashboard, buy car, sell car, CarClickBD",
  authors: [
    {
      name: "CarClickBD",
      url: "https://carclickbd.com",
    },
  ],
  creator: "CarClickBD",
  publisher: "CarClickBD",
  openGraph: {
    title: "CarClickBD",
    description:
      "CarClickBD is a car marketplace for browsing verified vehicle listings, comparing details, contacting sellers, and managing dealer or private seller listings.",
    url: "https://carclickbd.com",
    siteName: "CarClickBD",
    images: [
      {
        url: "/assets/shared/car.png",
        alt: "CarClickBD",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarClickBD",
    description:
      "Browse verified vehicle listings and compare car details on CarClickBD.",
    images: ["/assets/shared/car.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChunkLoadRecovery />
        <QueryProvider>
          <Providers>{children}</Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
