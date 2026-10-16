"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dropdown, Drawer, MenuProps } from "antd";
import { DownOutlined, GlobalOutlined, MenuOutlined } from "@ant-design/icons";
import {
  Home,
  Calculator,
  Car,
  CalendarCheck,
  HelpCircle,
  ShieldCheck,
  Tag,
  Heart,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  X,
  ChevronRight,
} from "lucide-react";
import { useAppSelector } from "@/Redux/hooks";
import CarClickBDLogo from "@/components/shared/CarClickBDLogo";
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
      className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 ${
        hasItems
          ? "border-rose-300 bg-rose-50 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.25)]"
          : "border-slate-200/90 bg-slate-100/90 text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
      }`}
      aria-label="Wishlist"
      title="Wishlist"
    >
      <Heart
        size={compact ? 16 : 17}
        strokeWidth={2.3}
        fill={hasItems ? "currentColor" : "none"}
      />
      {hasItems && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black leading-none text-white ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  if (isLoggedIn === undefined) return null;

  const isHomeActive = pathname === "/";
  const isDutyActive = Boolean(pathname?.startsWith("/duty-calculator"));
  const isCarsActive = Boolean(
    pathname?.startsWith("/cars") ||
      pathname?.startsWith("/car-details") ||
      pathname?.startsWith("/auction-details")
  );
  const isHelpActive = Boolean(
    pathname?.startsWith("/help") ||
      pathname?.startsWith("/how-it-works") ||
      pathname?.startsWith("/faq")
  );
  const isVerifyActive = Boolean(pathname?.startsWith("/verify-auction-sheet"));

  const languageMenu: MenuProps["items"] = [
    {
      key: "en",
      label: (
        <div className="flex items-center gap-2.5 py-1">
          <img
            src="https://flagcdn.com/gb.svg"
            alt="English"
            className="h-3.5 w-5 rounded-xs border border-gray-200 object-cover shadow-2xs"
          />
          <span className="text-xs font-semibold text-slate-800">English</span>
        </div>
      ),
    },
    {
      key: "bn",
      label: (
        <div className="flex items-center gap-2.5 py-1">
          <img
            src="https://flagcdn.com/bd.svg"
            alt="Bangla"
            className="h-3.5 w-5 rounded-xs border border-gray-200 object-cover shadow-2xs"
          />
          <span className="text-xs font-semibold text-slate-800">বাংলা</span>
        </div>
      ),
    },
  ];

  const helpMenu: MenuProps["items"] = [
    {
      key: "how-it-works",
      label: (
        <Link href="/help?tab=how-it-works" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BookOpen size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">How It Works</div>
            <div className="text-[10px] text-slate-500">Step by step buying guide</div>
          </div>
        </Link>
      ),
    },
    {
      key: "buying-car",
      label: (
        <Link href="/help?tab=buying-car" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Car size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Buying a Car</div>
            <div className="text-[10px] text-slate-500">Auction sheet & duty guides</div>
          </div>
        </Link>
      ),
    },
    {
      key: "selling-car",
      label: (
        <Link href="/help?tab=selling-car" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Tag size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Selling Car</div>
            <div className="text-[10px] text-slate-500">Guidelines for private & dealers</div>
          </div>
        </Link>
      ),
    },
    {
      key: "faq",
      label: (
        <Link href="/help?tab=faq" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <HelpCircle size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">FAQ</div>
            <div className="text-[10px] text-slate-500">Frequently answered questions</div>
          </div>
        </Link>
      ),
    },
  ];

  const sellMenu: MenuProps["items"] = [
    {
      key: "dealer",
      label: (
        <Link href="/dealer-rules" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Car size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Dealer Portal</div>
            <div className="text-[10px] text-slate-500">Showroom inventory & bulk upload</div>
          </div>
        </Link>
      ),
    },
    {
      key: "individual",
      label: (
        <Link href="/individual-seller-rules" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Tag size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Individual Seller</div>
            <div className="text-[10px] text-slate-500">Sell your personal car directly</div>
          </div>
        </Link>
      ),
    },
  ];

  const buyMenu: MenuProps["items"] = [
    {
      key: "new",
      label: (
        <Link href="/cars?condition=new" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <Sparkles size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Brand New Cars</div>
            <div className="text-[10px] text-slate-500">0 km showroom fresh condition</div>
          </div>
        </Link>
      ),
    },
    {
      key: "reconditioned",
      label: (
        <Link href="/cars?condition=reconditioned" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Car size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Reconditioned</div>
            <div className="text-[10px] text-slate-500">Japan auction imported verified</div>
          </div>
        </Link>
      ),
    },
    {
      key: "local-used",
      label: (
        <Link href="/cars?condition=local-used" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Local Used</div>
            <div className="text-[10px] text-slate-500">Registered in Bangladesh</div>
          </div>
        </Link>
      ),
    },
    {
      key: "upcoming",
      label: (
        <Link href="/cars?status=upcoming" className="flex items-center gap-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <CalendarCheck size={14} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Upcoming Auctions</div>
            <div className="text-[10px] text-slate-500">Pre-order live upcoming vehicles</div>
          </div>
        </Link>
      ),
    },
  ];

  const pillBaseClass =
    "group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 active:scale-95 select-none";
  const pillActiveClass =
    "bg-[#1a56db] text-white font-bold shadow-[0_3px_12px_rgba(26,86,219,0.35)] ring-1 ring-blue-400/30";
  const pillInactiveClass =
    "text-slate-700 hover:text-[#1a56db] hover:bg-blue-50 font-medium";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
      {/* Top accent line — blue brand gradient */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#1a56db]" />

      <div className="mx-auto flex max-w-[1720px] items-center justify-between gap-3 px-3 py-2.5 sm:px-6 md:py-3 lg:gap-4 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.02]">
          <CarClickBDLogo
            className="h-10 w-32 min-[360px]:h-11 min-[360px]:w-36 sm:h-12 sm:w-44 md:h-[52px] md:w-48"
            priority
          />
        </Link>

        {/* Center Navigation Tabs */}
        <nav className="hidden xl:flex items-center">
          <div className="flex items-center gap-0.5">
            {/* Home Pill */}
            <Link
              href="/"
              className={`${pillBaseClass} ${isHomeActive ? pillActiveClass : pillInactiveClass}`}
            >
              <Home
                size={14}
                className={isHomeActive ? "text-white" : "text-slate-500 group-hover:text-slate-900 transition-colors"}
              />
              <span>Home</span>
              {isHomeActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)] animate-pulse" />
              )}
            </Link>

            {/* Duty Calculator Pill */}
            <Link
              href="/duty-calculator"
              className={`${pillBaseClass} ${isDutyActive ? pillActiveClass : pillInactiveClass}`}
            >
              <Calculator
                size={14}
                className={isDutyActive ? "text-white" : "text-slate-400 group-hover:text-[#1a56db] transition-colors"}
              />
              <span>Duty Calculator</span>
              {isDutyActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
              )}
            </Link>

            {/* Find Cars Pill */}
            <Link
              href="/cars"
              className={`${pillBaseClass} ${isCarsActive ? pillActiveClass : pillInactiveClass}`}
            >
              <Car
                size={14}
                className={isCarsActive ? "text-white" : "text-slate-400 group-hover:text-[#1a56db] transition-colors"}
              />
              <span>Find Cars</span>
              {isCarsActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
              )}
            </Link>

            {/* Production Year Check Pill */}
            <a
              href="https://www.jp.center/month"
              target="_blank"
              rel="noreferrer"
              className={`${pillBaseClass} ${pillInactiveClass}`}
            >
              <CalendarCheck
                size={14}
                className="text-slate-400 group-hover:text-[#1a56db] transition-colors"
              />
              <span>Production Year</span>
              <ExternalLink size={11} className="text-slate-300 group-hover:text-[#1a56db]" />
            </a>

            {/* Help Dropdown Pill */}
            <Dropdown menu={{ items: helpMenu }} trigger={["hover"]} placement="bottom">
              <button
                type="button"
                className={`${pillBaseClass} ${isHelpActive ? pillActiveClass : pillInactiveClass}`}
              >
                <HelpCircle
                  size={14}
                  className={isHelpActive ? "text-white" : "text-slate-400 group-hover:text-[#1a56db] transition-colors"}
                />
                <span>Help</span>
                <DownOutlined
                  className={`text-[9px] ${
                    isHelpActive ? "text-white" : "text-slate-300 group-hover:text-[#1a56db]"
                  }`}
                />
                {isHelpActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                )}
              </button>
            </Dropdown>
          </div>
        </nav>

        {/* Right Action Controls */}
        <div className="hidden lg:flex shrink-0 items-center gap-2">
          {/* Verify Auction Sheet Button */}
          <Link href="/verify-auction-sheet" className="shrink-0">
            <button
              type="button"
              className={`group relative overflow-hidden rounded-lg border border-amber-400 bg-gradient-to-r from-[#f0b90b] to-[#f5c842] px-4 py-2 text-[13px] font-extrabold text-slate-900 shadow-[0_2px_10px_rgba(240,185,11,0.3)] transition-all duration-200 hover:shadow-[0_4px_18px_rgba(240,185,11,0.45)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 ${
                isVerifyActive ? "ring-2 ring-amber-400 ring-offset-1" : ""
              }`}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <ShieldCheck size={15} className="stroke-[2.5]" />
              <span>Verify Auction Sheet</span>
            </button>
          </Link>

          {/* Buy your car Button */}
          <Dropdown menu={{ items: buyMenu }} trigger={["hover"]} placement="bottom">
            <button
              type="button"
              className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 text-[13px] font-bold text-blue-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-800 active:scale-95"
            >
              <Car size={14} className="text-blue-500 group-hover:text-blue-700 transition-colors" />
              <span>Buy your car</span>
              <DownOutlined className="text-[10px] text-blue-400 group-hover:text-blue-700" />
            </button>
          </Dropdown>

          {/* Sell your car Button */}
          <Dropdown menu={{ items: sellMenu }} trigger={["hover"]} placement="bottom">
            <button
              type="button"
              className="group flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[13px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0"
            >
              <Tag size={13} className="text-amber-400" />
              <span>Sell your car</span>
              <DownOutlined className="text-[10px] text-slate-400 group-hover:text-white" />
            </button>
          </Dropdown>

          {/* Language Switcher */}
          <Dropdown menu={{ items: languageMenu }} placement="bottomRight" trigger={["hover"]}>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:scale-105 shadow-sm"
              aria-label="Change language"
              title="Change language"
            >
              <GlobalOutlined className="text-[15px]" />
            </button>
          </Dropdown>

          {/* Wishlist Icon */}
          <WishlistNavIcon />

          {/* User Authentication / Profile */}
          {isLoggedIn ? <ProfileDropdown /> : <NavAuth />}
        </div>

        {/* Mobile / Tablet Menu Button (Visible below XL) */}
        <div className="flex items-center gap-1.5 xl:hidden">
          {/* Quick Verify button on tablet */}
          <Link href="/verify-auction-sheet" className="hidden sm:block md:hidden">
            <button
              type="button"
              className="rounded-full border border-amber-300/80 bg-gradient-to-r from-[#f0b90b] to-[#ffd359] px-3 py-1.5 text-xs font-black text-slate-950 shadow-xs"
            >
              Verify Sheet
            </button>
          </Link>

          <span className="hidden min-[380px]:inline-flex">
            <WishlistNavIcon compact />
          </span>

          {isLoggedIn ? <ProfileDropdown /> : <NavAuth />}

          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/90 bg-slate-100 text-slate-800 transition-colors hover:bg-slate-200"
            aria-label="Open navigation menu"
          >
            <MenuOutlined className="text-base" />
          </button>
        </div>
      </div>

      {/* Modern Luxury Mobile Drawer */}
      <Drawer
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width="88%"
        maskStyle={{ backgroundColor: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(4px)" }}
        styles={{
          content: {
            background: "#ffffff",
            color: "#0f172a",
          },
          body: {
            padding: 0,
          },
        }}
        closable={false}
      >
        <div className="flex h-full flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <CarClickBDLogo className="h-9 w-32" />
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Primary Action Button */}
            <Link
              href="/verify-auction-sheet"
              onClick={() => setOpen(false)}
              className="mb-4 block"
            >
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-gradient-to-r from-[#f0b90b] via-[#ffd359] to-[#f0b90b] py-3 text-sm font-extrabold text-slate-950 shadow-md shadow-amber-400/20"
              >
                <ShieldCheck size={18} className="stroke-[2.5]" />
                <span>Verify Auction Sheet</span>
              </button>
            </Link>

            {/* Navigation Pill List */}
            <div className="space-y-1.5">
              <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </p>

              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                  isHomeActive
                    ? "bg-gradient-to-r from-[#d91620] to-[#b80f17] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home size={16} />
                  <span>Home</span>
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </Link>

              <Link
                href="/duty-calculator"
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                  isDutyActive
                    ? "bg-gradient-to-r from-[#d91620] to-[#b80f17] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calculator size={16} />
                  <span>Duty Calculator</span>
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </Link>

              <Link
                href="/cars"
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                  isCarsActive
                    ? "bg-gradient-to-r from-[#d91620] to-[#b80f17] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Car size={16} />
                  <span>Find Cars</span>
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </Link>

              <a
                href="https://www.jp.center/month"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck size={16} />
                  <span>Production Year Check</span>
                </div>
                <ExternalLink size={14} className="opacity-60" />
              </a>

              <Link
                href="/wishlist"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={16} className="text-rose-500" />
                  <span>My Wishlist</span>
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </Link>
            </div>

            {/* Buy & Sell Quick Links */}
            <div className="mt-5 space-y-1.5">
              <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Explore Cars
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cars?condition=new"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Brand New
                </Link>
                <Link
                  href="/cars?condition=reconditioned"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Reconditioned
                </Link>
                <Link
                  href="/cars?condition=local-used"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Local Used
                </Link>
                <Link
                  href="/cars?status=upcoming"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Upcoming
                </Link>
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-5 space-y-1">
              <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Help & Guides
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold text-slate-600">
                <Link
                  href="/help?tab=how-it-works"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  How it Works
                </Link>
                <Link
                  href="/help?tab=buying-car"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  Buying Guide
                </Link>
                <Link
                  href="/help?tab=selling-car"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  Selling Guide
                </Link>
                <Link
                  href="/help?tab=faq"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="border-t border-slate-100 bg-slate-50/80 p-4">
            <div className="grid grid-cols-2 gap-2">
              <Dropdown menu={{ items: buyMenu }} trigger={["click"]}>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <Car size={14} />
                  <span>Buy Car</span>
                  <DownOutlined className="text-[9px]" />
                </button>
              </Dropdown>

              <Dropdown menu={{ items: sellMenu }} trigger={["click"]}>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-2xs"
                >
                  <Tag size={13} className="text-amber-400" />
                  <span>Sell Car</span>
                  <DownOutlined className="text-[9px]" />
                </button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
