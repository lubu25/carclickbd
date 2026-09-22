"use client";
import React, { useState, useMemo } from "react";
import { Table, Button, Card, Badge, Typography, Space, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { IOrder } from "@/Interface/order";
import PaymentModal from "../Modal/PaymentModal";
import {
  EyeOutlined,
  DollarCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "@/Redux/hooks";

const { Text, Title } = Typography;

interface MyOrderTableProps {
  orders: IOrder[];
  loading: boolean;
  onSearch: (value: string) => void;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  title: string;
  onChange: (pagination: any) => void;
  onPaymentInitiated: (orderId: string, paymentMethod: string) => void;
}

const OrderTable: React.FC<MyOrderTableProps> = ({
  orders,
  loading,
  onSearch,
  setSearchTerm,
  pagination,
  title,
  onChange,
  onPaymentInitiated = () => {},
}) => {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    order: IOrder | null;
  }>({
    open: false,
    order: null,
  });

  const [searchText, setSearchText] = useState("");
  const user = useAppSelector((state) => state.authReducer.profile);

  const showPaymentModal = (order: IOrder) => {
    setPaymentModal({ open: true, order });
  };

  const closePaymentModal = () => {
    setPaymentModal({ open: false, order: null });
  };

  const handlePaymentSuccess = (paymentMethod: string) => {
    if (paymentModal.order) {
      onPaymentInitiated(paymentModal.order._id, paymentMethod);
      closePaymentModal();
    }
  };

  const filteredOrders = useMemo(() => {
    const keyword = searchText.toLowerCase();
    return orders.filter((order) => {
      const searchable = [
        order.orderNumber,
        order.orderType,
        order.paymentStatus,
        order.chassisNumber,
        order.buyerInfo?.name,
        order.buyerInfo?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(keyword);
    });
  }, [orders, searchText]);

  const columns: ColumnsType<IOrder> = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "_id",
      render: (id: string, record) => <Text code>{id || record._id}</Text>,
      sorter: (a, b) =>
        (a.orderNumber ?? "").localeCompare(b.orderNumber ?? ""),
    },
    {
      title: "Order Type",
      dataIndex: "orderType",
      key: "orderType",
      render: (type: string) => <Text>{type || "Order"}</Text>,
      sorter: (a, b) => (a.orderType ?? "").localeCompare(b.orderType ?? ""),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          BDT {Number(amount || 0).toLocaleString("en-US")}
        </Text>
      ),
      sorter: (a, b) => Number(a.totalAmount || 0) - Number(b.totalAmount || 0),
      align: "right",
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.buyerInfo?.name || "N/A"}</Text>
          <Text type="secondary">{record.buyerInfo?.email || ""}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "isPending",
      render: (_, record) => (
        <Badge
          status={
            record.paymentStatus === "PAID" || record.isPending === false
              ? "success"
              : record.paymentStatus === "FAILED"
                ? "error"
                : "processing"
          }
          text={
            record.paymentStatus ||
            (record.isPending === false ? "PAID" : "PENDING")
          }
        />
      ),
      filters: [
        { text: "Pending", value: true },
        { text: "Paid", value: false },
      ],
      onFilter: (value, record) => record.isPending === value,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("MMM D, hh:mm A"),
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const orderUserId =
          typeof record?.user === "string" ? record.user : record?.user?._id;
        const isMyOrder = orderUserId === user?._id;
        return (
          <Space size="middle">
            <Button
              icon={<EyeOutlined />}
              size="small"
              title="View Order Details"
            >
              View
            </Button>
            {record.isPending && isMyOrder ? (
              <Button
                type="primary"
                size="small"
                onClick={() => showPaymentModal(record)}
                icon={<DollarCircleOutlined />}
                title="Make Payment"
              >
                Pay
              </Button>
            ) : (
              <Button
                disabled
                size="small"
                title={
                  isMyOrder ? "Order Already Paid" : "Cannot Pay for Others"
                }
              >
                {record.isPending ? "Pending" : "Paid"}
              </Button>
            )}
          </Space>
        );
      },
      align: "center",
    },
  ];

  return (
    <div className="p-4">
      <Card>
        <div className="flex justify-between items-center">
          <h2 className="mb-4 text-xs lg:text-2xl font-bold">
            {title}
          </h2>
          <Input
            placeholder="Search by Order ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginBottom: 16 }}
            allowClear
          />
        </div>
      </Card>

      <Card className="shadow-md">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} orders`,
          }}
          loading={loading}
          scroll={{ x: true }}
          onChange={onChange}
        />
      </Card>

      <PaymentModal
        isOpen={paymentModal.open}
        onClose={closePaymentModal}
        order={paymentModal.order}
        totalAmount={paymentModal.order?.totalAmount ?? 0}
        onPaymentSuccess={handlePaymentSuccess}
        paymentStatus={paymentModal.order?.isPending ? "Pending" : "Success"}
        setPaymentStatus={(status: string | null) => {
          if (paymentModal.order && status !== null) {
            paymentModal.order.isPending = status === "Pending";
          }
        }}
      />
    </div>
  );
};

export default OrderTable;
