"use client";

import React from "react";
import { Collapse, Button, Card } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ProductsResult from "@/components/publiclayout/home/AcutionProducts/ProductsResult";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const { Panel } = Collapse;

const SellCarPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto space-y-10 p-6">
      <Breadcrumbs />

      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Get the best exposure for your car</h1>
        <p className="text-lg text-gray-600">
          Reach verified buyers and manage inquiries with confidence.
        </p>
        <Button onClick={() => router.push("/seller-signup")} type="primary" size="large">
          Sell now - it&apos;s free!
        </Button>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Recent Listings</h2>
        <ProductsResult
          className="grid grid-cols-1 gap-6 lg:grid-cols-4 xl:grid-cols-6"
          isPaginate={false}
          isShowAll={false}
          isWinner={false}
        />
      </div>

      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">Why sell on CarClickBD?</h2>
        <p className="text-lg text-gray-600">
          We help your car reach serious buyers with clear photos, specs, price,
          and direct inquiry options.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">How it Works</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Submit your car in minutes",
            "Add clear photos and details",
            "Admin reviews and publishes",
            "Connect with buyers",
          ].map((text, index) => (
            <Card key={index} className="p-4 text-center shadow-md">
              <CheckCircleOutlined className="mb-2 text-3xl text-green-500" />
              <p className="font-semibold">{text}</p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
        <Collapse>
          <Panel header="How much does it cost to sell a car?" key="1">
            <p>It&apos;s completely free to list your car for sale.</p>
          </Panel>
          <Panel header="What information should I provide?" key="2">
            <p>
              Add accurate photos, price, location, mileage, chassis number,
              condition, and important vehicle specifications.
            </p>
          </Panel>
          <Panel header="How do buyers contact me?" key="3">
            <p>
              Buyers can send inquiries through the listing. CarClickBD helps
              connect buyers and sellers through a safer communication flow.
            </p>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default SellCarPage;
