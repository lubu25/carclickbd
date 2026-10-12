"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Tooltip,
  message,
  Typography,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SyncOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  DollarOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { TrueReportOrder } from "@/lib/true-report/orders";

const { Text } = Typography;

export default function TrueReportReviewPage() {
  const [orders, setOrders] = useState<TrueReportOrder[]>([]);
  const [meta, setMeta] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Manual Order Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/true-report/orders?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
        if (data.meta) setMeta(data.meta);
      } else {
        message.error(data.message || "Failed to load orders");
      }
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      message.error("Network error loading True Report orders");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Live Gateway Verification
  const handleVerifyGateway = async (record: TrueReportOrder) => {
    setActionLoadingId(record.id);
    message.loading({ content: `Verifying Order ${record.orderId} with EPS Gateway...`, key: "verify" });

    try {
      const res = await fetch(`/api/true-report/orders/${encodeURIComponent(record.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_gateway" }),
      });
      const data = await res.json();

      if (data.success && data.verified) {
        message.success({ content: `Verified! Status: PAID (Txn: ${data.data?.transactionId || record.orderId})`, key: "verify" });
        fetchOrders();
      } else {
        message.warning({ content: data.message || "EPS Gateway reported transaction is not completed.", key: "verify" });
        fetchOrders();
      }
    } catch (err: any) {
      message.error({ content: err.message || "Gateway verification failed", key: "verify" });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle or Update Status manually
  const handleToggleStatus = async (record: TrueReportOrder, newStatus: string) => {
    setActionLoadingId(record.id);
    try {
      const res = await fetch(`/api/true-report/orders/${encodeURIComponent(record.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        message.success(`Status updated to ${newStatus}`);
        fetchOrders();
      } else {
        message.error(data.message || "Failed to update status");
      }
    } catch (err: any) {
      message.error("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Order
  const handleDelete = async (orderId: string) => {
    try {
      const res = await fetch(`/api/true-report/orders/${encodeURIComponent(orderId)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        message.success("Order deleted successfully");
        fetchOrders();
      } else {
        message.error(data.message || "Failed to delete order");
      }
    } catch {
      message.error("Delete failed");
    }
  };

  // Create Manual Order
  const handleCreateOrder = async (values: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/true-report/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.success) {
        message.success("Order created and access granted!");
        setIsModalOpen(false);
        form.resetFields();
        fetchOrders();
      } else {
        message.error(data.message || "Failed to create order");
      }
    } catch {
      message.error("Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const columns = [
    {
      title: "Order & Txn ID",
      key: "orderId",
      render: (_: any, record: TrueReportOrder) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
            <span>{record.orderId}</span>
            <Tooltip title="Copy Order ID">
              <CopyOutlined
                className="cursor-pointer text-slate-400 hover:text-[#003399]"
                onClick={() => copyToClipboard(record.orderId)}
              />
            </Tooltip>
          </div>
          {record.transactionId && record.transactionId !== record.orderId && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <span>Txn: {record.transactionId}</span>
              <Tooltip title="Copy Transaction ID">
                <CopyOutlined
                  className="cursor-pointer text-slate-400 hover:text-[#003399]"
                  onClick={() => copyToClipboard(record.transactionId!)}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Chassis Number",
      dataIndex: "chassis",
      key: "chassis",
      render: (chassis: string, record: TrueReportOrder) => (
        <div className="space-y-1">
          <Tag color="geekblue" className="font-mono font-bold text-xs px-2 py-0.5">
            {chassis}
          </Tag>
          <div>
            <a
              href={`/auction-sheets?status=success&chassis=${encodeURIComponent(chassis)}&order=${record.orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#003399] hover:underline"
            >
              <EyeOutlined /> Open Report
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "Customer Info",
      key: "customer",
      render: (_: any, record: TrueReportOrder) => (
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-slate-900">{record.customerName || "Guest User"}</p>
          {record.customerPhone && (
            <p className="text-slate-600">
              <a href={`tel:${record.customerPhone}`} className="hover:underline">
                📞 {record.customerPhone}
              </a>
            </p>
          )}
          {record.customerEmail && (
            <p className="text-slate-500 text-[11px]">✉️ {record.customerEmail}</p>
          )}
        </div>
      ),
    },
    {
      title: "Amount & Method",
      key: "amount",
      render: (_: any, record: TrueReportOrder) => (
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-slate-900">
            ৳ {record.amount}
            {record.discountAmount > 0 && (
              <span className="ml-1 text-[11px] font-normal text-emerald-600 line-through">
                ৳ {record.originalPrice}
              </span>
            )}
          </p>
          <p className="text-[11px] text-slate-600">
            {record.paymentMethod || "EPS Gateway"}
          </p>
          {record.couponCode && (
            <Tag color="purple" className="text-[10px] mt-0.5">
              🎟️ {record.couponCode}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: TrueReportOrder) => {
        const isPaid = record.paymentVerified && record.paymentStatus === "PAID";
        const isPending = record.paymentStatus === "PENDING";

        return (
          <div className="space-y-1">
            {isPaid ? (
              <Tag icon={<CheckCircleOutlined />} color="success" className="font-bold">
                VERIFIED / PAID
              </Tag>
            ) : isPending ? (
              <Tag icon={<ClockCircleOutlined />} color="warning" className="font-bold">
                PENDING
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error" className="font-bold">
                FAILED / CANCELLED
              </Tag>
            )}

            <div className="text-[10px] text-slate-500">
              Source:{" "}
              <strong>
                {record.verificationSource === "EPS_GATEWAY"
                  ? "EPS Gateway"
                  : record.verificationSource === "COUPON"
                  ? "Coupon"
                  : record.verificationSource === "ADMIN_MANUAL"
                  ? "Admin Manual"
                  : "Unverified"}
              </strong>
            </div>
          </div>
        );
      },
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="text-xs text-slate-600">
          <p>{date ? moment(date).format("DD MMM YYYY") : "N/A"}</p>
          <p className="text-[11px] text-slate-400">{date ? moment(date).format("hh:mm A") : ""}</p>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_: any, record: TrueReportOrder) => {
        const isLoading = actionLoadingId === record.id;
        const isPaid = record.paymentVerified && record.paymentStatus === "PAID";

        return (
          <Space direction="vertical" size={4} className="w-full">
            <div className="flex items-center gap-1.5">
              {/* Verify with EPS Gateway */}
              <Tooltip title="Query live EPS Gateway for payment confirmation">
                <Button
                  size="small"
                  type="primary"
                  icon={<SyncOutlined spin={isLoading} />}
                  onClick={() => handleVerifyGateway(record)}
                  loading={isLoading}
                  className="bg-[#003399]"
                >
                  Verify
                </Button>
              </Tooltip>

              {/* Status Toggle (Approve / Revoke) */}
              {isPaid ? (
                <Tooltip title="Mark as Pending / Revoke Access">
                  <Button
                    size="small"
                    danger
                    onClick={() => handleToggleStatus(record, "PENDING")}
                    disabled={isLoading}
                  >
                    Revoke
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Manually Approve / Grant Access">
                  <Button
                    size="small"
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => handleToggleStatus(record, "PAID")}
                    disabled={isLoading}
                  >
                    Approve
                  </Button>
                </Tooltip>
              )}

              {/* Delete */}
              <Popconfirm
                title="Delete this order record?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes, Delete"
                cancelText="Cancel"
              >
                <Button
                  size="small"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={isLoading}
                />
              </Popconfirm>
            </div>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SafetyCertificateOutlined className="text-2xl text-[#003399]" />
            <h1 className="text-2xl font-black text-slate-900">
              True Report Review &amp; Payment Management
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Monitor, verify, and approve customer payments for Japanese Auction Sheet True Reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOrders}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-[#003399]"
          >
            Add Manual Order
          </Button>
        </div>
      </div>

      {/* 2. Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="shadow-xs border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Orders
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {meta.totalOrders}
          </div>
        </Card>

        <Card className="shadow-xs border-emerald-200 bg-emerald-50/40">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Verified / Paid
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            {meta.paidOrders}
          </div>
        </Card>

        <Card className="shadow-xs border-amber-200 bg-amber-50/40">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Pending Gateway
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700">
            {meta.pendingOrders}
          </div>
        </Card>

        <Card className="shadow-xs border-blue-200 bg-blue-50/40">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Total Revenue
          </div>
          <div className="mt-2 text-2xl font-black text-blue-800">
            ৳ {meta.totalRevenue.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* 3. Search & Filter Bar */}
      <Card className="shadow-xs border-slate-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search by Chassis Number, Transaction ID, Order ID, Phone..."
            prefix={<SearchOutlined className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-md"
            allowClear
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Status:</span>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
              options={[
                { value: "ALL", label: "All Orders" },
                { value: "PAID", label: "Verified / Paid" },
                { value: "PENDING", label: "Pending" },
                { value: "FAILED", label: "Failed" },
                { value: "COUPON", label: "Coupon Orders" },
              ]}
            />
          </div>
        </div>

        {/* 4. Orders Table */}
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              pageSizeOptions: ["10", "15", "30", "50"],
            }}
            scroll={{ x: 1000 }}
          />
        </div>
      </Card>

      {/* 5. Manual Order Creation Modal */}
      <Modal
        title="Add Manual True Report Order"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateOrder}
          initialValues={{
            amount: 500,
            paymentStatus: "PAID",
            paymentMethod: "Manual Admin Approval",
          }}
          className="mt-4"
        >
          <Form.Item
            name="chassis"
            label="Chassis Number"
            rules={[
              { required: true, message: "Chassis number is required" },
              { min: 3, message: "Valid chassis number required" },
            ]}
          >
            <Input placeholder="e.g. ZVG11-1074071" className="uppercase font-mono font-bold" />
          </Form.Item>

          <Form.Item
            name="customerName"
            label="Customer Name"
          >
            <Input placeholder="Customer full name" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="customerPhone"
              label="Phone Number"
            >
              <Input placeholder="01XXXXXXXXX" />
            </Form.Item>

            <Form.Item
              name="customerEmail"
              label="Email"
            >
              <Input type="email" placeholder="customer@example.com" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="amount"
              label="Amount (BDT)"
              rules={[{ required: true, message: "Amount is required" }]}
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>

            <Form.Item
              name="paymentStatus"
              label="Payment Status"
            >
              <Select
                options={[
                  { value: "PAID", label: "PAID (Grant Access)" },
                  { value: "PENDING", label: "PENDING" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="paymentMethod"
            label="Payment Method"
          >
            <Select
              options={[
                { value: "Manual Admin Approval", label: "Manual Admin Approval" },
                { value: "bKash (Direct/Personal)", label: "bKash (Direct/Personal)" },
                { value: "Nagad (Direct/Personal)", label: "Nagad (Direct/Personal)" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Cash Payment", label: "Cash Payment" },
              ]}
            />
          </Form.Item>

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#003399]">
              Create &amp; Grant Access
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
