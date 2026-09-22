"use client";
import React from "react";
import { Row, Col, Typography, Space, Button, Popconfirm, message } from "antd";
import {
  ArrowRightOutlined,
  CheckOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCreateOrderMutation } from "@/Redux/api/orderApi";
import { useBasicMembershipMutation } from "@/Redux/api/userApi";
import useUser from "@/hooks/useUser";

const { Title, Text } = Typography;

const BuyerMembership = () => {
  const router = useRouter();
  const [createOrder] = useCreateOrderMutation();
  const [basicMembership] = useBasicMembershipMutation();
  const { currentUser } = useUser();

  const currentPackage = currentUser?.membership?.toLowerCase();
  const tierRank: Record<string, number> = { basic: 1, standard: 2, premier: 3 };

  const handleBuyerSelect = async (type: string) => {
    if (type === currentPackage) {
      return message.success(`You are currently on the ${type} membership.`);
    }

    if (type === "basic") {
      try {
        const res = await basicMembership(currentUser._id).unwrap();
        if (res) {
          message.success("Successfully downgraded to Basic Membership.");
          router.refresh?.();
        }
      } catch (err: any) {
        message.error(err?.message || "Failed to downgrade.");
      }
    }
  };

  const handleBuyerUpgrade = async (price: number, planType: string) => {
    try {
      const res = await createOrder({
        totalQuantity: 1,
        totalAmount: price,
        orderType: planType,
      }).unwrap();
      if (res.success) {
        message.success("Successfully! Please proceed to checkout.");
        router.push(`/customer/membership/checkout/${res.data._id}`);
      }
    } catch (err: any) {
      message.error(err?.message || "Failed to initiate upgrade.");
    }
  };

  const tiers = [
    {
      title: "Basic",
      price: "Free",
      description: "For those who plan to buy only one vehicle per year.",
      features: [
        "Basic Access",
        "View vehicle listings",
        "Limited inquiries",
        "Add vehicles to your Watchlist",
        "Create vehicle alerts",
      ],
    },
    {
      title: "Standard",
      price: 19,
      description: "For those who plan to buy only a few vehicles per year.",
      features: [
        "Compare multiple saved vehicles",
        "Send inquiries to verified sellers",
        "Shortlist up to five cars at a time",
        "Priority Support",
        "Save your favorite searches",
      ],
    },
    {
      title: "Premier",
      price: 39,
      description: "For those who plan to buy multiple vehicles on a regular basis.",
      features: [
        "Everything included in Standard",
        "Manage multiple shortlisted vehicles",
        "Unlimited inquiries",
        "Get priority in-location assistance",
        "Receive priority customer service",
        "Receive phone support",
      ],
    },
  ];

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="w-5/6 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <Title level={2}>Choose Membership Options</Title>
          <Text type="secondary">
            As a CarClickBD Member, you&#39;ll be able to search our massive inventory
            for wholesale, used and repairable cars, trucks and SUVs. Unlock
            additional features by upgrading to a Standard or Premier Membership
            and manage your saved cars, inquiries, and shortlisted vehicles more easily.
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {tiers.map((tier) => {
            const tierKey = tier.title.toLowerCase();
            const isCurrent = currentPackage === tierKey;
            const isUpgrade = tierRank[tierKey] > tierRank[currentPackage];
            const isDowngrade = tierRank[tierKey] < tierRank[currentPackage];
            const isFree = tierKey === "basic";

            const renderButton = () => {
              if (isCurrent) {
                return (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    className="w-full mt-4"
                    disabled
                  >
                    Current Plan
                  </Button>
                );
              }

              if (isDowngrade || isFree) {
                return (
                  <Popconfirm
                    title={`Confirm downgrade to ${tier.title}?`}
                    onConfirm={() => handleBuyerSelect(tierKey)}
                    onCancel={() => message.info("Action cancelled.")}
                    okText="Yes, Downgrade"
                    cancelText="Cancel"
                  >
                    <Button danger className="w-full mt-4">
                      Downgrade
                    </Button>
                  </Popconfirm>
                );
              }

              return (
                <Popconfirm
                  title={`Confirm upgrade to ${tier.title} for $${tier.price}?`}
                  onConfirm={() => handleBuyerUpgrade(Number(tier.price), tierKey)}
                  onCancel={() => message.info("Upgrade cancelled.")}
                  okText="Yes, Upgrade"
                  cancelText="Cancel"
                >
                  <Button type="primary" icon={<ArrowRightOutlined />} className="w-full mt-4">
                    Upgrade
                  </Button>
                </Popconfirm>
              );
            };

            return (
              <Col xs={24} md={8} key={tier.title}>
                <div className="bg-white border rounded-lg shadow-lg p-6 flex flex-col h-full">
                  <div className="text-xl font-bold">
                    <h2>{tier.title}</h2>
                    <p className="text-4xl">
                      {typeof tier.price === "number" ? `$${tier.price}` : tier.price}
                      {typeof tier.price === "number" && (
                        <span className="text-xl"> USD</span>
                      )}
                      {isCurrent && (
                        <span className="text-xl text-green-600 ml-1">
                          (Current Plan)
                        </span>
                      )}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 py-4">{tier.description}</p>

                  <Space direction="vertical" size="middle" className="flex-grow">
                    {tier.features.map((feature, idx) => (
                      <Text key={idx} className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" /> {feature}
                      </Text>
                    ))}
                  </Space>

                  {renderButton()}
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default BuyerMembership;
