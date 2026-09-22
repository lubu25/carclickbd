"use client";
import React from "react";
import { Card, Form, DatePicker } from "antd";
import dayjs from "dayjs";

const TimingSection = () => (
  <Card title="Timing" className="shadow-md">
    <Form.Item
      name="startBid"
      label="Start Time"
      rules={[{ required: true, message: "Select start time" }]}
    >
      <DatePicker showTime className="w-full" />
    </Form.Item>
    <Form.Item
      name="endBid"
      label="End Time"
      dependencies={["startBid"]}
      rules={[
        { required: true, message: "Select end time" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            const start = getFieldValue("startBid");
            if (!value || !start || dayjs(value).isAfter(dayjs(start))) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("End must be after start"));
          },
        }),
      ]}
    >
      <DatePicker showTime className="w-full" />
    </Form.Item>
  </Card>
);

export default TimingSection;
