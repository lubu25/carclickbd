"use client";
import { Card, Button } from "antd";

export default function ReportsAndServices() {
  return (
    <Card className="shadow rounded-lg">
      <h2 className="text-lg font-medium mb-2">Vehicle history reports</h2>
      <p className="text-sm text-gray-600 mb-2">
        TRUE REPORT and WILL BUY API history checks can be connected for approved listings.
      </p>
      <Button type="link">Request TRUE REPORT</Button>
    </Card>
  );
}
