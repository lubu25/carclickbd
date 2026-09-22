
"use client";
import BidsTable from "@/components/table/BidsTable";
import { useGetAllProductQuery } from "@/Redux/api/productApi";
import React from "react";

const PastAuctionBids: React.FC = () => {
  const { data: allProductsResponse, isLoading } = useGetAllProductQuery([
    { name: "isWinner", value: true },
  ]);

  console.log("allProductsResponse", allProductsResponse);
  

  return (
    <BidsTable
    allProductsResponse={allProductsResponse}
    isLoading={isLoading}
    statusLabel="Running..."
    />
  );
};

export default PastAuctionBids;