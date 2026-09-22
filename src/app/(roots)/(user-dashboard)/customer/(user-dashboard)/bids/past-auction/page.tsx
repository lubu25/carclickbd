"use client";
import BidsTable from "@/components/table/BidsTable";
import React from "react";

const PastAuctionBids: React.FC = () => {
  return <BidsTable statusLabel="Closed Listings" isLoading allProductsResponse/>;
};

export default PastAuctionBids;
