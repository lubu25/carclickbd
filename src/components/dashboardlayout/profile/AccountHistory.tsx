"use client";
import React, { useEffect, useState } from "react";
import { Table, Tag, Button } from "antd";
import { useAppSelector } from "@/Redux/hooks";
import PageLoader from "@/components/shared/spinners/PageLoader";
import { usePathname } from "next/navigation";

const AccountHistory = () => {
  const [isClient, setIsClient] = useState(false);
  const [accountHistory, setAccountHistory] = useState<any[]>([]); // Mock data state
  const profileInfo = useAppSelector((state) => state.authReducer.profile);
  const pathname = usePathname();

  // Simulating fetching account history data
  useEffect(() => {
    setIsClient(true);

    // Mock data for account history
    const mockHistory = [
      {
        key: "1",
        date: "2025-04-01",
        transactionType: "Credit",
        amount: 500.0,
        description: "Payment received",
      },
      {
        key: "2",
        date: "2025-03-20",
        transactionType: "Debit",
        amount: -100.0,
        description: "Purchase of goods",
      },
      {
        key: "3",
        date: "2025-03-15",
        transactionType: "Credit",
        amount: 300.0,
        description: "Refund for returned items",
      },
      {
        key: "4",
        date: "2025-03-10",
        transactionType: "Debit",
        amount: -50.0,
        description: "Subscription fee",
      },
      {
        key: "5",
        date: "2025-03-01",
        transactionType: "Credit",
        amount: 200.0,
        description: "Gift received",
      },
    ];

    setAccountHistory(mockHistory);
  }, []);

  if (!isClient) return <PageLoader />;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text: string) => (
        <Tag color={text === "Credit" ? "green" : "volcano"}>{text}</Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text: number) => <span>${text.toFixed(2)}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span>{text}</span>,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
    <div className="container mx-auto py-6 px-4">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="font-bold text-xl mb-4">Account History</h2>
        <Table
          columns={columns}
          dataSource={accountHistory}
          pagination={{ pageSize: 5 }}
          rowKey="key"
          bordered
        />
        <div className="mt-4">
          <Button type="primary">Export History</Button>
        </div>
      </div>
    </div>
  </div>
    
  );
};

export default AccountHistory;

