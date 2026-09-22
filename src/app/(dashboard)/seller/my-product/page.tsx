"use client";

import ProductTable from "@/components/table/ProductTable";
import useMyProductTable from "@/hooks/useMyProductTable";

const SellerMyProductPage = () => {
  const { products, isLoading, pagination, handleTableChange } = useMyProductTable([
    { name: "isWinner", value: false },
    { name: "isDraft", value: false },
  ]);

  return (
    <div className="space-y-6">
      <ProductTable
        products={products}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default SellerMyProductPage;
