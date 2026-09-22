"use client";

import React from "react";
import { Trophy, DollarSign, TrendingUp, Users, CheckCircle, Clock, Shield } from "lucide-react";

const stats = [
  {
    icon: <Trophy className="text-blue-600 w-8 h-8" />,
    value: "24,500+",
    label: "Listings Published",
  },
  {
    icon: <DollarSign className="text-green-600 w-8 h-8" />,
    value: "$550M+",
    label: "Value of Cars Sold",
  },
  {
    icon: <TrendingUp className="text-yellow-500 w-8 h-8" />,
    value: "83%+",
    label: "Sell-Through Rate",
  },
  {
    icon: <Users className="text-purple-600 w-8 h-8" />,
    value: "685k+",
    label: "Registered Members",
  },
];

const features = [
  {
    icon: <CheckCircle className="text-blue-600 w-8 h-8" />,
    title: "Verified Listings",
    description:
      "Every vehicle listed on carclickbd is reviewed and verified for accuracy, giving buyers peace of mind.",
  },
  {
    icon: <Clock className="text-green-600 w-8 h-8" />,
    title: "Fast Buyer Inquiries",
    description:
      "Shortlist cars, compare details, and contact sellers through a clear marketplace flow.",
  },
  {
    icon: <Shield className="text-yellow-600 w-8 h-8" />,
    title: "Secure Transactions",
    description:
      "We prioritize your security with trusted payment methods and encrypted data handling.",
  },
];

export default function WhyCarClickBDPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Why Choose carclickbd?</h1>
        <p className="text-lg text-gray-600">
          Trusted by thousands of buyers and sellers worldwide. Here&#39;s what sets us apart.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">{stat.icon}</div>
            <h2 className="text-3xl font-extrabold text-gray-800">{stat.value}</h2>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">{feature.icon}<h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3></div>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
