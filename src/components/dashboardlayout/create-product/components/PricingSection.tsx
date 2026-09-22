"use client";
import React from "react";
import { Card, Row, Col, Form, Input } from "antd";

const PricingSection = () => (
  <Card title="Price & Mileage" className="shadow-md mb-4">
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item
          name="mainPrice"
          label="Price"
          rules={[
            { required: true, message: "Please enter a price" },
            {
              validator: (_, value) => {
                if (!value || /^\d+(\.\d{1,2})?$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject("Price must be a valid number");
              },
            },
          ]}
        >
          <Input placeholder="15000" />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          name="mileage"
          label="Mileage"
          rules={[
            { required: true, message: "Please enter mileage" },
            {
              validator: (_, value) => {
                if (!value || /^\d+$/.test(value)) return Promise.resolve();
                return Promise.reject("Mileage must be a whole number");
              },
            },
          ]}
        >
          <Input placeholder="65200" />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

export default PricingSection;
