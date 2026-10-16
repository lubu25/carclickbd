"use client";
import React from "react";
import {
  FacebookFilled,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { SiTiktok } from "react-icons/si";
import { motion } from "framer-motion";

const FollowUs = () => {
  const socials = [
    {
      icon: <FacebookFilled />,
      href: "https://facebook.com/CarClickBD",
      label: "Facebook",
      hoverClass: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white",
    },
    {
      icon: <InstagramOutlined />,
      href: "https://instagram.com",
      label: "Instagram",
      hoverClass: "hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white",
    },
    {
      icon: <SiTiktok />,
      href: "https://tiktok.com",
      label: "TikTok",
      hoverClass: "hover:bg-black hover:border-black hover:text-white",
    },
    {
      icon: <LinkedinOutlined />,
      href: "https://linkedin.com",
      label: "LinkedIn",
      hoverClass: "hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white",
    },
    {
      icon: <YoutubeOutlined />,
      href: "https://youtube.com",
      label: "YouTube",
      hoverClass: "hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-slate-200/80 bg-gradient-to-b from-white to-[#f8faff] py-16 text-center">
      {/* Square dot grid texture (চার কোণা ডটের ডট ডট প্যাটার্ন) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="squareDotGrid"
              x="0"
              y="0"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <rect x="2" y="2" width="2.5" height="2.5" fill="#3b82f6" rx="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#squareDotGrid)" />
        </svg>
      </div>

      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-4xl px-4"
      >
        <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Follow Us
        </h2>
        <p className="mb-8 text-sm text-slate-600 md:text-base">
          Stay connected with{" "}
          <span className="font-semibold text-[#0b4df5]">CarClickBD</span> — join
          our growing community across social media.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {socials.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition-all duration-300 ${s.hoverClass}`}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>

        {/* Decorative accent line */}
        <div className="mx-auto mt-10 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#e50914] via-[#0b4df5] to-[#f0b90b]" />
      </motion.div>
    </section>
  );
};

export default FollowUs;
