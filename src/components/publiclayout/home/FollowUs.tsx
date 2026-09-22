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
    { icon: <FacebookFilled />, href: "https://facebook.com/CarClickBD" },
    { icon: <InstagramOutlined />, href: "https://instagram.com" },
    { icon: <SiTiktok />, href: "https://tiktok.com" },
    { icon: <LinkedinOutlined />, href: "https://linkedin.com" },
    { icon: <YoutubeOutlined />, href: "https://youtube.com" },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-[#f8faff] py-20 text-center relative overflow-hidden">
      {/* subtle dots */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="tinyDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#003399" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tinyDots)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-[#003399] mb-3">
          Follow Us
        </h2>
        <p className="text-gray-600 text-sm md:text-base mb-10">
          Stay connected with <span className="text-[#003399] font-semibold">CarClickBD</span> — join our growing community across social media.
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          {socials.map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="relative group"
            >
              {/* glowing ring */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#003399] via-[#0052ff] to-[#F0B90B] blur-md opacity-0 group-hover:opacity-70 transition-all duration-500"></span>
              {/* icon */}
              <div className="w-12 h-12 rounded-full border border-[#003399] flex items-center justify-center text-[#003399] bg-white text-xl transition-all duration-300 relative z-10 group-hover:bg-[#003399] group-hover:text-white shadow-sm">
                {s.icon}
              </div>
            </motion.a>
          ))}
        </div>

        {/* decorative line */}
        <div className="mt-14 w-24 h-[2px] bg-[#F0B90B] mx-auto rounded-full shadow-[0_0_10px_rgba(240,185,11,0.5)]"></div>
      </motion.div>
    </section>
  );
};

export default FollowUs;
