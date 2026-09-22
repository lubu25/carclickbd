"use client";
import { useAppDispatch } from "@/Redux/hooks";
import { setSorting } from "@/Redux/Slices/productQuerySlice";
import React, { useState } from "react";

const ListedFilter = () => {
  const [sortingType, setSortingType] = useState<"endingSoon" | "newlyListed">("endingSoon");

  const dispatch = useAppDispatch();

  const handleSorting = (query: "endingSoon" | "newlyListed") => {
    dispatch(setSorting(query));
    setSortingType(query);
  };

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={() => handleSorting("endingSoon")}
        className={`text-nowrap font-medium text-xs md:text-sm lg:text-base border border-gray-900 px-2 py-[1px] rounded-md hover:bg-gray-900 ${
          sortingType === "endingSoon" && "bg-gray-900 text-white"
        } hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400`}
      >
        Ending Soon
      </button>
      <button
        onClick={() => handleSorting("newlyListed")}
        className={`text-nowrap font-medium text-xs md:text-sm lg:text-base border border-gray-900 px-2 py-[1px] rounded-md hover:bg-gray-900 ${
          sortingType === "newlyListed" && "bg-gray-900 text-white"
        } hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400`}
      >
        Newly Listed
      </button>
    </div>
  );
};

export default ListedFilter;
