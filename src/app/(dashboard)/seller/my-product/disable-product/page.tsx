"use client";

import PastAuctionTable from "@/components/table/PastAuctionTable";
import useMyProductTable from "@/hooks/useMyProductTable";

const SellerOfflineProductPage = () => {
  const { products, isLoading, pagination, handleTableChange } = useMyProductTable([
    { name: "isWinner", value: false },
    { name: "isDraft", value: true },
  ]);

  return (
    <PastAuctionTable
      products={products}
      loading={isLoading}
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

export default SellerOfflineProductPage;
