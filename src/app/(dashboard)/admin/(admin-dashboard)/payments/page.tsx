"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Table, Card, Tabs, Tag, Button, Tooltip, message, Popconfirm, Typography, Space } from "antd";
import { useGetPaymentQuery } from "@/Redux/api/paymentApi";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  CopyOutlined,
  SafetyCertificateOutlined,
  CreditCardOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { TrueReportOrder } from "@/lib/true-report/orders";
import Link from "next/link";

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState("true-reports");

  // General Payments (Backend API)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useGetPaymentQuery({
    page,
    limit: pageSize,
  });

  const responseData: any = data;
  const payments = responseData?.myPayments?.data?.data || responseData?.myPayments?.data || responseData?.data || responseData?.myPayments || [];
  const total = responseData?.myPayments?.data?.meta?.total || responseData?.meta?.total || payments.length;

  // True Report Orders
  const [trueReportOrders, setTrueReportOrders] = useState<TrueReportOrder[]>([]);
  const [loadingTrueReports, setLoadingTrueReports] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchTrueReports = useCallback(async () => {
    setLoadingTrueReports(true);
    try {
      const res = await fetch("/api/true-report/orders");
      const json = await res.json();
      if (json.success) {
        setTrueReportOrders(json.data || []);
      }
    } catch {
      message.error("Could not load True Report payments");
    } finally {
      setLoadingTrueReports(false);
    }
  }, []);

  useEffect(() => {
    fetchTrueReports();
  }, [fetchTrueReports]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const handleVerifyGateway = async (record: TrueReportOrder) => {
    setVerifyingId(record.id);
    message.loading({ content: `Verifying Order ${record.orderId} with EPS Gateway...`, key: "verify" });

    try {
      const res = await fetch(`/api/true-report/orders/${encodeURIComponent(record.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_gateway" }),
      });
      const data = await res.json();

      if (data.success && data.verified) {
        message.success({ content: "Payment Verified by EPS Gateway!", key: "verify" });
        fetchTrueReports();
      } else {
        message.warning({ content: data.message || "Payment not verified by gateway", key: "verify" });
        fetchTrueReports();
      }
    } catch {
      message.error({ content: "Verification error", key: "verify" });
    } finally {
      setVerifyingId(null);
    }
  };

  const trueReportColumns = [
    {
      title: "Transaction & Order ID",
      key: "ids",
      render: (_: any, record: TrueReportOrder) => (
        <div className="space-y-0.5 font-mono text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <span>{record.orderId}</span>
            <CopyOutlined
              className="cursor-pointer text-slate-400 hover:text-[#003399]"
              onClick={() => copyToClipboard(record.orderId)}
            />
          </div>
          {record.transactionId && record.transactionId !== record.orderId && (
            <div className="text-[11px] text-slate-500">
              Txn: {record.transactionId}
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
              <EyeOutlined /> View Report
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: TrueReportOrder) => (
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-slate-900">{record.customerName || "Guest"}</p>
          {record.customerPhone && <p className="text-slate-600">{record.customerPhone}</p>}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: TrueReportOrder) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900">৳ {amount}</span>
          {record.couponCode && (
            <Tag color="purple" className="text-[10px] ml-1">
              {record.couponCode}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => method || "EPS Gateway",
    },
    {
      title: "Payment Status",
      key: "status",
      render: (_: any, record: TrueReportOrder) => {
        const isPaid = record.paymentVerified && record.paymentStatus === "PAID";
        const isPending = record.paymentStatus === "PENDING";
        return isPaid ? (
          <Tag icon={<CheckCircleOutlined />} color="success" className="font-bold">
            VERIFIED / PAID
          </Tag>
        ) : isPending ? (
          <Tag icon={<ClockCircleOutlined />} color="warning" className="font-bold">
            PENDING
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error" className="font-bold">
            FAILED
          </Tag>
        );
      },
    },
    {
      title: "Transaction Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => date ? moment(date).format("DD MMM YYYY, hh:mm A") : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: TrueReportOrder) => (
        <Button
          size="small"
          type="primary"
          icon={<SyncOutlined spin={verifyingId === record.id} />}
          onClick={() => handleVerifyGateway(record)}
          loading={verifyingId === record.id}
          className="bg-[#003399]"
        >
          Verify
        </Button>
      ),
    },
  ];

  const generalColumns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text: string, record: any) => text || record.id || record._id?.substring(0, 10),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `৳ ${amount || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color = status === "PAID" || status?.toLowerCase() === "success" ? "green" : "orange";
        return <span style={{ color, fontWeight: 'bold' }}>{status?.toUpperCase() || "PENDING"}</span>;
      }
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method: string) => method || "Online Gateway",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => date ? moment(date).format("DD MMM YYYY, hh:mm A") : "N/A",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Payment Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            View, verify, and track all incoming transactions across True Reports and vehicle bookings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/true-reports">
            <Button type="primary" icon={<SafetyCertificateOutlined />} className="bg-[#003399]">
              Open True Report Review
            </Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-xs border-slate-200">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "true-reports",
              label: (
                <span className="flex items-center gap-1.5 font-bold">
                  <SafetyCertificateOutlined /> True Report Payments ({trueReportOrders.length})
                </span>
              ),
              children: (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-semibold">
                      Live records of customer True Report purchases with Chassis numbers &amp; EPS Gateway statuses.
                    </span>
                    <Button
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={fetchTrueReports}
                      loading={loadingTrueReports}
                    >
                      Refresh
                    </Button>
                  </div>
                  <Table
                    columns={trueReportColumns}
                    dataSource={trueReportOrders}
                    loading={loadingTrueReports}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 950 }}
                  />
                </div>
              ),
            },
            {
              key: "general-payments",
              label: (
                <span className="flex items-center gap-1.5 font-bold">
                  <CreditCardOutlined /> General Vehicle Orders ({total})
                </span>
              ),
              children: (
                <div className="pt-2">
                  <Table
                    columns={generalColumns}
                    dataSource={Array.isArray(payments) ? payments : []}
                    loading={isLoading}
                    rowKey={(record: any) => record._id || record.id || Math.random().toString()}
                    pagination={{
                      current: page,
                      pageSize,
                      total,
                      onChange: (p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                      },
                    }}
                    scroll={{ x: 800 }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default PaymentsPage;

