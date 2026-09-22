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

const SellerMembership = () => {
    const router = useRouter();
    const [createOrder] = useCreateOrderMutation();
    const [basicMembership] = useBasicMembershipMutation();    const { currentUser } = useUser();

    const currentPackage = currentUser?.sellerMembership?.toLowerCase(); // Changed to sellerMembership
    const tierRank: Record<string, number> = { basic: 1, business: 2, dealer: 3 }; // Kept the same tier names for consistency

    const handleSellerSelect = async (type: string) => { // Changed function name
        if (type === currentPackage) {
            return message.success(`Your current seller membership is ${type}.`);
        }

        if (type === "basic") {
            try {
                  const res = await basicMembership(currentUser._id).unwrap();
                if (res) {
                    message.success("Successfully downgraded to Basic Seller Membership.");
                    router.refresh?.();
                }
            } catch (err: any) {
                message.error(err?.message || "Failed to downgrade seller membership.");
            }
        }
    };

    // const handleSellerUpgrade = async (price: number, planType: string) => { // Changed function name
    //     try {
    //         const res = await createOrder({
    //             totalQuantity: 1,
    //             totalAmount: price,
    //             orderType: planType + "_seller_membership", // Modified order type
    //         }).unwrap();
    //         if (res.success) {
    //             message.success("Successfully! Please proceed to checkout for seller membership.");
    //             router.push(`/seller/membership/checkout/${res.data._id}`); // Changed route
    //         }
    //     } catch (err: any) {
    //         message.error(err?.message || "Failed to initiate seller membership upgrade.");
    //     }
    // };


      const handleSellerUpgrade = async (price: number, planType: string) => {
        try {
          const res = await createOrder({
            totalQuantity: 1,
            totalAmount: price,
            orderType: planType,
          }).unwrap();
          if (res.success) {
            message.success("Successfully! Please proceed to checkout.");
            router.push(`/seller/membership/checkout/${res.data._id}`);
          }
        } catch (err: any) {
          message.error(err?.message || "Failed to initiate upgrade.");
        }
      };

    const tiers = [
        {
            title: "Basic",
            price: "Free",
            description: "Ideal for individual sellers listing a few vehicles.",
            features: [
                "List up to 5 vehicles at a time",
                "Basic listing features",
                "Limited reporting",
                "Standard customer support",
            ],
        },
        {
            title: "Business",
            price: 49,
            description: "For growing dealerships looking to list more inventory.",
            features: [
                "List up to 25 vehicles at a time",
                "Enhanced listing features (e.g., more photos)",
                "Detailed sales reports",
                "Priority customer support",
                "Access to marketing tools",
            ],
        },
        {
            title: "Dealer",
            price: 99,
            description: "Perfect for established dealerships with large inventories.",
            features: [
                "Unlimited vehicle listings",
                "Premium listing features (e.g., video uploads, featured listings)",
                "Advanced analytics and reporting",
                "Dedicated account manager",
                "Access to exclusive promotional opportunities",
            ],
        },
    ];

    return (
        <div className="py-12 px-4 bg-gray-50">
            <div className="w-5/6 mx-auto">
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <Title level={2}>Unlock More Features for Selling Your Vehicles</Title>
                    <Text type="secondary">
                        Choose a membership tier that suits your selling needs on CarEmax.
                        Upgrade to list more vehicles, access advanced features, and reach a wider audience of buyers!
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
                                        title={`Confirm downgrade to ${tier.title} Seller Membership?`}
                                        onConfirm={() => handleSellerSelect(tierKey)}
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
                                    title={`Confirm upgrade to ${tier.title} Seller Membership for $${tier.price}?`}
                                    onConfirm={() => handleSellerUpgrade(Number(tier.price), tierKey)}
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

export default SellerMembership;
