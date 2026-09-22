"use client";
import React, { useState, useMemo } from "react";
import { message } from "antd";
import { useDeleteUserMutation, useGetAllUserQuery } from "@/Redux/api/userApi";
import { IUser } from "@/Interface/user";
import UserTable from "@/components/table/UserTable";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

 const { data: response, isLoading } = useGetAllUserQuery({
    page,
    limit: pageSize,
    searchTerm,
    isDisabled: true,
    role: "seller",
  });


  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const customers = response?.data || [];


  const title = "Disable Seller";

  return (
    <div className="p-6">
      <UserTable
        users={customers}
        loading={isLoading}
        onSearch={handleSearch}
        setSearchTerm={setSearchTerm}
        pagination={{
          current: page,
          pageSize,
          total: customers?.length, // Use filtered count
        }}
        title={title}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserManagement;
