"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Dropdown, Drawer, MenuProps } from "antd";
import { DownOutlined, GlobalOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/Redux/hooks";
import CarClickBDLogo from "@/components/shared/CarClickBDLogo";
import { Heart } from "lucide-react";
import { useGetUserWatchListQuery } from "@/Redux/features/watch-list/watchlistApi";
import {
  getLocalWishlist,
  getWishlistUserKey,
  LOCAL_WISHLIST_UPDATED_EVENT,
} from "@/utils/localWishlist";

import dynamic from "next/dynamic";

const ProfileDropdown = dynamic(() => import("./ProfileDropdown"), { ssr: false });
const NavAuth = dynamic(() => import("./NavAuth"), { ssr: false });

const WishlistNavIcon = ({ compact = false }: { compact?: boolean }) => {
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const profile = useAppSelector((state) => state.authReducer.profile);
  const wishlistUserKey = getWishlistUserKey(profile || undefined);
  const [localCount, setLocalCount] = useState(0);
  const { data } = useGetUserWatchListQuery([], {
    skip: !isLoggedIn || profile?.role === "seller",
  });
  const apiProductIds = (data?.data || [])
    .map((item: any) => item?.product?._id)
    .filter(Boolean);
  const count = isLoggedIn
    ? new Set([...apiProductIds, ...getLocalWishlist(wishlistUserKey).map((item) => item._id)]).size || localCount
    : 0;
  const hasItems = count > 0;

  useEffect(() => {
    const updateLocalCount = () => {
      setLocalCount(getLocalWishlist(wishlistUserKey).length);
    };

    updateLocalCount();
    window.addEventListener(LOCAL_WISHLIST_UPDATED_EVENT, updateLocalCount);
    window.addEventListener("storage", updateLocalCount);

    return () => {
      window.removeEventListener(LOCAL_WISHLIST_UPDATED_EVENT, updateLocalCount);
      window.removeEventListener("storage", updateLocalCount);
    };
  }, [wishlistUserKey]);

  return (
    <Link
      href="/wishlist"
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition ${
        hasItems
          ? "border-rose-400/70 bg-rose-500/15 text-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.28)]"
          : "border-white/10 bg-white/10 text-white hover:border-rose-300/70 hover:bg-white/15 hover:text-rose-400"
      }`}
      aria-label="Wishlist"
      title="Wishlist"
    >
      <Heart
        size={compact ? 17 : 18}
        strokeWidth={2.5}
        fill={hasItems ? "currentColor" : "none"}
      />
      {hasItems && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black leading-none text-white ring-2 ring-black">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  if (isLoggedIn === undefined) return null;

  const btnBlue =
    "rounded-full border border-white/10 bg-gradient-to-r from-[#b80f17] to-[#f11b24] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-red-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#9f0d14] hover:to-[#d91620] hover:shadow-md hover:shadow-red-500/30";
  const btnGold =
    "rounded-none border border-[#ffe08a]/70 bg-gradient-to-r from-[#f0b90b] via-[#ffd45a] to-[#f0b90b] px-5 py-2.5 text-sm font-extrabold text-slate-950 shadow-sm shadow-[#f0b90b]/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#ffd45a] hover:via-[#f0b90b] hover:to-[#d9a609] hover:shadow-md hover:shadow-[#f0b90b]/35";
  const btnOutline =
    "relative isolate overflow-hidden rounded-none border border-[#ffe08a]/80 bg-gradient-to-r from-[#f0b90b] via-[#ffd45a] to-[#f0b90b] px-5 py-2.5 text-sm font-black text-slate-950 shadow-sm shadow-[#f0b90b]/30 transition-all duration-300 animate-[redGlowPulse_1.7s_ease-in-out_infinite] before:absolute before:inset-y-0 before:-left-10 before:z-0 before:w-8 before:skew-x-[-18deg] before:bg-white/80 before:blur-sm before:content-[''] before:animate-[verify-shine_2.8s_ease-in-out_infinite] after:pointer-events-none after:absolute after:inset-[-1px] after:z-0 after:rounded-none after:border after:border-[#fff3bf]/80 after:shadow-[0_0_18px_rgba(240,185,11,0.82),inset_0_0_12px_rgba(255,255,255,0.28)] after:content-[''] hover:-translate-y-0.5 hover:from-[#ffd45a] hover:via-[#f0b90b] hover:to-[#d9a609]";

  const languageMenu: MenuProps["items"] = [
    {
      key: "en",
      label: (
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/gb.svg"
            alt="English"
            className="h-3 w-5 rounded-sm border border-gray-200"
          />
          <span>English</span>
        </div>
      ),
    },
    {
      key: "bn",
      label: (
        <div className="flex items-center gap-2">
          <img
            src="https://flagcdn.com/bd.svg"
            alt="Bangla"
            className="h-3 w-5 rounded-sm border border-gray-200"
          />
          <span>বাংলা</span>
        </div>
      ),
    },
  ];

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Duty Calculator", href: "/duty-calculator" },
    { label: "Find Cars", href: "/cars" },
    {
      label: "Production Year Check",
      href: "https://www.jp.center/month",
      external: true,
    },
  ];

  const helpMenu: MenuProps["items"] = [
    {
      key: "how-it-works",
      label: <Link href="/help?tab=how-it-works">How it Works</Link>,
    },
    {
      key: "buying-car",
      label: <Link href="/help?tab=buying-car">Buying a Car</Link>,
    },
    {
      key: "selling-car",
      label: <Link href="/help?tab=selling-car">Selling Car</Link>,
    },
    { key: "faq", label: <Link href="/help?tab=faq">FAQ</Link> },
  ];

  const sellMenu: MenuProps["items"] = [
    { key: "dealer", label: <Link href="/dealer-rules">Dealer</Link> },
    {
      key: "individual",
      label: <Link href="/individual-seller-rules">Individual</Link>,
    },
  ];

  const buyMenu: MenuProps["items"] = [
    { key: "new", label: <Link href="/cars?condition=new">New</Link> },
    {
      key: "reconditioned",
      label: <Link href="/cars?condition=reconditioned">Reconditioned</Link>,
    },
    {
      key: "local-used",
      label: <Link href="/cars?condition=local-used">Local Used</Link>,
    },
    {
      key: "upcoming",
      label: <Link href="/cars?status=upcoming">Upcoming</Link>,
    },
  ];

  const navLinkClass =
    "relative text-sm font-semibold text-gray-200 transition-all duration-300 hover:text-[#ff2a35] after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-[#e50914] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black shadow-lg backdrop-blur-sm">
      <div className="flex min-h-[72px] items-center justify-between gap-2 px-2 py-2 min-[360px]:gap-3 min-[360px]:px-3 sm:px-4 md:min-h-[84px] md:gap-5 md:px-8 md:py-3">
        <Link href="/" className="flex shrink-0 items-center">
          <CarClickBDLogo className="h-12 w-36 min-[360px]:h-[58px] min-[360px]:w-[185px] sm:h-[68px] sm:w-[220px] md:h-[82px] md:w-[260px]" priority />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-4 2xl:flex">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={navLinkClass}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            )
          )}
          <Dropdown menu={{ items: helpMenu }} trigger={["hover"]}>
            <button className={`${navLinkClass} flex items-center gap-1`}>
              Help <DownOutlined className="text-[10px]" />
            </button>
          </Dropdown>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link href="/verify-auction-sheet" className="hidden lg:block">
            <button className={btnOutline}>
              <span className="relative z-10 animate-[verify-text-flicker_1.55s_ease-in-out_infinite]">
                Verify Auction Sheet
              </span>
            </button>
          </Link>

          <Dropdown menu={{ items: buyMenu }} trigger={["hover"]}>
            <button className={`${btnGold} flex items-center gap-1`}>
              Buy your car <DownOutlined className="text-xs" />
            </button>
          </Dropdown>

          <Dropdown menu={{ items: sellMenu }} trigger={["hover"]}>
            <button className={`${btnGold} flex items-center gap-1`}>
              Sell your car <DownOutlined className="text-xs" />
            </button>
          </Dropdown>

          <Dropdown menu={{ items: languageMenu }} placement="bottomRight">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white transition hover:border-[#e50914]/60 hover:bg-white/15 hover:text-[#ff2a35]"
              aria-label="Change language"
            >
              <GlobalOutlined />
            </button>
          </Dropdown>

          <WishlistNavIcon />

          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <NavAuth />
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="hidden text-xl text-white 2xl:hidden lg:block"
          aria-label="Open navigation menu"
        >
          <MenuOutlined />
        </button>

        <div className="flex items-center gap-1.5 lg:hidden min-[360px]:gap-2">
          <Dropdown menu={{ items: languageMenu }}>
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white hover:text-[#ff2a35] min-[360px]:flex"
              aria-label="Change language"
            >
              <GlobalOutlined />
            </button>
          </Dropdown>
          <span className="hidden min-[360px]:inline-flex">
            <WishlistNavIcon compact />
          </span>
          {isLoggedIn ? <ProfileDropdown /> : <NavAuth />}
          <button onClick={() => setOpen(true)} className="text-xl text-white" aria-label="Open navigation menu">
            <MenuOutlined />
          </button>
        </div>
      </div>

      <Drawer
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width="85%"
        maskStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        styles={{
          content: {
            background: "rgba(10, 20, 45, 0.95)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            color: "white",
          },
        }}
        closable={false}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-gray-400 hover:text-white"
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            {isLoggedIn ? (
              <ProfileDropdown />
            ) : (
              <Link href="/login">
                <button className={`${btnBlue} w-full py-3 font-semibold`}>
                  Sign in
                </button>
              </Link>
            )}
          </div>

          <Link href="/verify-auction-sheet" className="mb-5 block">
            <button className={`${btnOutline} w-full py-3`}>
              Verify Auction Sheet
            </button>
          </Link>

          <div className="flex flex-col gap-3 text-base text-gray-200">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-2 border-t border-white/10 pt-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ff2a35]">
                Help
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/help?tab=how-it-works">How it Works</Link>
                <Link href="/help?tab=buying-car">Buying a Car</Link>
                <Link href="/help?tab=selling-car">Selling Car</Link>
                <Link href="/help?tab=faq">FAQ</Link>
              </div>
            </div>
            <Link
              href="/wishlist"
              className="mt-2 inline-flex items-center gap-2 border-t border-white/10 pt-3 font-semibold text-white"
            >
              <Heart size={18} />
              Wishlist
            </Link>
          </div>
        </div>

        <div className="sticky bottom-0 left-0 right-0 grid grid-cols-2 gap-2 border-t border-white/10 bg-[#0b0b0b]/95 p-3">
          <Dropdown menu={{ items: buyMenu }} trigger={["click"]}>
            <button
              className={`${btnGold} flex items-center justify-center gap-1 px-3 py-2.5`}
            >
              Buy your car <DownOutlined />
            </button>
          </Dropdown>
          <Dropdown menu={{ items: sellMenu }} trigger={["click"]}>
            <button
              className={`${btnGold} flex items-center justify-center gap-1 px-3 py-2.5`}
            >
              Sell your car <DownOutlined />
            </button>
          </Dropdown>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
