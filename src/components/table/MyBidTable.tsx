"use client";
import React, { useState } from "react";
import { Table, Button, Card, Badge, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import useBiddingTimer from "@/hooks/useBiddingTimer";

interface Bid {
  _id: string;
  product?: {
    _id: string;
    title: string;
    endBid?: string;
  } | null;
  bidAmount: number;
  isWinner: boolean;
  createdAt: string;
}

interface MyBidTableProps {
  bids: Bid[] | null;
}

const MyBidTable: React.FC<MyBidTableProps> = ({ bids = [] }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const ListingDateCell: React.FC<{ endBid?: string }> = ({ endBid }) => {
    const { timeRemaining, isCritical, daysLeft } = useBiddingTimer(
      endBid || ""
    );

    if (!endBid) {
      return <span>N/A</span>;
    }

    return (
      <span>
        {dayjs(endBid).format("MMM D, YYYY HH:mm")}
        <span
          className={`${
            isCritical
              ? "text-red-500 font-bold px-2"
              : "text-green-500 font-bold px-2"
          }`}
        >
          ({daysLeft || timeRemaining})
        </span>
      </span>
    );
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const filteredBids = bids?.filter((bid) => {
    const productTitle = bid?.product?.title?.toLowerCase() || "";
    return productTitle.includes(searchQuery.toLowerCase());
  });

  const columns: ColumnsType<Bid> = [
    {
      title: "Vehicle",
      dataIndex: ["product", "title"],
      key: "productTitle",
      sorter: (a, b) =>
        a?.product?.title?.localeCompare(b?.product?.title || "") || 0,
      render: (_, record) => record?.product?.title || "Unknown Product",
    },
    {
      title: "Inquiry Amount",
      dataIndex: "bidAmount",
      key: "bidAmount",
      sorter: (a, b) => a.bidAmount - b.bidAmount,
      render: (amount: number) => `$${amount?.toLocaleString()}`,
    },
    {
      title: "Listing Date",
      key: "endBid",
      responsive: ["md", "lg", "xl"],
      render: (_, record) => (
        <ListingDateCell endBid={record?.product?.endBid} />
      ),
      sorter: (a, b) => {
        const endBidA = a?.product?.endBid;
        const endBidB = b?.product?.endBid;

        if (!endBidA || !endBidB) return 0;
        return dayjs(endBidA).isBefore(dayjs(endBidB)) ? -1 : 1;
      },
    },
    {
      title: "Status",
      key: "isWinner",
      render: (_, record) => (
        <Badge
          status={record.isWinner ? "error" : "success"}
          text={record.isWinner ? "Selected" : "Submitted"}
        />
      ),
      filters: [
        { text: "Submitted", value: false },
        { text: "Selected", value: true },
      ],
      onFilter: (value, record) => record.isWinner === value,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="filled"
            icon={<EyeOutlined />}
            href={`/car-details/${record.product?._id}`}
          >
            View Car
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card >
        <div className="lg:flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">My Inquiries</h1>
          <div className="mb-4">
            <Input.Search
              placeholder="Search by vehicle"
              onSearch={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
          </div>
        </div>
      </Card>
      <Card className="shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredBids || []}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default MyBidTable;
