'use client';

import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag } from 'antd';
import { PlusOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';

const SubscribersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 4, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 5, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 6, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 7, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 8, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ]);

  const statusColors = {
    Active: 'green',
    Inactive: 'red'
  };

  interface Subscriber {
    id: number;
    name: string;
    email: string;
    status: 'Active' | 'Inactive';
  }

  interface Column {
    title: string;
    dataIndex?: string;
    key: string;
    render?: (text: any, record?: Subscriber) => JSX.Element;
  }

  const columns: Column[] = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <span className="font-semibold">{text}</span> },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: keyof typeof statusColors) => <Tag color={statusColors[status]}>{status}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => removeSubscriber(record!.id)}>Remove</Button>
      )
    }
  ];

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleAddSubscriber = () => {
    form.validateFields().then(values => {
      setSubscribers([...subscribers, { id: subscribers.length + 1, ...values, status: 'Active' }]);
      setIsModalOpen(false);
      message.success('Subscriber added successfully');
    });
  };

  const removeSubscriber = (id: number) => {
    setSubscribers(subscribers.filter((sub: Subscriber) => sub.id !== id));
    message.success('Subscriber removed');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-4 flex justify-between items-center border-l-4 border-blue-500">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserOutlined className="text-blue-500" /> Subscribers Management
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>Add Subscriber</Button>
      </div>
      <Table dataSource={subscribers} columns={columns} rowKey="id" className="shadow-md rounded-lg bg-white p-4" />
      <Modal
        title="Add Subscriber"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddSubscriber}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Please enter full name' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscribersPage;
