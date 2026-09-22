import React from "react";
import CardDataStats from "./CardDataStats";
import { DollarCircleOutlined, EyeOutlined, ShoppingCartOutlined, UserOutlined, BarChartOutlined } from "@ant-design/icons";

const AdminStatistic = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7">
      <CardDataStats title="Total Balance" total="3.456K" rate="0.43%" levelUp>
        <DollarCircleOutlined className="text-primary text-2xl" />
      </CardDataStats>
      <CardDataStats title="Total Views" total="3.456K" rate="0.43%" levelUp>
        <EyeOutlined className="text-primary text-2xl" />
      </CardDataStats>
      <CardDataStats title="Total Profit" total="$45.2K" rate="4.35%" levelUp>
        <BarChartOutlined className="text-primary text-2xl" />
      </CardDataStats>
      <CardDataStats title="Total Products" total="2.450" rate="2.59%" levelUp>
        <ShoppingCartOutlined className="text-primary text-2xl" />
      </CardDataStats>
      <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
        <UserOutlined className="text-primary text-2xl" />
      </CardDataStats>
    </div>
  );
};

export default AdminStatistic;
