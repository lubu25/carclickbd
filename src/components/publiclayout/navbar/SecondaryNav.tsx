"use client";

import React from "react";
import Link from "next/link";
import { Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";

const inventoryMenu: MenuProps["items"] = [
  { key: "1", label: <Link href="/cars">Cars</Link> },
  { key: "2", label: <Link href="/cars?bodyStyle=truck">Trucks</Link> },
  { key: "3", label: <Link href="/cars?bodyStyle=suv/crossover">SUVs</Link> },
];

const auctionsMenu: MenuProps["items"] = [
  { key: "1", label: <Link href="/cars">All Cars</Link> },
  { key: "2", label: <Link href="/cars?condition=new">New Cars</Link> },
  { key: "3", label: <Link href="/cars?condition=reconditioned">Reconditioned Cars</Link> },
];

const servicesMenu: MenuProps["items"] = [
  { key: "1", label: <Link href="/shipping">Shipping</Link> },
  { key: "2", label: <Link href="/photoguide">Inspection Guide</Link> },
  { key: "3", label: <Link href="/payments">Payments</Link> },
];

const sellMenu: MenuProps["items"] = [
  { key: "dealer", label: <Link href="/dealer-rules">Dealer</Link> },
  { key: "individual", label: <Link href="/individual-seller-rules">Individual</Link> },
];

const SecondaryNav: React.FC = () => {
  return (
    <nav className="sticky top-[68px] z-40 bg-gradient-to-r from-[#0d0d10]/90 via-[#12121c]/90 to-[#0f1828]/90 backdrop-blur-md border-b border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.3)] hidden lg:block transition-all duration-500">
      <div className="flex items-center justify-between px-6 md:px-12 py-3 text-sm font-medium text-gray-200">
        {/* LEFT SIDE LINKS */}
        <div className="flex items-center gap-8">
          {/* Link style (underline on hover) */}
          <Link
            href="/how-it-works"
            className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
          >
            How it works
          </Link>

          <Dropdown menu={{ items: inventoryMenu }} trigger={["hover"]}>
            <a
              onClick={(e) => e.preventDefault()}
              className="relative flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-all duration-300 after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Inventory <DownOutlined className="text-xs" />
            </a>
          </Dropdown>

          <Dropdown menu={{ items: auctionsMenu }} trigger={["hover"]}>
            <a
              onClick={(e) => e.preventDefault()}
              className="relative flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-all duration-300 after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Listings <DownOutlined className="text-xs" />
            </a>
          </Dropdown>

          <Link
            href="/contact"
            className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
          >
            Locations
          </Link>

          <Dropdown menu={{ items: servicesMenu }} trigger={["hover"]}>
            <a
              onClick={(e) => e.preventDefault()}
              className="relative flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition-all duration-300 after:absolute after:left-0 after:bottom-[-3px] after:w-0 after:h-[2px] after:bg-yellow-400 hover:after:w-full after:transition-all after:duration-300"
            >
              Services & support <DownOutlined className="text-xs" />
            </a>
          </Dropdown>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-3">
          <Link href="/help">
            <button className="bg-white/10 border border-white/20 text-gray-200 hover:text-white px-4 py-2 rounded-full font-medium hover:bg-white/20 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-all duration-300">
              Help center
            </button>
          </Link>

          <Dropdown menu={{ items: sellMenu }} trigger={["hover"]}>
            <button className="bg-gradient-to-r from-[#d5101b] to-[#ff2a35] text-white font-semibold px-5 py-2 rounded-full hover:from-[#b80f17] hover:to-[#e50914] hover:shadow-[0_0_15px_rgba(229,9,20,0.55)] transition-all duration-300 flex items-center gap-1">
              Sell your car <DownOutlined className="text-xs" />
            </button>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav;
