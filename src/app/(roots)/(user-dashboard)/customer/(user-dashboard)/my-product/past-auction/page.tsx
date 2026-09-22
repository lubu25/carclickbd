"use client";
import React from "react";
import { Flex } from "antd";
import PastAuctionTable from "@/components/table/PastAuctionTable";
import useMyProductTable from "@/hooks/useMyProductTable";


const PastAuction: React.FC = () => {
  const { products, isLoading, pagination, handleTableChange } = useMyProductTable([
    { name: "isWinner", value: true },
  ]);

  return (
    <Flex gap="middle" vertical>
      <PastAuctionTable
        products={products}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Flex>
  );
};

export default PastAuction;