import React from "react";
import { Button, Space, Typography, Popconfirm, message } from "antd";
import { CheckCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface MembershipTierProps {
  title: string;
  price: string | number;
  description: string;
  features: string[];
  isCurrent?: boolean;
  onSelect?: (type: string) => void;
  onUpgrade?: (price: number, planType?: string) => void;
  disabled?: boolean;
  upgradeButtonText?: string;
  selectButtonText?: string;
  selectIcon?: React.ReactNode;
  upgradeIcon?: React.ReactNode;
  upgradePrice?: number;
  planType?: string;
}

const MembershipTier: React.FC<MembershipTierProps> = ({
  title,
  price,
  description,
  features,
  isCurrent = false,
  onSelect,
  onUpgrade,
  disabled = false,
  upgradeButtonText = "Upgrade Now",
  selectButtonText = "Get Started",
  selectIcon,
  upgradeIcon = <ArrowRightOutlined />,
  upgradePrice,
  planType,
}) => (
  <div className="bg-white border rounded-lg shadow-lg p-6 flex flex-col h-full">
    <div className="text-xl font-bold">
      <h2>{title}</h2>
      <p className="text-4xl">
        {typeof price === "number" ? `$${price}` : price}{" "}
        {typeof price === "number" && <span className="text-xl">USD</span>}
        {isCurrent && <span className="text-xl">(Current Plan)</span>}
      </p>
    </div>
    <p className="text-xs text-gray-500 py-4">{description}</p>
    <Space direction="vertical" size="middle" className="flex-grow">
      {features.map((feature, index) => (
        <Text key={index} className="flex items-center">
          <CheckCircleOutlined className="text-green-500 mr-2" /> {feature}
        </Text>
      ))}
    </Space>
    {onSelect && (
      <Button
        type="primary"
        icon={selectIcon}
        className="w-full mt-4"
        onClick={() => onSelect(title.toLowerCase())}
        disabled={disabled}
      >
        {selectButtonText}
      </Button>
    )}
   {onUpgrade && upgradePrice !== undefined && (
  <Popconfirm
    title={`Confirm upgrade to ${title} plan?`}
    description={`Are you sure you want to upgrade to the ${title} plan for $${upgradePrice}?`}
    onConfirm={() => onUpgrade(upgradePrice, planType)}
    onCancel={() => message.info('Upgrade cancelled.')}
    okText="Yes, Upgrade"
    cancelText="No, Cancel"
  >
    <Button
      type="primary"
      icon={upgradeIcon}
      className="w-full mt-4"
    >
      {upgradeButtonText}
    </Button>
  </Popconfirm>
)}

  </div>
);

export default MembershipTier;