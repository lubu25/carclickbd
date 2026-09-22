"use client";
import React, { useMemo } from "react";
import { Button,  Row, Col, Empty, Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { IProduct } from "@/Interface/product";
import { useGetAllProductQuery } from "@/Redux/api/productApi";
import { AuctionProductsProps } from "@/types/products.types";

const conditionQueryMap: Record<string, string> = {
  new: "New",
  reconditioned: "Reconditioned",
  "local-used": "Local Used",
  "pre-owned": "Pre Owned",
  used: "Used",
};

const statusQueryMap: Record<string, string> = {
  available: "approval",
  "under-negotiation": "under_negotiations",
  "under-negotiations": "under_negotiations",
};

const ProductsResult = ({
  isPaginate,
  isShowAll,
  className,
  isWinner,
  isDraft,
  isFeatured
}:AuctionProductsProps) => {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const baseFilters: { name: string; value?: any }[] = [];

    if (isWinner !== undefined) baseFilters.push({ name: "isWinner", value: isWinner });
    if (isDraft !== undefined) baseFilters.push({ name: "isDraft", value: isDraft });
    if (isFeatured !== undefined) baseFilters.push({ name: "isFeatured", value: isFeatured });

    if (searchParams.get("make")) baseFilters.push({ name: "maker", value: searchParams.get("make") });
    if (searchParams.get("model")) baseFilters.push({ name: "model", value: searchParams.get("model") });
    if (searchParams.get("transmission")) baseFilters.push({ name: "transmission", value: searchParams.get("transmission") });
    if (searchParams.get("bodyStyle")) baseFilters.push({ name: "bodyType", value: searchParams.get("bodyStyle") });
    if (searchParams.get("condition")) {
      const condition = searchParams.get("condition") as string;
      baseFilters.push({
        name: "condition",
        value: conditionQueryMap[condition] || condition,
      });
    }
    if (searchParams.get("status")) {
      const status = searchParams.get("status") as string;
      baseFilters.push({
        name: "status",
        value: statusQueryMap[status] || status,
      });
    }
    if (searchParams.get("searchTerm")) baseFilters.push({ name: "searchTerm", value: searchParams.get("searchTerm") });
    if (searchParams.get("startYear") && searchParams.get("endYear")) {
      baseFilters.push({ name: "startYear", value: parseInt(searchParams.get("startYear")!) });
      baseFilters.push({ name: "endYear", value: parseInt(searchParams.get("endYear")!) });
    }

    return baseFilters;
  }, [isWinner, isDraft,isFeatured, searchParams]);

  const { data, isLoading } = useGetAllProductQuery(filters);
  const products: IProduct[] = useMemo(() => data?.data || [], [data]);  
  

  const sortedProducts = useMemo(() => {
    const sortParam = searchParams.get("sort");
    switch (sortParam) {
      case "listed":
        return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "newest":
        return [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "lowestMileage":
        return [...products].sort((a, b) => (parseFloat(a.mileage) || 0) - (parseFloat(b.mileage) || 0));
      case "highestMileage":
        return [...products].sort((a, b) => (parseFloat(b.mileage) || 0) - (parseFloat(a.mileage) || 0));
      case "HighestPrice":
        return [...products].sort((a, b) => Number(b.mainPrice || b.highestBid || 0) - Number(a.mainPrice || a.highestBid || 0));
      case "LowestPrice":
        return [...products].sort((a, b) => Number(a.mainPrice || a.highestBid || 0) - Number(b.mainPrice || b.highestBid || 0));
      default:
        return products;
    }
  }, [products, searchParams]);

  const router = useRouter();

  if (isLoading) {
    return (
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {[...Array(8)].map((_, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <ProductCard.Skeleton />
          </Col>
        ))}
      </Row>
    );
  }

  const previewLimit = isPaginate ? 10 : 8;
  const displayedProducts = isShowAll
    ? sortedProducts
    : sortedProducts.slice(0, previewLimit);
  return (
    <section className="mt-6">
      {displayedProducts.length === 0 ? (
        <Empty description="No products found" />
      ) : (
        <div className={className}>
          {displayedProducts.map((product: IProduct) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {products.length > previewLimit && !isShowAll && (
        <div className="mt-8 flex justify-center">
          <Button
            size="large"
            className="!h-12 !rounded-md !border-[#e50914] !bg-[#e50914] !px-8 !font-bold !text-white !shadow-sm hover:!border-[#b80f17] hover:!bg-[#b80f17] hover:!text-white"
            onClick={() => router.push("/cars")}
          >
            Load More Cars
          </Button>
        </div>
      )}

      {isPaginate && isShowAll && (
        <div className="text-center mt-6">
          <Pagination defaultCurrent={1} total={products.length} />
        </div>
      )}
    </section>
  );
};

export default ProductsResult;
