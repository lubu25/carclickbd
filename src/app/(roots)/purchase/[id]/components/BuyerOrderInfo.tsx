import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import Title from "antd/es/typography/Title";

const BuyerOrderInfo = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const [form] = Form.useForm();

  return (
    <Card className="shadow-lg mb-8">
      <Title level={3} className="mb-6 text-2xl font-semibold">
        Your Information
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="fullName"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>Full Name</span>}
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>Phone Number</span>}
            rules={[{ required: true, message: "Please enter your phone number" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="address"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>Address</span>}
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="city"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>City</span>}
            rules={[{ required: true, message: "Please enter your city" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="state"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>State</span>}
            rules={[{ required: true, message: "Please enter your state" }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="zipCode"
            label={<span className="flex"><span className="text-[#f0b90b] mr-1">*</span>ZIP Code</span>}
            rules={[{ required: true, message: "Please enter your ZIP code" }]}
          >
            <Input size="large" />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full bg-blue-600 hover:bg-blue-700 border-none h-12 text-lg font-semibold"
          >
            Submit Purchase Request
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BuyerOrderInfo;
