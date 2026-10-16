"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Mail, MapPin } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";
import { siteContact } from "@/constants/siteContact";
import CarClickBDLogo from "@/components/shared/CarClickBDLogo";

const footerColumns = [
  {
    title: "Browse",
    links: [
      { label: "Duty Calculator", href: "/duty-calculator" },
      { label: "Find Cars", href: "/cars" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Verify",
    links: [
      { label: "Verify Auction Sheet", href: "/verify-auction-sheet" },
      {
        label: "Production Year Check",
        href: "https://www.jp.center/month",
        external: true,
      },
    ],
  },
  {
    title: "Buy & Sell",
    links: [
      { label: "Buy your car", href: "/cars" },
      { label: "Dealer", href: "/dealer-rules" },
      { label: "Individual", href: "/individual-seller-rules" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "How it Works", href: "/help?tab=how-it-works" },
      { label: "Buying a Car", href: "/help?tab=buying-car" },
      { label: "Selling Car", href: "/help?tab=selling-car" },
      { label: "FAQ", href: "/help?tab=faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms-service" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/CarClickBD", icon: FacebookOutlined },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramOutlined },
  { label: "TikTok", href: "https://tiktok.com", icon: SiTiktok },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedinOutlined },
  { label: "YouTube", href: "https://youtube.com", icon: YoutubeOutlined },
];

const Footer = ({ showPaymentBanner = false }: { showPaymentBanner?: boolean }) => {
  return (
    <footer className="relative bg-white" style={{ borderTop: "1px solid #e8edf5" }}>

      {/* Top accent bar */}
      <div
        style={{
          height: "3px",
          background:
            "linear-gradient(90deg, #e50914 0%, #ff6b6b 35%, #f0b90b 65%, #e50914 100%)",
        }}
      />

      {/* Main body */}
      <div style={{ background: "linear-gradient(180deg, #f8fafd 0%, #ffffff 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr]">

            {/* Left: Brand + contact */}
            <div>
              <Link href="/" className="inline-flex items-center">
                <CarClickBDLogo className="h-[64px] w-[210px]" />
              </Link>

              <p
                className="mt-4 max-w-sm text-sm leading-7"
                style={{ color: "#64748b" }}
              >
                A cleaner way to browse verified cars, compare details, verify
                auction sheets, and contact sellers with confidence.
              </p>

              {/* Contact rows */}
              <div className="mt-6 space-y-3">
                <a
                  href={`https://wa.me/${siteContact.whatsappDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm transition-all duration-200"
                  style={{ color: "#475569" }}
                >
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-105"
                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                  >
                    <FaWhatsapp size={15} />
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-[#e50914]">
                    {siteContact.whatsapp}
                  </span>
                </a>

                <div
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "#475569" }}
                >
                  <span
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#eff6ff", color: "#2563eb" }}
                  >
                    <Mail size={14} />
                  </span>
                  <span>{siteContact.email}</span>
                </div>

                <div
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "#475569" }}
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#fff7ed", color: "#ea580c" }}
                  >
                    <MapPin size={14} />
                  </span>
                  <span className="leading-6">
                    <span
                      className="block text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "#0f172a" }}
                    >
                      {siteContact.company}
                    </span>
                    {siteContact.addressLines.map((line) => (
                      <span
                        key={line}
                        className="block text-sm"
                        style={{ color: "#64748b" }}
                      >
                        {line}
                      </span>
                    ))}
                  </span>
                </div>
              </div>


              {/* Mobile divider */}
              <div className="mt-8 h-px w-full bg-slate-200/70 lg:hidden" />
            </div>

            {/* Right: Nav columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-5 lg:pt-[72px]">
              {footerColumns.map((column, idx) => {
                const isCompanyColumn = idx === footerColumns.length - 1; // 5th column (Company)
                return (
                  <div
                    key={column.title}
                    className={
                      isCompanyColumn
                        ? "col-span-2 pt-4 border-t border-slate-100 sm:col-span-1 sm:pt-0 sm:border-0"
                        : ""
                    }
                  >
                    <h4
                      className="mb-3.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em]"
                      style={{ color: "#0f172a" }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ background: "#e50914" }}
                      />
                      {column.title}
                    </h4>
                    <ul
                      className={
                        isCompanyColumn
                          ? "grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:flex-col sm:gap-0.5"
                          : "flex flex-col gap-0.5"
                      }
                    >
                      {column.links.map((link) =>
                        link.external ? (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block py-1.5 text-sm font-medium transition-all duration-200"
                              style={{ color: "#64748b" }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.color = "#e50914";
                                el.style.paddingLeft = "4px";
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.color = "#64748b";
                                el.style.paddingLeft = "0px";
                              }}
                            >
                              {link.label}
                            </a>
                          </li>
                        ) : (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="inline-block py-1.5 text-sm font-medium transition-all duration-200"
                              style={{ color: "#64748b" }}
                              onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.color = "#e50914";
                                el.style.paddingLeft = "4px";
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLAnchorElement;
                                el.style.color = "#64748b";
                                el.style.paddingLeft = "0px";
                              }}
                            >
                              {link.label}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div
            className="mt-12"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent)",
            }}
          />
        </div>
      </div>

      {/* Payment methods band */}
      <div
        style={{
          background: "#f8fafd",
          borderTop: "1px solid #e8edf5",
          borderBottom: "1px solid #e8edf5",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <Image
            src="/assets/shared/payment-methods-eps-slim.png"
            alt="Pay with Visa, Mastercard, American Express, DBBL Nexus, UnionPay, Rocket, bKash, OK, Tap, MeghnaPay, Nagad, mCash, Upay and CellFin. Verified by EPS Easy Payment System."
            width={2000}
            height={200}
            quality={100}
            unoptimized
            className="mx-auto h-auto w-full max-w-[900px] object-contain"
          />
        </div>
      </div>

      {/* Copyright bar */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(90deg, #0b1727 0%, #102a45 50%, #0b1727 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Subtle top light effect */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4) 50%, transparent)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-xs text-slate-300">
              Copyright © 2026{" "}
              <span className="font-semibold text-white">
                CarClickBD
              </span>
              . All rights reserved.
            </p>

            {/* Social media icons in the center */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="group inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                    style={{
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      background: "rgba(255, 255, 255, 0.07)",
                      color: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = "#ffffff";
                      el.style.background = "#ffffff";
                      el.style.color = "#0b1727";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      el.style.background = "rgba(255, 255, 255, 0.07)";
                      el.style.color = "#ffffff";
                    }}
                  >
                    <Icon className="text-[14px] transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {[
                { label: "Privacy", href: "/privacy-policy" },
                { label: "Terms", href: "/terms-service" },
                { label: "Cookies", href: "/cookie-policy" },
              ].map((item, idx, arr) => (
                <React.Fragment key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                  {idx < arr.length - 1 && (
                    <span className="text-slate-600">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
