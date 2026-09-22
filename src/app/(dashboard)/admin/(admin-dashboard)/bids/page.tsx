"use client";
import BidsTable from "@/components/table/BidsTable";
import { useGetAllProductQuery } from "@/Redux/api/productApi";
import React from "react";

const Bids: React.FC = () => {
  const { data: allProductsResponse, isLoading } =
    useGetAllProductQuery([{ name: "isWinner", value: false }]);

  return (
    <BidsTable
      allProductsResponse={allProductsResponse}
      isLoading={isLoading}
      statusLabel="Running..."
    />
  );
};

export default Bids;
