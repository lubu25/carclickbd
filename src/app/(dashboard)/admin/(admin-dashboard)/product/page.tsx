"use client";
import React from "react";
import ProductTable from "@/components/table/ProductTable";
import useProductTable from "@/hooks/useProductTable";

const AdminProduct: React.FC = () => {
  const { products, isLoading, pagination, handleTableChange } = useProductTable([
    { name: "isWinner", value: false },
    { name: "isDraft", value: false },
  ]);

  return (
    <div className="p-4 space-y-6">
      <ProductTable
        products={products}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default AdminProduct;
