"use client";

import type { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    type: "pie",
  },
  labels: ["Product One", "Product Two", "Product Three"],
  colors: ["#3C50E0", "#80CAEE", "#FF4560"],
  legend: {
    position: "bottom",
  },
};

const PieChartComponent: React.FC = () => {
  const series = [44, 55, 41]; // Sample data

  return (
    <div className="col-span-12 rounded-sm border bg-white px-5 pb-5 pt-8 shadow-default sm:px-8 xl:col-span-6">
      <h3 className="text-lg font-semibold text-black mb-4">Sales Distribution</h3>
      <ReactApexChart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default PieChartComponent;
