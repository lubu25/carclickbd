"use client";
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space, Tag, Modal, Typography, message, Select } from 'antd';
import { EditOutlined, MailOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import { cn } from '@/lib/utils'; // Removed cn import
import { useForm } from 'antd/lib/form/Form';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  body: string;
  tags: string[]; // Added tags for categorization
  lastUpdated: string;
}

const EmailTemplates = () => {
  const [form] = useForm<EmailTemplate>();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null); // State for delete confirmation

  // Mock Data (Replace with actual API calls)
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to Our Platform',
        description: 'Sent to new users upon registration.',
        body: 'Dear {USERNAME}, Welcome to our platform!  ...',
        tags: ['User', 'Welcome'],
        lastUpdated: '2024-07-24',
      },
      {
        id: '2',
        name: 'Password Reset',
        subject: 'Password Reset Request',
        description: 'Sent when a user requests to reset their password.',
        body: 'Dear {USERNAME},  A password reset was requested for your account. ...',
        tags: ['User', 'Password'],
        lastUpdated: '2024-07-20',
      },
      {
        id: '3',
        name: 'Order Confirmation',
        subject: 'Your Order Confirmation',
        description: 'Sent to the user after they place an order.',
        body: 'Dear {USERNAME}, Thank you for your order! Your order details are as follows: ...',
        tags: ['Order', 'Confirmation'],
        lastUpdated: '2024-07-15',
      },
      {
        id: '4',
        name: 'Newsletter Subscription',
        subject: 'Welcome to Our Newsletter',
        description: 'Sent to users who subscribe to our newsletter.',
        body: 'Dear Subscriber, Thank you for subscribing to our newsletter! Stay tuned for exciting updates.',
        tags: ['Newsletter', 'Subscription'],
        lastUpdated: '2024-07-10'
      },
       {
        id: '5',
        name: 'Account Verification',
        subject: 'Verify Your Account',
        description: 'Sent to users after registration to verify their email.',
        body: 'Dear {USERNAME}, Please verify your email address by clicking on the following link: {VERIFICATION_LINK}',
        tags: ['User', 'Verification'],
        lastUpdated: '2024-07-05'
      },
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleEdit = (id: string) => {
    const templateToEdit = templates.find((template) => template.id === id);
    if (templateToEdit) {
      form.setFieldsValue(templateToEdit);
      setEditingTemplateId(id);
      setIsAddModalVisible(true); // Show the modal for editing
    }
  };

    const handleAddTemplate = () => {
        form.resetFields(); // Clear form for adding a new template
        setEditingTemplateId(null); // Ensure we are in "add" mode
        setIsAddModalVisible(true);
    };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingTemplateId) {
        // Update existing template
        setTemplates(
          templates.map((template) => (template.id === editingTemplateId ? { ...values, id: editingTemplateId, lastUpdated: new Date().toISOString().split('T')[0] } : template))
        );
        message.success('Template updated successfully!');
      } else {
        // Add new template
        const newTemplate: EmailTemplate = {
          ...values,
          id: crypto.randomUUID(), // Use a unique ID generator
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        setTemplates([...templates, newTemplate]);
        message.success('Template added successfully!');
      }
      setIsAddModalVisible(false);
      form.resetFields();
      setEditingTemplateId(null);
    }).catch((error) => {
      console.error('Validation Error:', error);
      message.error('Please fill in all required fields correctly.');
    });
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmDelete({ id, name }); // Store the ID and name of the template to delete
  };

  const confirmDeletion = () => {
    if (confirmDelete) {
      setTemplates(templates.filter((template) => template.id !== confirmDelete.id));
      message.success(`Template "${confirmDelete.name}" deleted successfully!`);
    }
    setConfirmDelete(null); // Reset the confirmation state
  };

  const cancelDeletion = () => {
    setConfirmDelete(null); // Cancel the deletion
  };

interface ColumnRenderProps {
      text: string;
      record: EmailTemplate;
      index: number;
}

