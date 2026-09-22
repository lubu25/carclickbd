import { Tooltip } from "antd";
import React from "react";
import {
  InfoCircleOutlined,
} from "@ant-design/icons";

interface StatsCardProps {
  title: string;
  value: string | number; // Allow both strings and numbers
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,

}) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-md opacity-80 ${bgColor}`}>
      <div className="flex items-center space-x-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className=" text-gray-700">{title}</h3>
            <Tooltip title={title}>
              <InfoCircleOutlined />
            </Tooltip>
          </div>
          <div className=" flex items-center gap-1">
            {icon && <div className={` text-xl ${textColor}`}>{icon}</div>}
            <p className={` text-xl ${textColor}`}>{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
