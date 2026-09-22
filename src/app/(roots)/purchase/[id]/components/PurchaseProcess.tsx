import { Card } from "antd";
import Title from "antd/es/typography/Title";
import React from "react";

const PurchaseProcess = () => {
  return (
    <Card className="shadow-lg mb-8">
      <Title level={4} className="mb-4 text-xl font-semibold">
        Purchase Process
      </Title>
      <ol className="list-decimal list-inside space-y-2">
        <li>Fill out the form with your details</li>
        <li>Our team will review your purchase request</li>
        <li>
          We&apos;ll contact you to finalize the purchase and arrange payment
        </li>
        <li>Schedule a pickup or delivery of your new vehicle</li>
      </ol>
    </Card>
  );
};

export default PurchaseProcess;
