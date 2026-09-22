"use client";
import React from "react";
import { Card, Form, Input } from "antd";

const InternalNoteSection = () => (
  <Card
    title={
      <div className="flex items-center justify-between gap-3">
        <span>Internal Note for Admin</span>
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      </div>
    }
    className="shadow-md mb-4"
  >
    <Form.Item name="internalNote" className="!mb-0">
      <Input.TextArea
        rows={5}
        placeholder="Write a private message for admin about this listing"
      />
    </Form.Item>
  </Card>
);

export default InternalNoteSection;
