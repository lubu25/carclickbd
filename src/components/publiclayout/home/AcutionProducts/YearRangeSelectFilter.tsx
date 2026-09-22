"use client";
import React, { useState } from "react";
import { Dropdown, Button, Select, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/Redux/hooks";
import { setYearRange } from "@/Redux/Slices/productQuerySlice";

const { Option } = Select;

const YearRangeSelectFilter: React.FC = () => {
  const [startYear, setStartYear] = useState<number | undefined>(1981);
  const [endYear, setEndYear] = useState<number | undefined>(2026);

  const yearRange = `${startYear} to ${endYear}`;

  // redux
  const dispatch = useAppDispatch();

  const generateYearOptions = () => {
    const years = [];
    for (let year = 1980; year <= 2026; year++) {
      years.push(
        <Option key={year} value={year}>
          {year}
        </Option>,
      );
    }
    return years;
  };

  const handleStartYearChange = (value: number) => {
    setStartYear(value);
    dispatch(setYearRange(yearRange));
  };

  const handleEndYearChange = (value: number) => {
    setEndYear(value);
    dispatch(setYearRange(yearRange));
  };

  const menu = (
    <div onClick={(e) => e.stopPropagation()} className=" rounded-lg">
      <Space direction="horizontal">
        <Select
          value={startYear}
          onChange={handleStartYearChange}
          style={{ width: 80 }}
          placeholder="From"
        >
          {generateYearOptions()}
        </Select>
        <span>To</span>
        <Select
          value={endYear}
          onChange={handleEndYearChange}
          style={{ width: 80 }}
          placeholder="To"
        >
          {generateYearOptions()}
        </Select>
      </Space>
    </div>
  );

  return (
    <Dropdown
      menu={{ items: [{ key: "menu", label: menu }] }}
      trigger={["click"]}
      placement="bottom"
    >
      <Button>
        Years{" "}
        <span className="text-gray-800 text-md">
          <DownOutlined />
        </span>
      </Button>
    </Dropdown>
  );
};

export default YearRangeSelectFilter;
