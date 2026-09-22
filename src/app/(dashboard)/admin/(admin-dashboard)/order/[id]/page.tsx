"use client";
import React from "react";
import { Card, Row, Col, Space, Button, Spin, Tag, Statistic } from "antd";
import {
  DollarCircleOutlined,
  EyeOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import { Descriptions, Avatar } from "antd";
import { EditOutlined, ShareAltOutlined } from "@ant-design/icons";
import { BackButton } from "@/components/ui/back-button";

const CardDataStats: React.FC<{
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: React.ReactNode;
}> = ({ title, total, rate, levelUp, levelDown, children }) => {
  return (
    <Card className="shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p
            className={`text-sm ${levelUp ? "text-green-500" : levelDown ? "text-red-500" : "text-gray-500"}`}
          >
            {rate}
          </p>
        </div>
        <div>{children}</div>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mt-4">{total}</h2>
    </Card>
  );
};

const UserDetailsPage: React.FC = () => {
  // Example user data, replace with actual API data as necessary
  const userCard = {
    totalProducts: "45",
    pastAuction: "1122",
    disableAuction: "$45.2K",
    totalUsers: "3.456",
    balanceRate: "0.43%",
    viewsRate: "0.43%",
    profitRate: "4.35%",
    productRate: "2.59%",
    userRate: "0.95%",
  };

  const { id } = useParams<{ id: string }>();

  // Example user data, replace with API call or state as necessary
  const user = {
    id,
    name: "John Doe",
    email: "johndoe@example.com",
    profilePhoto: "https://via.placeholder.com/150",
    role: "Administrator",
    accountType: "business",
    membership: "premium",
    createdAt: "2022-01-15T10:00:00Z",
    updatedAt: "2023-04-01T15:30:00Z",
    followers: 234,
    following: 150,
    posts: 32,
    isEmailVerified: true,
    isVerified: true,
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className=" mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7">
          <CardDataStats
            title="Total Active Auction"
            total={userCard.totalProducts}
            rate={userCard.balanceRate}
            levelUp
          >
            <DollarCircleOutlined className="text-primary text-xl" />
          </CardDataStats>
          <CardDataStats
            title="Past Auction"
            total={userCard.pastAuction}
            rate={userCard.viewsRate}
            levelUp
          >
            <EyeOutlined className="text-primary text-xl" />
          </CardDataStats>
          <CardDataStats
            title="Disable Auction"
            total={userCard.disableAuction}
            rate={userCard.profitRate}
            levelUp
          >
            <BarChartOutlined className="text-primary text-xl" />
          </CardDataStats>
          <CardDataStats
            title="Total Products"
            total={userCard.totalProducts}
            rate={userCard.productRate}
            levelUp
          >
            <ShoppingCartOutlined className="text-primary text-xl" />
          </CardDataStats>
          <CardDataStats
            title="Total Users"
            total={userCard.totalUsers}
            rate={userCard.userRate}
            levelDown
          >
            <UserOutlined className="text-primary text-xl" />
          </CardDataStats>
        </div>
      </div>
        <div className="pt-8 mx-auto">
          <Row gutter={32}>
            {/* User Profile Card */}
            <Col xs={24} sm={12} lg={8}>
              <Card
                cover={
                  <img
                    alt={user.name}
                    src="https://via.placeholder.com/150"
                    className="rounded-full mx-auto"
                  />
                }
                className="shadow-lg text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <Space size="small" className="mt-2">
                  <Tag
                    color={user.accountType === "business" ? "blue" : "green"}
                  >
                    {user.accountType.toUpperCase()}
                  </Tag>
                </Space>
                <p className="text-sm text-gray-600">{user.role}</p>
                <p className="text-sm text-gray-600 mt-2">{user.email}</p>
              </Card>
            </Col>
            {/* Additional User Details */}
            <Card title="User Details" className="shadow-lg mt-8">
              <Descriptions
                bordered
                column={2}
                labelStyle={{ fontWeight: "bold" }}
              >
                <Descriptions.Item label="Email">
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Total Products">
                  {userCard.totalProducts}
                </Descriptions.Item>
                <Descriptions.Item label="Account Type">
                  {user.accountType}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Row>
        </div>
      </div>
  );
};

export default UserDetailsPage;
