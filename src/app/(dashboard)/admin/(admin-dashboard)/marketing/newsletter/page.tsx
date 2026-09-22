'use client';

import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, MailOutlined } from '@ant-design/icons';

const NewsletterPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribers, setSubscribers] = useState([
    { id: 1, email: 'user1@example.com' },
    { id: 2, email: 'user2@example.com' },
    { id: 3, email: 'user2@example.com' },
    { id: 4, email: 'user2@example.com' },
    { id: 5, email: 'user2@example.com' },
    { id: 6, email: 'user2@example.com' },
    { id: 7, email: 'user2@example.com' },
    { id: 8, email: 'user2@example.com' },
    { id: 9, email: 'user2@example.com' },
    { id: 10, email: 'user2@example.com' },
  ]);
  const [form] = Form.useForm();

  interface Subscriber {
    id: number;
    email: string;
  }

  interface Column {
    title: string;
    dataIndex?: string;
    key: string;
    render?: (_: any, record: Subscriber) => JSX.Element;
  }

  const columns: Column[] = [
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button danger onClick={() => removeSubscriber(record.id)}>Remove</Button>
      )
    }
  ];

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleAddSubscriber = () => {
    form.validateFields().then(values => {
      setSubscribers([...subscribers, { id: subscribers.length + 1, ...values }]);
      setIsModalOpen(false);
      message.success('Subscriber added successfully');
    });
  };

  const removeSubscriber = (id: number) => {
    setSubscribers(subscribers.filter(sub => sub.id !== id));
    message.success('Subscriber removed');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>Add Subscriber</Button>
      </div>
      <Table dataSource={subscribers} columns={columns} rowKey="id" />
      <Modal
        title="Add Subscriber"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddSubscriber}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
            <Input prefix={<MailOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsletterPage;
