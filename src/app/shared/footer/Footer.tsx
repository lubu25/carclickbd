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

const mobilePaymentMethods = [
  { label: "VISA", className: "font-black italic text-[#1a1f71]" },
  { label: "Mastercard", className: "font-extrabold text-[#eb001b]" },
  { label: "AMEX", className: "font-black text-[#176fc1]" },
  { label: "DBBL Nexus", className: "font-bold text-[#157347]" },
  { label: "UnionPay", className: "font-bold text-[#237b8d]" },
  { label: "Rocket", className: "font-black text-[#8c36a8]" },
  { label: "bKash", className: "font-black text-[#d12053]" },
  { label: "OK", className: "font-black text-[#bd9b00]" },
  { label: "Tap", className: "font-black text-[#d64c62]" },
  { label: "MeghnaPay", className: "font-bold text-[#22a6b1]" },
  { label: "Nagad", className: "font-black text-[#ed6a28]" },
  { label: "mCash", className: "font-bold text-[#168267]" },
  { label: "Upay", className: "font-black text-[#625b9a]" },
  { label: "CellFin", className: "font-bold text-[#168267]" },
];

const Footer = ({ showPaymentBanner = false }: { showPaymentBanner?: boolean }) => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {showPaymentBanner && (
        <section
          aria-label="Secure payment methods"
          className="border-y border-slate-200 bg-white"
        >
          <div className="mx-auto hidden max-w-[1440px] px-4 py-5 md:block">
            <Image
              src="/assets/shared/payment-methods-verified-eps.png"
              alt="Pay with Visa, Mastercard, American Express, DBBL Nexus, UnionPay, Rocket, bKash, OK, Tap, MeghnaPay, Nagad, mCash, Upay and CellFin. Verified by EPS Easy Payment System."
              width={2000}
              height={360}
              className="h-auto w-full"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 md:hidden">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-base font-extrabold text-emerald-800">
                Pay securely with
              </p>
              <div
                className="flex items-center gap-2"
                aria-label="Verified by EPS Easy Payment System"
              >
                <span className="flex gap-0.5" aria-hidden="true">
                  <span className="h-4 w-1.5 rounded-sm bg-emerald-700" />
                  <span className="h-4 w-1.5 rounded-sm bg-rose-600" />
                  <span className="h-4 w-1.5 rounded-sm bg-emerald-700" />
                </span>
                <span className="text-xl font-black italic tracking-tight text-rose-600">
                  EPS
                </span>
              </div>
            </div>
            <ul className="grid grid-cols-3 gap-2">
              {mobilePaymentMethods.map((method) => (
                <li
                  key={method.label}
                  className="flex min-h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-center shadow-sm"
                >
                  <span className={`text-xs ${method.className}`}>
                    {method.label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-center text-[10px] font-medium tracking-[0.16em] text-slate-500">
              EASY PAYMENT SYSTEM
            </p>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.6fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <CarClickBDLogo className="h-[68px] w-[220px]" />
            </Link>
            <p className="mt-4 max-w-md text-sm font-medium leading-7 text-slate-400">
              A cleaner way to browse verified cars, compare details, verify
              auction sheets, and contact sellers with confidence.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={`https://wa.me/${siteContact.whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <FaWhatsapp size={17} className="text-[#f0b90b]" />
                <span>{siteContact.whatsapp}</span>
              </a>
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-[#f0b90b]" />
                <span>{siteContact.email}</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={16} className="text-[#f0b90b]" />
                <span>
                  <span className="block font-bold text-slate-200">
                    {siteContact.company}
                  </span>
                  {siteContact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white transition hover:border-[#e50914] hover:bg-[#e50914] hover:text-white"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-7 md:grid-cols-5">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#f0b90b]">
                  {column.title}
                </h4>
                <ul className="mt-4 space-y-3 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-400 transition hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="font-medium text-slate-400 transition hover:text-white"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm">
          <p className="text-slate-500">
            Copyright © 2026 CarClickBD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
