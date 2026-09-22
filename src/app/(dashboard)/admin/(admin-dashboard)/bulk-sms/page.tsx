"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Table, Space, Tag, Select, InputNumber, message, Alert, Typography } from 'antd';
import { SendOutlined, PhoneOutlined, UserOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import { cn } from '@/lib/utils'; // Removed cn import
import { useForm } from 'antd/lib/form/Form';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  userCount: number;
}

interface SMSLog {
  id: string;
  recipient: string; // Could be a phone number or user identifier
  message: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt: string;
  error?: string; // Optional error message
}

const BulkSMSPage = () => {
  const [form] = useForm<{
    message: string;
    recipientsType: 'all' | 'group' | 'numbers';
    recipientGroup?: string;
    recipientNumbers?: string; // Comma-separated numbers
  }>();
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null); // For displaying success message
  const [sendError, setSendError] = useState<string | null>(null);     // For displaying error message

  // Mock Data (Replace with actual API calls)
  useEffect(() => {
    // Fetch user groups
    const mockUserGroups: UserGroup[] = [
      { id: 'group1', name: 'All Users', description: 'Send SMS to all registered users', userCount: 1250 },
      { id: 'group2', name: 'Active Users', description: 'Send SMS to users active in the last month', userCount: 890 },
      { id: 'group3', name: 'VIP Customers', description: 'Send SMS to VIP customers only', userCount: 235 },
    ];
    setUserGroups(mockUserGroups);
  }, []);

  const recipientTypeOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'group', label: 'User Group' },
    { value: 'numbers', label: 'Phone Numbers' },
  ];

  const handleSendSMS = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setSendSuccess(null);
      setSendError(null);
  
      // Simulate sending SMS (Replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2-second delay
  
      let recipients: string[] = [];
  
      if (values.recipientsType === 'all') {
        recipients = ['+15551234567', '+15551234568', '+15551234569']; // Mock all user numbers
      } else if (values.recipientsType === 'group' && values.recipientGroup) {
        const group = userGroups.find((g) => g.id === values.recipientGroup);
        if (group) {
          recipients = Array.from({ length: Math.min(10, group.userCount) }, (_, i) => `+1${555}${2000 + i}`);
        } else {
          throw new Error('User group not found.');
        }
      } else if (values.recipientsType === 'numbers' && values.recipientNumbers) {
        recipients = values.recipientNumbers.split(',').map((num) => num.trim());
      } else {
        throw new Error('No recipients specified');
      }
  
      if (recipients.length === 0) {
        throw new Error('No recipients found to send SMS.');
      }
  
      // Simulate success/failure for each recipient
      const newLogs: SMSLog[] = recipients.map((recipient) => {
        const success = Math.random() < 0.8;
        return {
          id: crypto.randomUUID(),
          recipient,
          message: values.message,
          status: success ? 'sent' : 'failed',
          sentAt: new Date().toISOString(),
          error: success ? undefined : 'Failed to deliver message.',
        };
      });
  
      setSmsLogs((prevLogs) => [...prevLogs, ...newLogs]);
  
      const successfulCount = newLogs.filter((log) => log.status === 'sent').length;
      const failedCount = newLogs.filter((log) => log.status === 'failed').length;
  
      if (successfulCount > 0 && failedCount === 0) {
        setSendSuccess(`SMS sent successfully to ${successfulCount} recipient(s).`);
        message.success(`SMS sent successfully to ${successfulCount} recipient(s).`);
      } else if (successfulCount > 0 && failedCount > 0) {
        setSendSuccess(`SMS sent to ${successfulCount} recipient(s) with ${failedCount} failure(s).`);
        message.warning(`SMS sent to ${successfulCount} recipient(s) with ${failedCount} failure(s). Check the SMS Log for details.`);
      } else if (successfulCount === 0 && failedCount > 0) {
        setSendError(`Failed to send SMS to all ${failedCount} recipients.`);
        message.error(`Failed to send SMS to all ${failedCount} recipients. Check the SMS Log for details.`);
      } else {
        setSendSuccess('No SMS were sent.');
        message.info('No SMS were sent.');
      }
  
      form.resetFields(); // Clear form upon completion
    } catch (error: any) {
      setSendError(error.message || 'Failed to send SMS.');
      message.error(error.message || 'Failed to send SMS.');
      console.error('Error sending SMS:', error);
    } finally {
      setLoading(false);
    }
  }, [form, userGroups]);
  

  const columns: any = [  // Use 'any' to avoid defining complex type for columns
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
      render: (text: string) => <span className="font-medium text-gray-800 dark:text-gray-200">{text}</span>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      className: 'text-gray-600 dark:text-gray-400',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'pending' | 'sent' | 'failed') => {
        let color = '';
        let text = '';
        if (status === 'sent') {
          color = 'green';
          text = 'Sent';
        } else if (status === 'failed') {
          color = 'red';
          text = 'Failed';
        } else {
          color = 'gray';
          text = 'Pending';
        }
        return <Tag color={color} className="capitalize">{text}</Tag>;
      },
    },
    {
      title: 'Sent At',
      dataIndex: 'sentAt',
      key: 'sentAt',
      className: 'text-gray-500 dark:text-gray-400',
    },
      {
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
        className: 'text-red-500',
      render: (error: string) => error ? (
          <div className="flex items-center gap-1">
            <ExclamationCircleOutlined />
            {error}
          </div>
      ) : null,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <PhoneOutlined className="text-blue-500" /> Bulk SMS
      </h1>

      <div className="space-y-6">
        {/* Send SMS Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
          <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Send SMS</h2>
          <Form form={form} layout="vertical" className="space-y-4">
            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: 'Please enter the message to send!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Input.TextArea rows={4} placeholder="Enter your SMS message here.  You can use placeholders like {USERNAME}." className="dark:bg-gray-700 dark:text-gray-200" />
            </Form.Item>

            <Form.Item
              label="Recipients"
              name="recipientsType"
              rules={[{ required: true, message: 'Please select recipient type!' }]}
              className="text-gray-700 dark:text-gray-300"
            >
              <Select
                options={recipientTypeOptions}
                placeholder="Select recipient type"
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Form.Item>

            <Form.Item
              label="User Group"
              name="recipientGroup"
              dependencies={['recipientsType']}
              className="text-gray-700 dark:text-gray-300"
              // Only show this field if "User Group" is selected
              shouldUpdate={(prevValues: any, currentValues: any) =>
                prevValues?.recipientsType !== currentValues?.recipientsType
              }
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('recipientsType') === 'group' && !value) {
                      return Promise.reject(new Error('Please select a user group!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Select
                placeholder="Select a user group"
                options={userGroups.map((group) => ({ value: group.id, label: group.name }))}
                disabled={form.getFieldValue('recipientsType') !== 'group'}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Form.Item>

            <Form.Item
              label="Phone Numbers"
              name="recipientNumbers"
              dependencies={['recipientsType']}
              className="text-gray-700 dark:text-gray-300"
              // Only show this field if "Phone Numbers" is selected
              shouldUpdate={(prevValues: Record<string, any>, currentValues: Record<string, any>) =>
                prevValues.recipientsType !== currentValues.recipientsType
              }
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('recipientsType') === 'numbers' && !value) {
                      return Promise.reject(new Error('Please enter phone numbers!'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter phone numbers separated by commas (e.g., +15551234567, +15551234568)"
                disabled={form.getFieldValue('recipientsType') !== 'numbers'}
                className="dark:bg-gray-700 dark:text-gray-200"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                onClick={handleSendSMS}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <SendOutlined /> {loading ? 'Sending...' : 'Send SMS'}
              </Button>
            </Form.Item>
          </Form>
            {sendSuccess && (
                <Alert
                  message="Success"
                  description={sendSuccess}
                  type="success"
                  showIcon
                  className="mt-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-400 dark:border-green-600"
                />
              )}
              {sendError && (
                <Alert
                  message="Error"
                  description={sendError}
                  type="error"
                  showIcon
                  className="mt-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600"
                />
              )}
        </div>

        {/* SMS Log Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <UserOutlined className="text-gray-500" /> SMS Log
          </h2>
          {smsLogs.length === 0 ? (
            <Typography.Text className="text-gray-500 dark:text-gray-400">No SMS logs to display.</Typography.Text>
          ) : (
            <Table
              columns={columns}
              dataSource={smsLogs}
              rowKey="id"
              className="text-gray-700 dark:text-gray-300"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkSMSPage;

