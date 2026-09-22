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
  Tooltip,
  Modal,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useGetSpecificProductCommentQuery } from "@/Redux/features/comment/commentApi";
import {
  LikeOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { BiSolidLike } from "react-icons/bi";
import { FaCommentDots } from "react-icons/fa6";
import { getMediaUrl } from "@/utils/media";

interface BidsTableProps {
  statusLabel: string;
  allProductsResponse: any;
  isLoading: boolean;
}

interface Comment {
  _id: string;
  user: { email: string };
  comment: string;
  likes: string[];
  replies: Comment[];
  time: string;
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
  const [expandedReplyKeys, setExpandedReplyKeys] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

  const { data: commentsData, refetch: refetchBids } =
    useGetSpecificProductCommentQuery(expandedRowKeys[0], {
      skip: !expandedRowKeys.length,
    });

  useEffect(() => {
    if (allProductsResponse?.data) {
      setAllProducts(allProductsResponse.data);
    }
  }, [allProductsResponse?.data]);

  useEffect(() => {
    let productsWithBids = allProducts.filter(
      (product) => product.totalComment > 0
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
      setExpandedReplyKeys([]); // Collapse all replies
    }
  };

  const handleReplyExpand = (expanded: boolean, record: Comment) => {
    const key = record._id;
    if (expanded) {
      setExpandedReplyKeys((prev) => [...prev, key]);
    } else {
      setExpandedReplyKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const replyColumns: ColumnsType<Comment> = [
    { title: "Replier", dataIndex: ["user", "email"], key: "email" },

    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      render: (text) => (
        <Tooltip title={text}>
          <span className="text-sm md:text-base">
            {truncateComment(text, 20)}
          </span>
        </Tooltip>
      ),
    },
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
        <Button type="primary" size="small">
          Delete
        </Button>
      ),
    },
  ];

  const expandedReplyRender = (replies: Comment[]) => (
    <div className="p-4 bg-gray-100 rounded-lg">
      <Table
        columns={replyColumns}
        dataSource={replies}
        rowKey="_id"
        pagination={replies.length > 3 ? { pageSize: 3 } : false}
      />
    </div>
  );

  const expandedRowRender = (record: any) => {
    const commentData: Comment[] = commentsData?.data || [];

    const bidColumns: ColumnsType<Comment> = [
      { title: "Buyer", dataIndex: ["user", "email"], key: "email" },
      {
        title: "Comment",
        dataIndex: "comment",
        key: "comment",
        render: (text) => (
          <Tooltip title={text}>
            <span className="text-sm md:text-base">
              {truncateComment(text, 20)}
            </span>
          </Tooltip>
        ),
      },
      {
        title: "Total Likes",
        key: "totalLikes",
        render: (_, record) => (
          <Space>
            {record.likes?.length ? (
              <BiSolidLike className="text-blue-300" />
            ) : (
              <LikeOutlined />
            )}
            {record.likes?.length || 0}
          </Space>
        ),
      },
      {
        title: "Replies",
        key: "replies",
        render: (_, record) => (
          <Tooltip
            title={
              (record.replies?.length ?? 0) > 0
                ? "Click to Expand/Collapse Replies"
                : ""
            }
          >
            <Space
              className={
                (record.replies?.length ?? 0) > 0 ? "cursor-pointer" : ""
              }
              onClick={(event) => {
                event.stopPropagation(); // Prevent comment row toggle
                if ((record.replies?.length ?? 0) > 0) {
                  handleReplyExpand(
                    !expandedReplyKeys.includes(record._id),
                    record
                  );
                }
              }}
            >
              {(record.replies?.length ?? 0) > 0 ? (
                <FaCommentDots className="text-blue-300" />
              ) : (
                <MessageOutlined />
              )}
              {record.replies?.length || 0}
            </Space>
          </Tooltip>
        ),
      },
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
          <Button type="primary" size="small">
            Delete
          </Button>
        ),
      },
    ];

    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <Table
          columns={bidColumns}
          dataSource={commentData}
          rowKey="_id"
          pagination={commentData.length > 5 ? { pageSize: 5 } : false}
          expandable={{
            expandedRowRender: (comment) =>
              expandedReplyRender(comment.replies || []),
            rowExpandable: (comment) => (comment.replies?.length ?? 0) > 0,
            expandedRowKeys: expandedReplyKeys,
            onExpand: handleReplyExpand,
          }}
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
      title: "Total Comment",
      dataIndex: "totalComment",
      key: "totalComment",
      sorter: (a, b) => (a.totalComment || 0) - (b.totalComment || 0),
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
        new Date(a.endBid || 0).getTime() - new Date(b.endBid || 0).getTime(),
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
        // rowClassName={() => "cursor-pointer hover:bg-gray-50"}
        rowClassName={(record) => {
          if (expandedRowKeys.length && !expandedRowKeys.includes(record._id)) {
            return "cursor-default opacity-50 blur-xs";
          }
          return "cursor-pointer hover:bg-gray-50";
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalProducts,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={(pagination) => {
          setCurrentPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

function truncateComment(comment: string, length: number): React.ReactNode {
  if (comment.length > length) {
    return (
      <>
        {comment.substring(0, length)}...
        <Tooltip title={comment}>
          <Button
            type="link"
            onClick={() => {
              Modal.info({
                title: "Full Comment",
                content: <p>{comment}</p>,
                onOk() {},
              });
            }}
          >
            More
          </Button>
        </Tooltip>
      </>
    );
  }
  return comment;
}

export default BidsTable;
