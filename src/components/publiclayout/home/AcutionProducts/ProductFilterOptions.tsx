import React from "react";
import CarFilters from "./CarFilters";

const ProductFilterOptions = ({
  isWinner,
}: {
  baseUrl?: string;
  isWinner?: boolean;
}) => {
  return (
    <div className="mx-auto mt-8 flex w-full max-w-[1500px] flex-col gap-6 bg-white px-4 md:px-8">
      <CarFilters isWinner={isWinner ?? false} />
    </div>
  );
};

export default ProductFilterOptions;
