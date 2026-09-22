"use client";
import React from "react";
import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import PrimaryButton from "../shared/PrimaryButton";

const MembershipHome = () => {
  const plans = [
    {
      name: "Guest",
      price: "Free",
      desc: "For buyers who want to browse verified vehicle listings.",
      features: [
        "View vehicle listings",
        "Add vehicles to your Watchlist",
        "Create vehicle alerts",
      ],
      highlight: false,
    },
    {
      name: "Basic",
      price: "$99",
      unit: "USD",
      desc: "For those who plan to buy only a few vehicles per year.",
      features: [
        "Compare multiple saved vehicles",
        "Send inquiries to verified sellers",
        "Access buyer support for shortlisted cars",
        "Save your favorite searches",
      ],
      highlight: false,
    },
    {
      name: "Premier",
      price: "$249",
      unit: "USD",
      desc: "For those who plan to buy multiple vehicles on a regular basis.",
      features: [
        "Everything included in Basic",
        "Manage multiple shortlisted vehicles",
        "Get priority in-location assistance",
        "Receive priority customer service",
        "Receive phone support",
      ],
      highlight: true,
    },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      {/* ==== Gradient Background ==== */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-[#eaf1ff] to-[#dce6ff]"></div>

      {/* ==== Dotted Pattern (Top Left) ==== */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-40">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="2" fill="#5a7aff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* ==== Dotted Pattern (Bottom Right) ==== */}
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-30">
        <svg width="100%" height="100%">
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-gray-800 md:px-8">
        {/* ===== Title Section ===== */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0052FF] mb-3">
            Membership Options
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
            As a <span className="font-semibold text-[#0052FF]">CarClickBD</span>{" "}
            Member, you&apos;ll be able to search our massive inventory for
            wholesale, used and repairable cars, trucks and SUVs. Unlock
            additional buyer tools by upgrading to a Basic or Premier
            Membership and manage your saved searches, inquiries, and
            shortlisted vehicles more efficiently.
          </p>

          {/* Bullet Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckOutlined className="text-[#0052FF]" /> Pay Annually
            </div>
            <div className="flex items-center gap-2">
              <CheckOutlined className="text-[#0052FF]" /> Refund available
              within 7 days
            </div>
            <div className="flex items-center gap-2">
              <CheckOutlined className="text-[#0052FF]" /> Access to over
              175,000 vehicles
            </div>
          </div>
        </div>

        {/* ===== Membership Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-lg bg-white shadow-md border border-gray-200 p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 ${
                plan.highlight ? "lg:scale-105" : ""
              }`}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-[#0052FF] mt-2 mb-1">
                  {plan.price}{" "}
                  {plan.unit && (
                    <span className="text-sm font-normal">{plan.unit}</span>
                  )}
                </p>
                <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 text-sm"
                    >
                      <CheckOutlined className="text-[#0052FF] mt-[2px]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Register Button ===== */}
        <div className="text-center mt-12">
          <PrimaryButton size="md" variant="primary" onClick={() => console.log("Register clicked")}>
            REGISTER NOW
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default MembershipHome;
