import {
  Table,
  Button,
  Input,
  Modal,
  Form,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import { useState } from "react";
import { IBid } from "@/Interface/bid";

interface ProductTableProps {
  bidData: IBid[];
  loading: boolean;
  onSearch: (value: string) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onChange: (pagination: any) => void;
}

const BidsTable: React.FC<ProductTableProps> = ({
  bidData,
  loading,
  onSearch,
  pagination,
  onChange,
}) => {
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const columns: ColumnsType<IBid> = [
    {
      title: "Buyer Email",
      dataIndex: ["buyer", "email"],
      key: "email",
    },
    {
      title: "Inquiry Amount",
      dataIndex: "bidAmount",
      key: "bidAmount",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md", "lg", "xl"],
      render: (createdAt) => (
        <span>{createdAt ? dayjs(createdAt).format("MMM D, YYYY") : "N/A"}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (_, record) => (
        <div className="space-x-2">
          <Button type="primary" onClick={() => sendEmail(record)}>
            Send Email
          </Button>
        </div>
      ),
    },
  ];

  const sendEmail = (record: IBid) => {
    setModalTitle(`Send message to ${record.buyer.email}`);
    setModalContent(
      <Form>
        <Form.Item label="Message">
          <Input.TextArea rows={4} placeholder="Type your message here..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={() => alert("Message sent!")}>
            Send
          </Button>
        </Form.Item>
      </Form>
    );
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  return (
    <div className="space-y-4">      
      <Table
        columns={columns}
        dataSource={bidData}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
        onChange={onChange}
        scroll={{ x: true }}
      />

      <Modal title={modalTitle} open={isModalVisible} onCancel={closeModal} footer={null}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default BidsTable;