interface TagRenderProps {
      tags: string[];
}

const columns: Array<{
      title: string;
      dataIndex?: keyof EmailTemplate;
      key: string;
      render?: (value: any, record: EmailTemplate, index: number) => React.ReactNode;
      className?: string;
}> = [
      {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium text-gray-800 dark:text-gray-200">{text}</span>,
      },
      {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            className: 'text-gray-600 dark:text-gray-400',
      },
      {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (
                  <Space size="small">
                        {tags.map((tag) => (
                              <Tag
                                    key={tag}
                                    className={
                                          tag === 'User' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                          tag === 'Password' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                          tag === 'Order' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                          tag === 'Newsletter' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100':
                                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                    }
                              >
                                    {tag}
                              </Tag>
                        ))}
                  </Space>
            ),
      },
      {
            title: 'Last Updated',
            dataIndex: 'lastUpdated',
            key: 'lastUpdated',
            className: 'text-gray-500 dark:text-gray-400',
      },
      {
            title: 'Actions',
            key: 'actions',
            render: (_, record: EmailTemplate) => (
                  <Space size="small">
                        <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => handleEdit(record.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              title="Edit"
                        />
                        <Button
                              danger
                              onClick={() => handleDelete(record.id, record.name)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                              title="Delete"
                        />
                  </Space>
            ),
      },
];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <MailOutlined className="text-blue-500" /> Email Templates
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            onClick={handleAddTemplate}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <PlusOutlined /> Add Template
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          className="text-gray-700 dark:text-gray-300"
        />

        {/* Add/Edit Modal */}
        <Modal
          title={`${editingTemplateId ? 'Edit Template' : 'Add New Template'}`}
          open={isAddModalVisible}
          onCancel={() => {
            setIsAddModalVisible(false);
            form.resetFields();
            setEditingTemplateId(null);
          }}
          onOk={handleSave}
          okText="Save"
          cancelText="Cancel"
          className="dark:bg-gray-800"
        >
          <Form form={form} layout="vertical" className="space-y-4">
            <Form.Item
              label="Template Name"
              name="name"
              rules={[{ required: true, message: 'Please enter the template name!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Input placeholder="e.g., Welcome Email" className="dark:bg-gray-700 dark:text-gray-200" />
            </Form.Item>
            <Form.Item
              label="Subject"
              name="subject"
              rules={[{ required: true, message: 'Please enter the email subject!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Input placeholder="e.g., Welcome to Our Platform" className="dark:bg-gray-700 dark:text-gray-200" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter the email description!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Input.TextArea rows={2} placeholder="e.g., Sent to new users upon registration" className="dark:bg-gray-700 dark:text-gray-200" />
            </Form.Item>
            <Form.Item
              label="Tags"
              name="tags"
              rules={[{ required: true, message: 'Please select at least one tag!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Select
                mode="multiple"
                placeholder="Select tags (e.g., User, Order, Newsletter)"
                options={[
                  { value: 'User', label: 'User' },
                  { value: 'Order', label: 'Order' },
                  { value: 'Newsletter', label: 'Newsletter' },
                  { value: 'Password', label: 'Password' },
                  { value: 'Verification', label: 'Verification'}
                ]}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Form.Item>
            <Form.Item
              label="Body"
              name="body"
              rules={[{ required: true, message: 'Please enter the email body!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Input.TextArea rows={6} placeholder="Dear {USERNAME}, ..." className="dark:bg-gray-700 dark:text-gray-200" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Deletion"
          open={!!confirmDelete}
          onCancel={cancelDeletion}
          onOk={confirmDeletion}
          cancelText="Cancel"
          okText="Delete"
          className="dark:bg-gray-800"
        >
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500 h-5 w-5" />
            <Typography.Text>
              Are you sure you want to delete the template <strong>{confirmDelete?.name}</strong>?
            </Typography.Text>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EmailTemplates;

