"use client";
import React from "react";
import { Flex } from "antd";
import useProductTable from "@/hooks/useProductTable";
import ProductTable from "@/components/table/ProductTable";

const DisableProduct: React.FC = () => {
  const { products, isLoading, pagination, handleTableChange } = useProductTable([
    { name: "isWinner", value: false },
    { name: "isDraft", value: true },
  ]);

  return (
    <Flex gap="middle" vertical>
      <ProductTable
        products={products}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Flex>
  );
};

export default DisableProduct;
