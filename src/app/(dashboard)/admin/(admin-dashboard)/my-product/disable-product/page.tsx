"use client";
import React from "react";
import { Flex } from "antd";
import PastAuctionTable from "@/components/table/PastAuctionTable";
import useProductTable from "@/hooks/useProductTable";

const DisableProduct: React.FC = () => {
  const { products, isLoading, pagination, handleTableChange } = useProductTable([
    { name: "isWinner", value: false },
    { name: "isDraft", value: true },
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

export default DisableProduct;
