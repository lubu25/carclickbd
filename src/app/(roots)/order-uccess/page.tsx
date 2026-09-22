"use client";

import { useEffect, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Typography, Card } from "antd";
import Link from "next/link";
import GetRoleBasisUrl from "@/content/getRole";

const { Title, Paragraph, Text } = Typography;

export default function OrderSuccessPage() {
  const [roleUrl, setRoleUrl] = useState("/");

  useEffect(() => {
    const url = GetRoleBasisUrl();
    setRoleUrl(url ?? "/");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-7xl p-8 shadow-lg text-center">
        <CheckCircleOutlined style={{ fontSize: "64px", color: "#52c41a" }} />
        <Title level={2} className="mt-4 text-green-600">
          Order Placed Successfully!
        </Title>
        <Paragraph className="mt-2 text-lg">
          Thank you for your purchase. We&apos;ve received your order and will
          contact you shortly with the next steps.
        </Paragraph>
        <Text className="block mt-4 text-gray-600">
          You can track your order status in your{" "}
          <Link href={`${roleUrl}/dashboard`} className="text-blue-600 hover:underline">
            Dashboard
          </Link>
          .
        </Text>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button type="default" size="large">
              Back to Home
            </Button>
          </Link>
          <Link href={`${roleUrl}/order`}>
            <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-700">
              Order list
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
