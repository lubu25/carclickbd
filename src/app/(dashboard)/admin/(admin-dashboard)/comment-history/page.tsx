"use client";
import CommentTable from "@/components/table/CommentTable";
import { useGetAllProductQuery } from "@/Redux/api/productApi";
import React from "react";

const AllComment: React.FC = () => {
  const { data: allProductsResponse, isLoading } =
    useGetAllProductQuery([{ name: "isWinner", value: false }]);

  return (
    <CommentTable
      allProductsResponse={allProductsResponse}
      isLoading={isLoading}
      statusLabel="Running..."
    />
  );
};

export default AllComment;

