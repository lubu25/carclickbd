'use client';

import { useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const EmailTemplatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();

  const [templates, setTemplates] = useState([
    { id: 1, name: 'Welcome Email', subject: 'Welcome to our service!', content: 'Hello, welcome to our platform.' },
    { id: 2, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 3, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 4, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 5, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 6, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 7, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 8, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 9, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 10, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 11, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 12, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
    { id: 13, name: 'Order Confirmation', subject: 'Your order has been placed', content: 'Thank you for your order.' },
  ]);

  interface Template {
    id: number;
    name: string;
    subject: string;
    content: string;
  }

  const columns: Array<{ title: string; dataIndex?: keyof Template; key: string; render?: (_: any, record: Template) => JSX.Element }> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => deleteTemplate(record.id)} />
        </div>
      )
    }
  ];

  const openEditModal = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTemplate(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingTemplate) {
        setTemplates(templates.map(t => (t.id === editingTemplate.id ? { ...t, ...values } : t)));
      } else {
        setTemplates([...templates, { id: templates.length + 1, ...values }]);
      }
      setIsModalOpen(false);
    });
  };

  const deleteTemplate = (id: number) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Email Templates</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>Add Template</Button>
      </div>
      <Table dataSource={templates} columns={columns} rowKey="id" scroll={{ x: true }}/>
      <Modal
        title={editingTemplate ? 'Edit Template' : 'Add Template'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Template Name" rules={[{ required: true, message: 'Please enter template name' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Please enter subject' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter content' }]}> 
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmailTemplatesPage;