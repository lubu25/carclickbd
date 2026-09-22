import {
  Table,
  Space,
  Button,
  Input,
  Popconfirm,
  Tag,
  Tooltip,
  message,
  Row,
  Col,
  Card,
  Descriptions,
  Modal,
  Avatar,
} from "antd";
import {
  UserOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { IUser } from "@/Interface/user";
import CustomAvatar from "@/components/shared/avatar";
import { IoEye } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

import {
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} from "@/Redux/api/userApi";
import { useImpersonateUserMutation } from "@/Redux/api/authApi";
import { setIsLoggedIn, setProfileInfo } from "@/Redux/Slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import StatsCard from "./StatsCard";
import { TeamOutlined } from "@ant-design/icons";
import { FaUserCheck } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserDetailsModal from "../Modal/UserDetailsModal";

interface UserTableProps {
  users: IUser[];
  loading: boolean;
  title?: string;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onSearch?: (value: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  onChange: (pagination: any) => void;
}

const OrderTable: React.FC<UserTableProps> = ({
  users,
  loading,
  pagination,
  onChange,
  title,
}) => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.authReducer.profile);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteUser] = useDeleteUserMutation();
  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [impersonateUser, { isLoading: isImpersonating }] =
    useImpersonateUserMutation();

  const getDashboardPath = (role?: IUser["role"]) => {
    if (role === "admin" || role === "super-admin") return "/admin";
    if (role === "seller") return "/seller";
    return "/customer";
  };

  const handleLoginAsUser = async (user: IUser) => {
    if (!user._id) {
      message.error("Invalid user ID");
      return;
    }

    try {
      const response = await impersonateUser(user._id).unwrap();
      const accessToken = response?.data?.accessToken;
      const profile = response?.data?.user;

      if (!accessToken || !profile) {
        message.error("Unable to start user session");
        return;
      }

      dispatch(setIsLoggedIn(accessToken));
      dispatch(setProfileInfo(profile));
      message.success(`Logged in as ${profile.name || profile.email}`);
      router.push(getDashboardPath(profile.role));
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to login as this user");
    }
  };

  const getImpersonationBlockReason = (user: IUser) => {
    if (user.isDisabled === true || user.isDisabled === "disable") {
      return "Disabled users cannot be impersonated";
    }

    if (
      currentUser?.role === "admin" &&
      (user.role === "admin" || user.role === "super-admin")
    ) {
      return "Only super admin can login as admin accounts";
    }

    if (currentUser?.role !== "admin" && currentUser?.role !== "super-admin") {
      return "Only admin and super admin can use this action";
    }

    return null;
  };

  const handleToggleStatus = async (user: IUser) => {
    if (!user._id) {
      message.error("Invalid user ID");
      return;
    }

    try {
      await toggleUserStatus({ id: user._id }).unwrap();

      message.success(
        `User ${user.isDisabled ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      message.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleViewUser = (user: IUser) => {
    setIsModalVisible(true);
    setSelectedUser(user);
  };

  const columns: ColumnsType<IUser> = [
    {
      title: "Profile",
      dataIndex: "profilePhoto",
      key: "profilePhoto",
      render: (_, record) => {
        return (
          <Space size="middle">
            <CustomAvatar />
            {/* <CustomAvatar src={record?.profilePhoto} /> */}
          </Space>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <Space>
          <span>{record.name || "No name"}</span>
        </Space>
      ),
      filterMode: "tree",
      filterSearch: true,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    ...(users.some((user) => user.role === "seller")
      ? [
          {
            title: "Total Product",
            dataIndex: "totalProduct",
            key: "totalProduct",
            sorter: (a: IUser, b: IUser) =>
              (a.totalProduct || 0) - (b.totalProduct || 0),
            render: (_: any, record: IUser) =>
              record.role === "seller" ? record.totalProduct || 0 : "N/A",
          },
        ]
      : []),
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Super-Admin", value: "super-admin" },
        { text: "Admin", value: "admin" },
        { text: "Customer", value: "customer" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Status",
      dataIndex: "isDisabled",
      key: "isDisabled",
      render: (isDisabled) => (
        <Tag color={isDisabled ? "red" : "green"}>
          {isDisabled ? "Disabled" : "Active"}
        </Tag>
      ),
      filters: [
        { text: "Disabled", value: "disabled" },
        { text: "Active", value: "active" },
      ],
      onFilter: (value, record) => record.role === value,
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const impersonationBlockReason = getImpersonationBlockReason(record);

        return (
          <div className="flex gap-2">
            <Tooltip title={impersonationBlockReason || "Login as this user"}>
              <span>
                <Popconfirm
                  title={`Login as ${record.name || record.email}?`}
                  description="Your current admin session will switch to this user account."
                  onConfirm={() => handleLoginAsUser(record)}
                  okText="Login"
                  cancelText="Cancel"
                  disabled={Boolean(impersonationBlockReason)}
                >
                  <Button
                    size="small"
                    icon={<LoginOutlined />}
                    loading={isImpersonating}
                    disabled={Boolean(impersonationBlockReason)}
                  >
                    Login
                  </Button>
                </Popconfirm>
              </span>
            </Tooltip>
          <Popconfirm
            title={`Are you sure you want to ${record.isDisabled ? "enable" : "disable"} this user?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type={record.isDisabled ? "default" : "dashed"}>
              {record.isDisabled ? "Enable" : "Disable"}
            </Button>
          </Popconfirm>
          <Button
            variant="filled"
            color="primary"
            size="small"
            type="primary"
            onClick={() => handleViewUser(record)}
          >
            <Tooltip title="View Product detail" color="gray">
              <IoEye className="text-green-600 hover:text-gray-800 cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110" />
            </Tooltip>
          </Button>
          <Button variant="filled" color="danger" size="small" type="primary">
            <Popconfirm
              title="Delete user"
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
              description="Are you sure you want to delete this user?"
              onConfirm={() => record._id && handleDeleteUser(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete Product" color="red">
                <MdOutlineDelete className="text-red-600 hover:text-red-400 cursor-pointer transform transition-transform duration-200 ease-in-out hover:scale-110" />
              </Tooltip>
            </Popconfirm>
          </Button>
        </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-md rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">{title} List</h1>
          <div className="lg:w-full max-w-lg">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={6} xs={12} md={8} lg={6} className="mb-4">
          <StatsCard
            title={`Total Users`}
            value={users.length}
            icon={<TeamOutlined />}
            bgColor="bg-white"
            textColor="text-green-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Total Active"
            value={users.length}
            icon={<FaUserCheck />}
            bgColor="bg-white"
            textColor="text-blue-500"
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        onChange={onChange}
        scroll={{ x: true }}
      />
      <UserDetailsModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
};

export default OrderTable;
