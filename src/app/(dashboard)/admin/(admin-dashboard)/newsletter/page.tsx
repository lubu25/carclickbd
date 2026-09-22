"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Table, Space, Tag, Modal, Typography, Select, InputNumber, message } from 'antd';
import {
  EditOutlined,
  MailOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  SendOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
// import { cn } from '@/lib/utils'; // Removed cn import
import { useForm } from 'antd/lib/form/Form';
import moment from 'moment';

interface Subscriber {
  id: string;
  email: string;
  name?: string; // Optional name
  subscribedDate: string;
  status: 'subscribed' | 'unsubscribed';
  tags: string[];
}

interface Newsletter {
  id: string;
  subject: string;
  body: string;
  sentDate?: string; // Optional, for sent newsletters
  status: 'draft' | 'sent' | 'scheduled';
  tags: string[];
  sentTo?: number;
}

const NewsletterPage = () => {
  const [subscriberForm] = useForm<Subscriber>();
  const [newsletterForm] = useForm<Newsletter>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isAddSubscriberModalVisible, setIsAddSubscriberModalVisible] = useState(false);
  const [isSendNewsletterModalVisible, setIsSendNewsletterModalVisible] = useState(false);
  const [editingSubscriberId, setEditingSubscriberId] = useState<string | null>(null);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<string | null>(null);
  const [confirmDeleteSubscriber, setConfirmDeleteSubscriber] = useState<{ id: string; email: string } | null>(null); // State for delete confirmation
  const [confirmDeleteNewsletter, setConfirmDeleteNewsletter] = useState<{ id: string; subject: string } | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string | undefined>(); // State to hold scheduled date
  const [emailContent, setEmailContent] = useState<string>('');

  // Mock Data (Replace with actual API calls)
  useEffect(() => {
    const mockSubscribers: Subscriber[] = [
      { id: '1', email: 'user1@example.com', name: 'John Doe', subscribedDate: '2024-01-15', status: 'subscribed', tags: ['general'] },
      { id: '2', email: 'user2@example.com', subscribedDate: '2024-02-20', status: 'subscribed', tags: ['vip', 'news'] },
      { id: '3', email: 'user3@example.com', name: 'Jane Smith', subscribedDate: '2024-03-10', status: 'unsubscribed', tags: ['general'] },
      { id: '4', email: 'user4@example.com', subscribedDate: '2024-04-01', status: 'subscribed', tags: ['news'] },
      { id: '5', email: 'user5@example.com', name: 'David Lee', subscribedDate: '2024-05-01', status: 'subscribed', tags: ['vip'] },
    ];
    const mockNewsletters: Newsletter[] = [
      { id: '1', subject: 'Welcome to Our Newsletter', body: 'Dear Subscribers, ...', status: 'sent', sentDate: '2024-03-01', tags: ['general'], sentTo: 125 },
      { id: '2', subject: 'Latest Updates', body: 'Check out our latest news and updates!', status: 'sent', sentDate: '2024-04-01', tags: ['news'], sentTo: 230 },
      { id: '3', subject: 'VIP Offer', body: 'Exclusive offer for our VIP subscribers!', status: 'draft', tags: ['vip'] },
      { id: '4', subject: 'Summer Sale', body: 'Our summer sale is now live!', status: 'scheduled', sentDate: '2024-07-28 10:00', tags: ['general'], sentTo: 0 },
      { id: '5', subject: 'Important Announcement', body: 'We have an important announcement to share with you.', status: 'draft', tags: ['general'] },
    ];
    setSubscribers(mockSubscribers);
    setNewsletters(mockNewsletters);
  }, []);

  // Function to handle adding/editing subscribers
  const handleAddSubscriber = () => {
    subscriberForm.validateFields().then((values) => {
      if (editingSubscriberId) {
        // Update existing subscriber
        setSubscribers(
          subscribers.map((subscriber) =>
            subscriber.id === editingSubscriberId ? { ...values, id: editingSubscriberId, subscribedDate: subscriber.subscribedDate } : subscriber
          )
        );
        message.success('Subscriber updated successfully!');
      } else {
        // Add new subscriber
        const newSubscriber: Subscriber = {
          ...values,
          id: crypto.randomUUID(),
          subscribedDate: new Date().toISOString().split('T')[0],
          status: 'subscribed', // Default status for new subscribers
        };
        setSubscribers([...subscribers, newSubscriber]);
        message.success('Subscriber added successfully!');
      }
      setIsAddSubscriberModalVisible(false);
      subscriberForm.resetFields();
      setEditingSubscriberId(null);
    }).catch((error) => {
      console.error('Validation Error:', error);
      message.error('Please fill in all required fields correctly.');
    });
  };

  // Function to handle sending/scheduling newsletters
    const handleSendNewsletter = useCallback(() => {
        newsletterForm.validateFields().then((values) => {
            if (!selectedNewsletterId) {
                message.error("Please select a newsletter to send.");
                return;
            }

            let newsletterToSend = newsletters.find(n => n.id === selectedNewsletterId);
            if (!newsletterToSend) {
                message.error("Newsletter not found.");
                return;
            }
          let updatedNewsletter: Newsletter;
            if (scheduledDate) {
              // Schedule the newsletter
                updatedNewsletter = { ...newsletterToSend, status: 'scheduled', sentDate: scheduledDate };
                message.success(`Newsletter "${newsletterToSend.subject}" scheduled for ${scheduledDate}!`);
            } else {
                // Send the newsletter immediately (simulate sending)
                 updatedNewsletter = { ...newsletterToSend, status: 'sent', sentDate: new Date().toISOString(), sentTo: subscribers.filter(s => s.status === 'subscribed').length };
                message.success(`Newsletter "${newsletterToSend.subject}" sent!`);
            }

            setNewsletters(newsletters.map(n => n.id === selectedNewsletterId ? updatedNewsletter: n));

            setIsSendNewsletterModalVisible(false);
            newsletterForm.resetFields();
            setSelectedNewsletterId(null);
            setScheduledDate(undefined); // Clear scheduled date
            setEmailContent('');

        }).catch((error) => {
            console.error("Form validation failed", error);
            message.error("Please check the form for errors.");
        });
    }, [newsletterForm, selectedNewsletterId, scheduledDate, newsletters, subscribers]);

  // Function to handle editing subscribers
  const handleEditSubscriber = (id: string) => {
    const subscriberToEdit = subscribers.find((subscriber) => subscriber.id === id);
    if (subscriberToEdit) {
      subscriberForm.setFieldsValue(subscriberToEdit);
      setEditingSubscriberId(id);
      setIsAddSubscriberModalVisible(true);
    }
  };

    const showSendNewsletterModal = (newsletterId: string) => {
        setSelectedNewsletterId(newsletterId);
        const newsletter = newsletters.find((n) => n.id === newsletterId);
        if (newsletter) {
            newsletterForm.setFieldsValue(newsletter);
            setEmailContent(newsletter.body);
        }
        setIsSendNewsletterModalVisible(true);
    };

  // Function to handle deleting subscribers
  const handleDeleteSubscriber = (id: string, email: string) => {
    setConfirmDeleteSubscriber({ id, email });
  };

  const confirmDeletionSubscriber = () => {
    if (confirmDeleteSubscriber) {
      setSubscribers(subscribers.filter((subscriber) => subscriber.id !== confirmDeleteSubscriber.id));
      message.success(`Subscriber "${confirmDeleteSubscriber.email}" deleted successfully!`);
    }
    setConfirmDeleteSubscriber(null);
  };

  const cancelDeletionSubscriber = () => {
    setConfirmDeleteSubscriber(null);
  };

    // Function to handle deleting newsletters
    const handleDeleteNewsletter = (id: string, subject: string) => {
        setConfirmDeleteNewsletter({ id, subject });
    };

    const confirmDeletionNewsletter = () => {
        if (confirmDeleteNewsletter) {
            setNewsletters(newsletters.filter(n => n.id !== confirmDeleteNewsletter.id));
            message.success(`Newsletter "${confirmDeleteNewsletter.subject}" deleted!`);
        }
        setConfirmDeleteNewsletter(null);
    };

    const cancelDeletionNewsletter = () => {
        setConfirmDeleteNewsletter(null);
    };

  // Subscriber Table Columns
interface SubscriberColumnRecord {
      email: string;
      name?: string;
      subscribedDate: string;
      status: 'subscribed' | 'unsubscribed';
      tags: string[];
      id: string;
}

const subscriberColumns: Array<{
      title: string;
      dataIndex?: keyof SubscriberColumnRecord;
      key: string;
      render?: (value: any, record: SubscriberColumnRecord) => JSX.Element;
      className?: string;
}> = [
      {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => <span className="font-medium text-gray-800 dark:text-gray-200">{text}</span>,
      },
      {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className: 'text-gray-600 dark:text-gray-400',
      },
      {
            title: 'Subscribed Date',
            dataIndex: 'subscribedDate',
            key: 'subscribedDate',
            className: 'text-gray-500 dark:text-gray-400',
      },
      {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'subscribed' | 'unsubscribed') => (
                  <Tag
                        className={status === 'subscribed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}
                  >
                        {status}
                  </Tag>
            ),
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
                                          tag === 'general' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                          tag === 'vip' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                          tag === 'news' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
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
            title: 'Actions',
            key: 'actions',
            render: (_, record: SubscriberColumnRecord) => (
                  <Space size="small">
                        <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => handleEditSubscriber(record.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              title="Edit"
                        />
                        <Button
                              danger
                              onClick={() => handleDeleteSubscriber(record.id, record.email)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                              title="Delete"
                        />
                  </Space>
            ),
      },
];

  // Newsletter Table Columns
interface NewsletterColumnRecord {
      subject: string;
      status: 'draft' | 'sent' | 'scheduled';
      sentDate?: string;
      sentTo?: number;
      tags: string[];
      id: string;
      body: string; // Added body property
}

const newsletterColumns: Array<{
      title: string;
      dataIndex?: keyof NewsletterColumnRecord;
      key: string;
      render?: (value: any, record: NewsletterColumnRecord) => JSX.Element;
      className?: string;
}> = [
      {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            render: (text: string) => <span className="font-medium text-gray-800 dark:text-gray-200">{text}</span>,
      },
      {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: 'draft' | 'sent' | 'scheduled') => {
                  let color = '';
                  let text = '';
                  switch (status) {
                        case 'draft':
                              color = 'gray';
                              text = 'Draft';
                              break;
                        case 'sent':
                              color = 'green';
                              text = 'Sent';
                              break;
                        case 'scheduled':
                              color = 'blue';
                              text = 'Scheduled';
                              break;
                        default:
                              color = 'gray';
                              text = 'Unknown';
                  }
                  return <Tag className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-800 dark:text-${color}-100`}>{text}</Tag>;
            },
      },
      {
            title: 'Sent Date',
            dataIndex: 'sentDate',
            key: 'sentDate',
            className: 'text-gray-500 dark:text-gray-400',
      },
      {
            title: 'Sent To',
            dataIndex: 'sentTo',
            key: 'sentTo',
            className: 'text-gray-500 dark:text-gray-400',
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
                                          tag === 'general' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                          tag === 'vip' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                                          tag === 'news' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
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
            title: 'Actions',
            key: 'actions',
            render: (_, record: NewsletterColumnRecord) => (
                  <Space size="small">
                        <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => {
                                    newsletterForm.setFieldsValue(record);
                                    setEmailContent(record.body);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              title="Edit"
                        />
                        <Button
                              type="primary"
                              icon={<SendOutlined />}
                              onClick={() => showSendNewsletterModal(record.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                              title="Send/Schedule"
                        />
                        <Button
                              danger
                              icon={<ExclamationCircleOutlined />}
                              onClick={() => handleDeleteNewsletter(record.id, record.subject)}
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
        <MailOutlined className="text-blue-500" /> Newsletter Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subscribers Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UsergroupAddOutlined className="text-green-500" /> Subscribers
            </h2>
            <Button
              type="primary"
              onClick={() => {
                subscriberForm.resetFields();
                setEditingSubscriberId(null);
                setIsAddSubscriberModalVisible(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <PlusOutlined /> Add Subscriber
            </Button>
          </div>
          <Table
            columns={subscriberColumns}
            dataSource={subscribers}
            rowKey="id"
            className="text-gray-700 dark:text-gray-300"
          />
        </div>

        {/* Newsletters Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileTextOutlined className="text-purple-500" /> Newsletters
            </h2>
          </div>
          <Table
            columns={newsletterColumns}
            dataSource={newsletters}
            rowKey="id"
            className="text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      {/* Add/Edit Subscriber Modal */}
      <Modal
        title={`${editingSubscriberId ? 'Edit Subscriber' : 'Add New Subscriber'}`}
        open={isAddSubscriberModalVisible}
        onCancel={() => {
          setIsAddSubscriberModalVisible(false);
          subscriberForm.resetFields();
          setEditingSubscriberId(null);
        }}
        onOk={handleAddSubscriber}
        okText="Save"
        cancelText="Cancel"
        className="dark:bg-gray-800"
      >
        <Form form={subscriberForm} layout="vertical" className="space-y-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter the email address!' }, { type: 'email', message: 'Please enter a valid email address!' }]}
            className="text-gray-700 dark:text-gray-300"
          >
            <Input placeholder="e.g., user@example.com" className="dark:bg-gray-700 dark:text-gray-200" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            className="text-gray-700 dark:text-gray-300"
          >
            <Input placeholder="e.g., John Doe" className="dark:bg-gray-700 dark:text-gray-200" />
          </Form.Item>
           <Form.Item
            label="Tags"
            name="tags"
            rules={[{ required: true, message: 'Please select at least one tag!' }]}
            className="text-gray-700 dark:text-gray-300"
          >
            <Select
              mode="multiple"
              placeholder="Select tags (e.g., general, vip, news)"
              options={[
                { value: 'general', label: 'General' },
                { value: 'vip', label: 'VIP' },
                { value: 'news', label: 'News' },
              ]}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Send/Schedule Newsletter Modal */}
        <Modal
            title={`Send Newsletter`}
            open={isSendNewsletterModalVisible}
            onCancel={() => {
                setIsSendNewsletterModalVisible(false);
                newsletterForm.resetFields();
                setSelectedNewsletterId(null);
                setScheduledDate(undefined);
                setEmailContent('');
            }}
            onOk={handleSendNewsletter}
            okText={scheduledDate ? "Schedule" : "Send"}
            cancelText="Cancel"
            className="dark:bg-gray-800"
        >
            <Form form={newsletterForm} layout="vertical" className="space-y-4">
                <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Please enter the newsletter subject!' }]}
                    className="text-gray-700 dark:text-gray-300"
                >
                    <Input placeholder="e.g., Latest Updates" className="dark:bg-gray-700 dark:text-gray-200" disabled />
                </Form.Item>

                <Form.Item
                    label="Email Body"
                    name="body"
                    rules={[{ required: true, message: 'Please enter the newsletter content!' }]}
                    className="text-gray-700 dark:text-gray-300"
                >
                    <Input.TextArea
                      rows={6}
                      placeholder="Dear Subscribers, ..."
                      className="dark:bg-gray-700 dark:text-gray-200"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label="Send/Schedule"
                    name="sendSchedule"
                    className="text-gray-700 dark:text-gray-300"
                >
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                setScheduledDate(undefined); // Clear any previously selected date
                                handleSendNewsletter(); // Call the send handler
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
                        >
                            Send Now
                        </Button>
                        <Button
                            type="default"
                            onClick={() => {
                                // open date/time picker
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                           <input
                                type="datetime-local"
                                onChange={(e) => setScheduledDate(e.target.value)}
                                value={scheduledDate}
                                className="dark:bg-gray-700 dark:text-gray-200"
                            />
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>

      {/* Delete Confirmation Modal for Subscribers */}
      <Modal
        title="Confirm Deletion"
        open={!!confirmDeleteSubscriber}
        onCancel={cancelDeletionSubscriber}
        onOk={confirmDeletionSubscriber}
        cancelText="Cancel"
        okText="Delete"
        className="dark:bg-gray-800"
      >
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500 h-5 w-5" />
          <Typography.Text>
            Are you sure you want to delete the subscriber <strong>{confirmDeleteSubscriber?.email}</strong>?
          </Typography.Text>
        </div>
      </Modal>

        {/* Delete Confirmation Modal for Newsletters */}
        <Modal
            title="Confirm Deletion"
            open={!!confirmDeleteNewsletter}
            onCancel={cancelDeletionNewsletter}
            onOk={confirmDeletionNewsletter}
            cancelText="Cancel"
            okText="Delete"
            className="dark:bg-gray-800"
        >
            <div className="flex items-center gap-2">
                <ExclamationCircleOutlined className="text-red-500 h-5 w-5" />
                <Typography.Text>
                    Are you sure you want to delete the newsletter <strong>{confirmDeleteNewsletter?.subject}</strong>?
                </Typography.Text>
            </div>
        </Modal>
    </div>
  );
};

export default NewsletterPage;
