"use client";
import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Alert } from "antd";

const PaymentGatewaySettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/eps/config");
        const data = await res.json();
        if (data.success && data.data) {
          form.setFieldsValue({
            storeId: data.data.storeId,
            signatureKey: data.data.signatureKey,
            gatewayUrl: data.data.gatewayUrl,
          });
        }
      } catch (error) {
        console.error("Failed to load EPS config:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchConfig();
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/eps/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        message.success("EPS Gateway Settings updated successfully!");
      } else {
        message.error("Failed to update settings.");
      }
    } catch (error) {
      message.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Payment Gateway Integration (EPS)" className="shadow-md" style={{ maxWidth: 800 }}>
        <Alert 
          message="EPS Configuration" 
          description="Enter your EPS Merchant details below. Once saved, these details will be used immediately for all live payments." 
          type="info" 
          showIcon 
          className="mb-6" 
        />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Store ID (Merchant ID)"
            name="storeId"
            rules={[{ required: true, message: "Please input your EPS Store ID!" }]}
          >
            <Input placeholder="Enter Store ID" size="large" />
          </Form.Item>

          <Form.Item
            label="Signature Key"
            name="signatureKey"
            rules={[{ required: true, message: "Please input your EPS Signature Key!" }]}
          >
            <Input.Password placeholder="Enter Signature Key" size="large" />
          </Form.Item>

          <Form.Item
            label="Gateway URL"
            name="gatewayUrl"
            rules={[{ required: true, message: "Please input the Gateway URL!" }]}
            extra="For production: https://eps.com.bd/payment (Check official docs)"
          >
            <Input placeholder="https://sandbox.eps.com.bd/payment" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading} disabled={fetching}>
              Save Changes & Make Live
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentGatewaySettings;
