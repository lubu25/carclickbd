"use client";
import {
  Table,
  Button,
  message,
  Spin,
  Popconfirm,
  Tag,
  Menu,
  Dropdown,
  Input,
} from "antd";
import {
  EllipsisOutlined,
  UploadOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
} from "@/Redux/api/notificationApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useFormatTime from "@/hooks/useFormatTime";
import { INotification } from "@/Interface/notification";
import { useState, useEffect } from "react";

dayjs.extend(relativeTime);

type NotificationCategory = "messages" | "inquiries" | "products" | "all";

const getNotificationCategory = (notification: INotification): NotificationCategory => {
  const message = (notification?.message || "").toLowerCase();

  if (message.includes("inquiry")) return "inquiries";
  if (
    message.includes("new listing") ||
    message.includes("listing added") ||
    message.includes("product") ||
    message.includes("vehicle")
  ) {
    return "products";
  }

  return "messages";
};

const categoryLabels: Record<NotificationCategory, string> = {
  all: "Notifications",
  messages: "Messages",
  inquiries: "Inquiries",
  products: "Product Add Notifications",
};

const Notifications = ({
  category = "all",
}: {
  category?: NotificationCategory;
}) => {
  const { data: response = [], isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 1000,
  });
  const [updateNotifications] = useUpdateNotificationsMutation();
  const [removeNotification] = useDeleteNotificationMutation();
  const { formatTime } = useFormatTime();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<INotification[]>([]);

  useEffect(() => {
    if (Array.isArray(response)) {
      const filtered = response.filter((notification: INotification) => {
        const matchesCategory =
          category === "all" || getNotificationCategory(notification) === category;
        const matchesSearch = (notification.message ?? "")
          .toLowerCase()
          .includes(searchText.toLowerCase());

        return matchesCategory && matchesSearch;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [category, response, searchText]);

  const markAsRead = async (id: string) => {
    try {
      await updateNotifications(id).unwrap();
      message.success("Notification marked as read!");
    } catch (error) {
      message.error("Failed to update notification.");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await removeNotification(id).unwrap();
      message.success("Notification deleted!");
    } catch (error) {
      message.error("Failed to delete notification.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const columns: Array<{
    title: string;
    dataIndex?: keyof INotification;
    key: string;
    render?: (text: any, record: INotification) => JSX.Element;
    responsive?: Array<"xs" | "sm" | "md" | "lg" | "xl">;
    sorter?: (a: INotification, b: INotification) => number;
    defaultSortOrder?: "ascend" | "descend";
  }> = [
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text: string, record: INotification) => {
        const dynamicMessage =
          record.overBid && record.itemName
            ? (
                <span className="message-text">
                  {" "}
                  A new offer of{" "}
                  <span className="text-green-700 font-bold">
                    ${record.overBid}
                  </span>{" "}
                  has been submitted for{" "}
                  <a
                    href={`/auction-details/${record.product}`}
                    className="text-blue-500 hover:underline"
                  >
                    {record.itemName}
                  </a>
                  .
                </span>
              )
            : text;

        return (
          <span
            className={record.isRead ? "text-gray-500" : "cursor-pointer"}
            onClick={() => markAsRead(record._id)}
          >
            {dynamicMessage}
          </span>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md", "lg", "xl"],
      render: (createdAt: string) => <span>{formatTime(createdAt)}</span>,
      sorter: (a: INotification, b: INotification) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
      defaultSortOrder: "descend", // Show newest first
    },
    {
      title: "Status",
      dataIndex: "isRead",
      key: "isRead",
      render: (isRead: boolean) => (
        <Tag color={isRead ? "green" : "red"}>{isRead ? "Read" : "Unread"}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (_, record: INotification) => {
        const menu = (
          <Menu>
            <Menu.Item key="toggle-status">
              <Popconfirm
                title={`Mark as ${record.isRead ? "Unread" : "Read"}?`}
                onConfirm={() => markAsRead(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <div className="flex items-center">
                  {record.isRead ? (
                    <UploadOutlined className="text-green-500 mr-2" />
                  ) : (
                    <CloudDownloadOutlined className="text-gray-500 mr-2" />
                  )}
                  {record.isRead ? "Unread" : "Read"}
                </div>
              </Popconfirm>
            </Menu.Item>
            <Menu.Item key="delete">
              <Popconfirm
                title="Are you sure to delete this notification?"
                onConfirm={() => deleteNotification(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <div className="flex items-center text-red-500">
                  <DeleteOutlined className="mr-2" /> Delete
                </div>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003399]">
          Notification Center
        </p>
        <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              {categoryLabels[category]}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Review latest updates and mark important items when handled.
            </p>
          </div>
        <Input
          placeholder="Search notifications..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          className="max-w-md"
        />
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : filteredData?.length === 0 && searchText ? (
        <p>No notifications found matching your search.</p>
      ) : filteredData?.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          className="rounded-2xl bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
        />
      )}
    </div>
  );
};

export default Notifications;
