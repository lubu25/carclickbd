"use client";

import { homeFilterMakers } from "@/content/product.constant";
import { updateSearchParams } from "@/helpers/filter/updateSearchParams";
import { Select } from "antd";
import React from "react";

const TransmissionFilter = () => {
  const handleChange = (value: string) => {
    if (value == "all") {
      updateSearchParams({ make: undefined, model: undefined });
      return;
    }
    updateSearchParams({ make: value, model: undefined });
  };

  return (
    <div>
      <Select
        placeholder={
          <span className="text-gray-800 text-md">Maker</span>
        }
        // defaultValue="all"
        style={{ width: 130 }}
        onChange={handleChange}
        options={homeFilterMakers}
      />
    </div>
  );
};

export default TransmissionFilter;
