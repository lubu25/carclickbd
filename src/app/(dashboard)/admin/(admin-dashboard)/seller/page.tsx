"use client";
import React, { useState } from "react";
import {useGetAllUserQuery} from "@/Redux/api/userApi";
import UserTable from "@/components/table/UserTable";


const SellerList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

 const { data: response, isLoading } = useGetAllUserQuery({
    page,
    limit: pageSize,
    searchTerm,
    isDisabled: false,
    role: "seller",
  });

  const title = "Seller";

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const seller = response?.data || [];
  
  return (
    <div className="p-4 space-y-6"> 
      <UserTable
        users={seller}
        loading={isLoading}
        setSearchTerm={setSearchTerm}
        pagination={{
          current: page,
          pageSize,
          total: seller.length,
        }}
        onChange={handleTableChange}
        title={title}
      />    
    </div>
  );
};

export default SellerList;
