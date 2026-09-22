"use client";

import React, { useState } from "react";
import { Table, Button, Modal, Space, Input, Form, Select, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";

interface PopupData {
  key: string;
  title: string;
  content: string;
  status: "Active" | "Inactive";
}

const initialPopups: PopupData[] = [
  {
    key: "1",
    title: "Holiday Sale",
    content: "Enjoy up to 50% off on selected items.",
    status: "Active",
  },
  {
    key: "2",
    title: "New Arrivals",
    content: "Check out the latest additions to our collection.",
    status: "Inactive",
  },
];

const DynamicPopup: React.FC = () => {
  const [popups, setPopups] = useState<PopupData[]>(initialPopups);
  const [selectedPopup, setSelectedPopup] = useState<PopupData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const showModal = (popup: PopupData) => {
    setSelectedPopup(popup);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCreateModalVisible(false);
  };

  const handleCreate = (values: {
    title: string;
    content: string;
    status: "Active" | "Inactive";
  }) => {
    const newPopup: PopupData = {
      key: (popups.length + 1).toString(),
      ...values,
    };
    setPopups([...popups, newPopup]);
    setIsCreateModalVisible(false);
  };

  const toggleStatus = (key: string) => {
    setPopups((prevPopups) =>
      prevPopups.map((popup) =>
        popup.key === key
          ? {
              ...popup,
              status: popup.status === "Active" ? "Inactive" : "Active",
            }
          : popup
      )
    );
  };

  const filteredPopups = popups.filter(
    (popup) =>
      popup.title.toLowerCase().includes(searchText.toLowerCase()) ||
      popup.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<PopupData> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      sorter: (a, b) => a.content.localeCompare(b.content),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Switch
          checked={status === "Active"}
          onChange={() => toggleStatus(record.key)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-6">Dynamic Pop-up Management</h1>
        <div className="flex mb-4 gap-3">
          <div>
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
            Create Dynamic Pop-up
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredPopups}
        pagination={{ pageSize: 5 }}
        bordered
      />

      <Modal
        title="Popup Details"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedPopup && (
          <div>
            <p>
              <strong>Title:</strong> {selectedPopup.title}
            </p>
            <p>
              <strong>Content:</strong> {selectedPopup.content}
            </p>
            <p>
              <strong>Status:</strong> {selectedPopup.status}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Create Dynamic Pop-up"
        open={isCreateModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={handleCreate} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please input the content!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Status" name="status" initialValue="Active">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DynamicPopup;
