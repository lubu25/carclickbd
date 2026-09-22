'use client';

import { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Select, Tag } from 'antd';
import { PlusOutlined, MessageOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const BulkSMSPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [smsList, setSmsList] = useState<SMS[]>([
    { id: 1, recipient: 'User1', phone: '+1234567890', message: 'Hello! Welcome to our service.', status: 'Sent' },
    { id: 2, recipient: 'User2', phone: '+0987654321', message: 'Your order has been processed.', status: 'Pending' }
  ]);

  const statusColors = {
    Sent: 'green',
    Pending: 'orange',
    Failed: 'red'
  };

  interface SMS {
    id: number;
    recipient: string;
    phone: string;
    message: string;
    status: 'Sent' | 'Pending' | 'Failed';
  }

  interface StatusColors {
    [key: string]: string;
  }

  const columns: Array<{ title: string; dataIndex?: string; key: string; render?: (text: any, record?: SMS) => JSX.Element }> = [
    { title: 'Recipient', dataIndex: 'recipient', key: 'recipient', render: (text) => <span className="font-semibold">{text}</span> },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Message', dataIndex: 'message', key: 'message' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: 'Sent' | 'Pending' | 'Failed') => <Tag color={statusColors[status]}>{status}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => removeSMS(record!.id)}>Remove</Button>
      )
    }
  ];

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSendSMS = () => {
    form.validateFields().then(values => {
      setSmsList([...smsList, { id: smsList.length + 1, ...values, status: 'Pending' }]);
      setIsModalOpen(false);
      message.success('SMS added to queue successfully');
    });
  };

  const removeSMS = (id: number) => {
    setSmsList(smsList.filter((sms: SMS) => sms.id !== id));
    message.success('SMS removed');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-4 flex justify-between items-center border-l-4 border-blue-500">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageOutlined className="text-blue-500" /> Bulk SMS Management
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>Send SMS</Button>
      </div>
      <Table dataSource={smsList} columns={columns} rowKey="id" className="shadow-md rounded-lg bg-white p-4" />
      <Modal
        title="Send Bulk SMS"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSendSMS}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="recipient" label="Recipient Name" rules={[{ required: true, message: 'Please enter recipient name' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter message' }]}> 
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BulkSMSPage;
