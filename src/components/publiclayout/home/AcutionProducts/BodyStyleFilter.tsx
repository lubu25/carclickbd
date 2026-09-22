"use client";
import { homeFilterModelsByMaker } from "@/content/product.constant";
import { updateSearchParams } from "@/helpers/filter/updateSearchParams";
import { Select } from "antd";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

const BodyStyleFilter = () => {
  const searchParams = useSearchParams();
  const selectedMaker = searchParams.get("make") || "";

  const modelOptions = useMemo(() => {
    const makerModels = homeFilterModelsByMaker[selectedMaker] || [];
    const allModels = Object.values(homeFilterModelsByMaker)
      .flat()
      .filter(
        (model, index, models) =>
          models.findIndex((item) => item.value === model.value) === index,
      );

    return [
      { value: "all", label: selectedMaker ? "All Car Names" : "All Models" },
      ...(makerModels.length ? makerModels : allModels),
    ];
  }, [selectedMaker]);

  const handleChange = (value: string) => {
    if (value == "all") {
      updateSearchParams({ model: undefined });
      return;
    }

    updateSearchParams({ model: value });
  };
  return (
    <div>
      <Select
        placeholder={<span className="text-gray-800 text-md">Car Name</span>}
        // defaultValue="all"
        style={{ width: 160 }}
        onChange={handleChange}
        options={modelOptions}
      />
    </div>
  );
};

export default BodyStyleFilter;
