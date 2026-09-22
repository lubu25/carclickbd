"use client";
import React, { useState, useMemo } from "react";
import { Table, Space, Avatar, Badge, Button, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useGetCommentHistoryQuery } from "@/Redux/features/comment/commentApi";
import { LikeOutlined, MessageOutlined } from "@ant-design/icons"; // Import Ant Design icons

const CommentTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, refetch, isLoading } = useGetCommentHistoryQuery();
  const commentData = data?.data || [];

  console.log("Comment Data", commentData);
  

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const truncateComment = (text: string, length: number) => {
    if (text.length > length) {
      return (
        <>
          {text.substring(0, length)}...
          <Button
            type="link"
            onClick={() => {
              setSelectedComment(text);
              setIsModalVisible(true);
            }}
          >
            See More
          </Button>
        </>
      );
    }
    return text;
  };

  const columns: ColumnsType<any> = [
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (commentObj) => {
        const text = commentObj?.comment || "No comment available"; // Extract actual comment text
        return <span>{truncateComment(text, 50)}</span>;
      },
    },
    {
      title: "Total Replies",
      key: "totalReplies",
      render: (_, record) => (
        <Space>
          <MessageOutlined className="text-blue-500" /> {/* Reply Icon */}
          {record.replies?.length || 0}
        </Space>
      ),
    },
    {
      title: "Total Likes",
      key: "totalLikes",
      render: (_, record) => (
        <Space>
          <LikeOutlined className="text-[#003399]" /> {/* Like Icon */}
          {record.likes?.length || 0}
        </Space>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => dayjs(time).format("MMM D, YYYY HH:mm"),
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <Table
        columns={columns}
        dataSource={commentData}
        rowKey="_id"
        loading={isLoading}
        pagination={{ current: currentPage, pageSize, total: data?.total || 0 }}
        onChange={handleTableChange}
        scroll={{ x: true }}
      />
      <Modal
        visible={isModalVisible}
        title="Full Comment"
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p>{selectedComment}</p>
      </Modal>
    </div>
  );
};

export default CommentTable;
