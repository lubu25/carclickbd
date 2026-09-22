"use client";
import React, { useState, useMemo } from "react";
import { useGetAllUserQuery } from "@/Redux/api/userApi";
import UserTable from "../../../../../components/table/UserTable";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: response, isLoading } = useGetAllUserQuery({
    page,
    limit: pageSize,
    searchTerm,
    isDisabled: false,
    role: "customer",
  });

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const customers = useMemo(() => {
    return response?.data || [];
  }, [response]);

  const title = "Active User";

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
          total: response?.length,
        }}
        title={title}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default UserManagement;
