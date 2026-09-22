"use client";
import FeaturesSection from "./components/FeaturesSection";
import BuyingCarSection from "./components/BuyingCarSection";
import SellingCarSection from "./components/SellingCarSection";
import FAQSection from "./components/FAQSection";
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;
const tabs = ["how-it-works", "buying-car", "selling-car", "faq"];

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState("how-it-works");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get("tab");
      if (tab && tabs.includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, []);

  return (
    <div className="container mx-auto space-y-9 p-6 text-[15px] md:text-base">
      <h1 className="text-center text-5xl font-extrabold tracking-tight">
        Help Center
      </h1>
      <p className="text-center text-xl leading-8 text-gray-600">
        Find answers to your questions about buying and selling on our
        platform.
      </p>

      <Tabs
        activeKey={activeTab}
        onTabClick={setActiveTab}
        className="w-full [&_.ant-card-body]:!text-base [&_.ant-card-head-title]:!text-lg [&_.ant-steps-item-description]:!text-base [&_.ant-steps-item-title]:!text-lg [&_.ant-tabs-tab-btn]:!text-base md:[&_.ant-tabs-tab-btn]:!text-lg"
      >
        <TabPane tab="How it Works" key="how-it-works">
          <FeaturesSection />
        </TabPane>
        <TabPane tab="Buying a Car" key="buying-car">
          <BuyingCarSection />
        </TabPane>
        <TabPane tab="Selling Car" key="selling-car">
          <SellingCarSection />
        </TabPane>
        <TabPane tab="FAQ" key="faq">
          <FAQSection />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HelpPage;
