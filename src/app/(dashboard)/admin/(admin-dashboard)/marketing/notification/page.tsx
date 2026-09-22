'use client';

import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd';
import { PlusOutlined, BellOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const NotificationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'System Update', message: 'A new update is available.', type: 'info' },
    { id: 2, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 3, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 4, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 5, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 6, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 7, title: 'System Update', message: 'A new update is available.', type: 'info' },
    { id: 8, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 9, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 10, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 11, title: 'New User', message: 'A new user has signed up.', type: 'success' },
    { id: 12, title: 'New User', message: 'A new user has signed up.', type: 'success' },
  ]);

  const typeColors = {
    info: 'blue',
    success: 'green',
    warning: 'orange',
    error: 'red'
  };

  interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }

  interface NotificationFormValues {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-semibold">{text}</span>
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: keyof typeof typeColors) => <Tag color={typeColors[type]}>{type.toUpperCase()}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Notification) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => removeNotification(record.id)}>Remove</Button>
      )
    }
  ];

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleAddNotification = () => {
    form.validateFields().then(values => {
      setNotifications([...notifications, { id: notifications.length + 1, ...values }]);
      setIsModalOpen(false);
      message.success('Notification added successfully');
    });
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notif: Notification) => notif.id !== id));
    message.success('Notification removed');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BellOutlined className="text-blue-500" /> Notifications
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>Add Notification</Button>
      </div>
      <Table dataSource={notifications} columns={columns} rowKey="id" className="shadow-md rounded-lg" />
      <Modal
        title="Add Notification"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddNotification}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter a message' }]}> 
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select a type' }]}> 
            <Select>
              <Option value="info">Info</Option>
              <Option value="success">Success</Option>
              <Option value="warning">Warning</Option>
              <Option value="error">Error</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationPage;
