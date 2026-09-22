import React, { ReactNode } from "react";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7 py-6 shadow">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-2">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black">{total}</h4>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp ? "text-meta-3" : levelDown ? "text-meta-5" : ""
          }`}
        >
          {rate}
          {levelUp && <ArrowUpOutlined className="text-meta-3" />}
          {levelDown && <ArrowDownOutlined className="text-meta-5" />}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
