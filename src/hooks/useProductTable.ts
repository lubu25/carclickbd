"use client";
import { useGetAllProductQuery, useGetMyProductQuery } from "@/Redux/api/productApi";
import { useState } from "react";

type TQueryParam = {
  name: string;
  value: boolean;
};

const useProductTable = (extraParams: TQueryParam[] = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: response, isLoading } = useGetAllProductQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    ...extraParams,
  ]);

  const products = response?.data || [];

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return {
    products,
    isLoading,
    pagination: {
      current: currentPage,
      pageSize,
      total: response?.total || 0,
    },
    handleTableChange,
  };
};

export default useProductTable;