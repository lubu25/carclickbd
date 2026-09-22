"use client";
import { useState } from "react";

type TQueryParam = {
  name: string;
  value: boolean;
};

const usePaginatedQuery = (queryFunction: any, extraParams: TQueryParam[] = []) => {
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize, setPageSize] = useState(10);
    
      const { data: response, isLoading } = queryFunction([
        { name: "page", value: currentPage },
        { name: "limit", value: pageSize },
        ...extraParams,
      ]);
    
      const products = response?.data || []; // ✅ Changed from 'items' to 'products'
    
      const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
      };
    
      return {
        products, // ✅ Now it matches AdminProduct.tsx
        isLoading,
        pagination: {
          current: currentPage,
          pageSize,
          total: response?.total || 0,
        },
        handleTableChange,
      };
    };
    
    export default usePaginatedQuery;
    
