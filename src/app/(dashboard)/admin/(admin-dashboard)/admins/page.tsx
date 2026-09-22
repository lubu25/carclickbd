"use client";
import React, { useState } from "react";
import {useGetAllAdminQuery, useGetAllCustomerQuery, useGetAllUserQuery} from "@/Redux/api/userApi";
import UserTable from "@/components/table/UserTable";


const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

 const { data: response, isLoading } = useGetAllUserQuery({
    page,
    limit: pageSize,
    searchTerm,
    isDisabled: false,
    role: "admin",
  });
  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };
  const admins = response?.data || [];
  const title = "Admin";
  return (
    <div className="p-4 space-y-6"> 
      <UserTable
        users={admins}
        loading={isLoading}
        setSearchTerm={setSearchTerm}
        pagination={{
          current: page,
          pageSize,
          total: admins.length,
        }}
        onChange={handleTableChange}
        title={title}
      />    
    </div>
  );
};

export default UserManagement;
