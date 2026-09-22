"use client";
import Avatar from "@/components/shared/avatar";
import React from "react";
import { message, Popconfirm, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useDeleteUserMutation, useGetAllUserQuery } from "@/Redux/api/userApi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IUser } from "@/Interface/user";
import { getMediaUrl } from "@/utils/media";

const AdminComponentPage = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id?: string) => {
    if (id) {
      try {
        message.info("Deleting....");
        const result = await deleteUser(id).unwrap();
        if (result?.statusCode === 200 && result?.success) {
          message.success(result?.message);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const adminTablecolumns: TableProps<IUser>["columns"] = [
    {
      title: "Profile",
      dataIndex: "profilePhoto",
      key: "profilePhoto",
      render: (profilePhoto) => (
        <Space size="middle">
          <Avatar src={getMediaUrl(profilePhoto)} />
        </Space>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: " email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag>{role}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            placement="top"
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record?._id as string)}
            okText="Yes"
            cancelText="No"
          >
            <button className="text-xl">
              <RiDeleteBinLine />
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const { data, isLoading } = useGetAllUserQuery({
    page: currentPage,
    limit: pageSize,
    role: ["admin", "super-admin"],
  });
  const users = data?.data || [];

  console.log(users);

  // Separate users into admins/super_admins

  return (
    <div>
      <h2 className="font-bold mb-2">Admins/Super Admins</h2>
      <Table
        columns={adminTablecolumns}
        dataSource={users}
        rowKey="_id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize,
          total: users.length,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            if (pageSize) {
              setPageSize(pageSize);
            }
          },
        }}
      />
    </div>
  );
};

export default AdminComponentPage;
