"use client";
import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Button, Tag, Typography, Popconfirm, message, Input, Select, Badge, Avatar } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    MailOutlined,
    UserOutlined,
    FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    sentDate: string;
    status: 'unread' | 'read' | 'replied';
}

const MailboxPage = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null); // 'unread', 'read', 'replied'
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [replyText, setReplyText] = useState('');

    // Mock Data (Replace with actual API calls)
    const generateMockData = (): ContactMessage[] => {
        const today = dayjs();
        const data: ContactMessage[] = [
            {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                subject: 'Inquiry about product',
                message: 'I would like to know more about your product features.',
                sentDate: today.subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
                status: 'unread',
            },
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                subject: 'Order cancellation request',
                message: 'Please cancel my order #12345.',
                sentDate: today.subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss'),
                status: 'read',
            },
            {
                id: '3',
                name: 'Bob Johnson',
                email: 'bob.johnson@example.com',
                subject: 'Delivery issue',
                message: 'My order has not arrived yet.  Can you help?',
                sentDate: today.subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
                status: 'replied',
            },
            {
                id: '4',
                name: 'Alice Brown',
                email: 'alice.brown@example.com',
                subject: 'Feedback on website',
                message: 'I have some suggestions for improving your website.',
                sentDate: today.subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
                status: 'unread',
            },
            {
                id: '5',
                name: 'Mike Wilson',
                email: 'mike.wilson@example.com',
                subject: 'Support query',
                message: 'How do I reset my password?',
                sentDate: today.subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss'),
                status: 'replied',
            },
        ];
        return data;
    };

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            const data = generateMockData();
            setMessages(data);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleViewMessage = (id: string) => {
        const message = messages.find(m => m.id === id);
        setSelectedMessage(message || null);
        if (message && message.status === 'unread') {
            setMessages(prevMessages =>
                prevMessages.map(m =>
                    m.id === id ? { ...m, status: 'read' } : m
                )
            );
        }
    };

    const handleReply = (id: string) => {
        if (!replyText.trim()) {
            message.error('Please enter a reply.');
            return;
        }

        setMessages(prevMessages =>
            prevMessages.map(m => {
                if (m.id === id) {
                    return { ...m, status: 'replied' };
                }
                return m;
            })
        );
        setReplyText(''); // Clear the reply input
        setSelectedMessage(null);
        message.success('Reply sent successfully');
    };

    const handleDeleteMessage = (id: string) => {
        setMessages(prevMessages => prevMessages.filter(m => m.id !== id));
        setSelectedMessage(null);
        message.success('Message deleted successfully');
    };

    const getStatusTag = (status: ContactMessage['status']) => {
        switch (status) {
            case 'unread':
                return <Tag color="red">Unread</Tag>;
            case 'read':
                return <Tag color="yellow">Read</Tag>;
            case 'replied':
                return <Tag color="green">Replied</Tag>;
            default:
                return null;
        }
    };

    // Filter and Search
    const filteredMessages = messages.filter(message => {
        const searchTextMatch =
            message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.message.toLowerCase().includes(searchQuery.toLowerCase());

        const statusMatch = !statusFilter || message.status === statusFilter;

        return searchTextMatch && statusMatch;
    });

      const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter(null);
    };

    interface ColumnType {
        title: string;
        dataIndex?: keyof ContactMessage;
        key: string;
        render?: (text: any, record?: ContactMessage) => React.ReactNode;
    }

    const columns: ColumnType[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Typography.Text className="font-medium">{text}</Typography.Text>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Sent Date',
            dataIndex: 'sentDate',
            key: 'sentDate',
            render: (text: string) => (
                <>
                    {dayjs(text).format('MMM DD, HH:mm:ss')}
                </>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: ContactMessage['status']) => getStatusTag(status),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record?: ContactMessage) => record && (
                <Space size="middle">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewMessage(record.id)}
                    >
                        View
                    </Button>
                    <Popconfirm
                        title="Delete Message"
                        description="Are you sure you want to delete this message?"
                        onConfirm={() => handleDeleteMessage(record.id)}
                        okButtonProps={{ icon: <CheckCircleOutlined /> }}
                        cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Mailbox</h1>

             <Card className="mb-6 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-wrap gap-4 items-center">
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
                <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto"
                    prefix={<SearchOutlined />}
                />
                <Select
                    placeholder="Filter by Status"
                    value={statusFilter || undefined}
                    onChange={(value) => setStatusFilter(value || null)}
                    className="w-full sm:w-auto"
                >
                    <Select.Option value="unread">Unread</Select.Option>
                    <Select.Option value="read">Read</Select.Option>
                    <Select.Option value="replied">Replied</Select.Option>
                </Select>
                <Button onClick={clearFilters} className="w-full sm:w-auto" icon={<FilterOutlined />}>
                    Clear Filters
                </Button>
                </div>
            </Card>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <Table
                        dataSource={filteredMessages}
                        columns={columns}
                        rowKey="id"
                        className="dark:text-gray-300"
                        scroll={{ x: true}}
                    />
                )}
            </Card>

            {/* Message Detail View */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <Card className="w-full max-w-2xl h-[80vh] overflow-y-auto shadow-xl dark:bg-gray-800 dark:border-gray-700 relative">
                        <Button
                            className="absolute top-2 right-2"
                            onClick={() => setSelectedMessage(null)}
                            icon={<CloseCircleOutlined />}
                            ghost
                            size="small"
                            danger
                        />
                        <div className="p-6">
                            <Typography.Title level={3} className="mb-4 text-gray-800 dark:text-gray-200">
                                Message Details ({selectedMessage.id})
                            </Typography.Title>
                            <div className="grid grid-cols-1 gap-4 mb-4 text-gray-700 dark:text-gray-300">
                                <div>
                                    <p><span className="font-semibold">Name:</span> {selectedMessage.name}</p>
                                    <p><span className="font-semibold">Email:</span> {selectedMessage.email}</p>
                                    <p><span className="font-semibold">Subject:</span> {selectedMessage.subject}</p>
                                    <p><span className="font-semibold">Sent:</span>
                                        <ClockCircleOutlined style={{ marginRight: 4, fontSize: '0.8em' }} />
                                        {dayjs(selectedMessage.sentDate).format('MMM DD,롭슨 HH:mm:ss')}
                                     </p>
                                    <p><span className="font-semibold">Status:</span> {getStatusTag(selectedMessage.status)}</p>
                                </div>
                                <div>
                                    <p><span className="font-semibold">Message:</span></p>
                                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            {selectedMessage.status !== 'replied' && (
                                <div className="flex gap-4">
                                    <Input
                                        placeholder="Enter your reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="flex-1 dark:bg-gray-700 dark:text-gray-200"
                                    />
                                    <Button
                                        type="primary"
                                        onClick={() => handleReply(selectedMessage.id)}
                                    >
                                        Reply
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default MailboxPage;
