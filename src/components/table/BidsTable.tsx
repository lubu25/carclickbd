"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Avatar,
  Badge,
  Button,
  message,
  Input,
  Row,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetSpecificProductBidsQuery } from "@/Redux/features/bids/bidsApi";
import dayjs from "dayjs";
import { getMediaUrl } from "@/utils/media";

interface BidsTableProps {
  statusLabel: string;
  allProductsResponse: any;
  isLoading: boolean;
}

const BidsTable: React.FC<BidsTableProps> = ({
  statusLabel,
  allProductsResponse,
  isLoading,
}) => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  //   const { data: allProductsResponse, isLoading: isAllProductsLoading } = useGetAllProductQuery();
  const { data: bidsData, refetch: refetchBids } =
    useGetSpecificProductBidsQuery(expandedRowKeys[0], {
      skip: !expandedRowKeys.length,
    });

  useEffect(() => {
    if (allProductsResponse?.data) {
      setAllProducts(allProductsResponse.data);
    }
  }, [allProductsResponse?.data]);

  useEffect(() => {
    let productsWithBids = allProducts.filter(
      (product) => product.totalBids > 0
    );

    if (titleFilter) {
      productsWithBids = productsWithBids.filter((product) =>
        product.title?.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }

    if (searchQuery) {
      productsWithBids = productsWithBids.filter((product) =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setTotalProducts(productsWithBids.length);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setFilteredProducts(productsWithBids.slice(startIndex, endIndex));
  }, [allProducts, currentPage, pageSize, searchQuery, titleFilter]);

  const handleExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      setExpandedRowKeys([record._id]);
      refetchBids();
    } else {
      setExpandedRowKeys([]);
    }
  };

  const sendEmail = () => {
    message.success("Email sent successfully");
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to the first page after searching
  };

  const expandedRowRender = (record: any) => {
    const bidData = bidsData?.data || [];
    const totalBids = bidData.length;

    const bidColumns: ColumnsType<any> = [
      { title: "Buyer", dataIndex: ["user", "email"], key: "email" },
      { title: "Amount", dataIndex: "bidAmount", key: "bidAmount" },
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
        render: (time) => dayjs(time).format("MMM D,YY, HH:mm"),
      },
      {
        title: "Action",
        key: "action",
        render: () => (
          <Button type="primary" onClick={sendEmail}>
            Send Email
          </Button>
        ),
      },
    ];

    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <Table
          columns={bidColumns}
          dataSource={bidData}
          pagination={totalBids > 5 ? { pageSize: 5 } : false}
        />
      </div>
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: "Title",
      key: "title",
      render: (_, record) => (
        <Space>
          <Avatar
            shape="square"
            size={32}
            src={getMediaUrl(record.photos?.mainPhoto)}
            alt={record.title}
          />
          <span className="font-semibold">{record.title || "No name"}</span>
        </Space>
      ),
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Latest Offer",
      dataIndex: "highestBid",
      key: "highestBid",
      sorter: (a, b) => (a.highestBid || 0) - (b.highestBid || 0),
    },
    {
      title: "Total Inquiries",
      key: "totalBids",
      render: (_, record) => (
        <span className="font-medium">{record?.totalBids ?? "No Inquiries"}</span>
      ),
      sorter: (a, b) => (a.totalBids || 0) - (b.totalBids || 0),
    },
    {
      title: "Listing Date",
      key: "endBid",
      render: (_, record) => {
        const endBid = record?.endBid;
        return (
          <span className="text-gray-600">
            {endBid ? dayjs(endBid).format("MMM D, YY HH:mm") : "N/A"}
          </span>
        );
      },
      sorter: (a, b) =>
        (new Date(a.endBid || 0) as any) - (new Date(b.endBid || 0) as any),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Badge
          status={record.isActive ? "error" : "success"}
          text={<span className="capitalize">{statusLabel}</span>}
        />
      ),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <Row gutter={16} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Input.Search
            placeholder="Search by Title"
            onSearch={handleSearch}
            enterButton
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        loading={isLoading}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpand: handleExpand,
          expandRowByClick: true,
        }}
        rowClassName={() => "cursor-pointer hover:bg-gray-50"}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalProducts,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default BidsTable;
