import React from "react";
import ProductFilter from "./ProductFilterOptions";
import ProductsResult from "./ProductsResult";
import Container from "@/shared/wrapper/Container";

const AuctionProducts = ({
  isPaginate = true,
  isShowAll,
}: {
  isPaginate?: boolean;
  isShowAll?: boolean;
}) => {
  return (
    <Container>
      {/* if paginate true this is invoked in  /product page else home page */}
      <ProductFilter />
      <ProductsResult
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        isPaginate={isPaginate}
        isShowAll={isShowAll}
      />
    </Container>
  );
};

export default AuctionProducts;
