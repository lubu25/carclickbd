"use client";

import React from "react";
import { Card, Form, Select } from "antd";
import { productStatusMeta, productStatuses } from "@/utils/productStatus";

const StatusSection = () => (
  <Card
    title={
      <div className="flex items-center justify-between gap-3">
        <span>Listing Status</span>
        <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700">
          Visibility
        </span>
      </div>
    }
    className="mb-4 shadow-md"
  >
    <Form.Item
      name="status"
      label="Status"
      className="!mb-0"
      rules={[{ required: true, message: "Please select listing status" }]}
    >
      <Select
        placeholder="Select status"
        options={productStatuses.map((status) => ({
          value: status,
          label: productStatusMeta[status].label,
        }))}
      />
    </Form.Item>
  </Card>
);

export default StatusSection;
