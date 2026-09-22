"use client";
import React, { useState } from "react";
import { Table, Card } from "antd";
import { useGetPaymentQuery } from "@/Redux/api/paymentApi";
import moment from "moment";

const PaymentsPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data, isLoading } = useGetPaymentQuery({
    page,
    limit: pageSize,
  });

  // Depending on the backend response structure, extract the data array
  const responseData: any = data;
  const payments = responseData?.myPayments?.data?.data || responseData?.myPayments?.data || responseData?.data || responseData?.myPayments || [];
  const total = responseData?.myPayments?.data?.meta?.total || responseData?.meta?.total || payments.length;

  const columns = [
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
    <div className="p-6">
      <Card title="Payment History" className="shadow-md">
        <Table
          columns={columns}
          dataSource={Array.isArray(payments) ? payments : []}
          loading={isLoading}
          rowKey={(record: any) => record._id || record.id || Math.random().toString()}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default PaymentsPage;
