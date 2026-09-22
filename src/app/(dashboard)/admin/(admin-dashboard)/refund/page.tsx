"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Space, Button, Tag, Typography, Popconfirm, message, Input, Select, DatePicker } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowRightOutlined,
    CalendarOutlined,
    SearchOutlined,
    FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import 'dayjs/locale/en';

interface RefundRequest {
    id: string;
    orderId: string;
    customerName: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    paymentMethod: string;
}

const RefundRequestPage = () => {
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null); // 'pending', 'approved', 'rejected', null
    const [dateFilter, setDateFilter] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);


    // Mock Data (Replace with actual API calls)
      const generateMockData = (): RefundRequest[] => {
        const today = dayjs();
        const data: RefundRequest[] = [
            {
                id: '1',
                orderId: 'ORD-1001',
                customerName: 'John Doe',
                amount: 50.00,
                reason: 'Product damaged',
                status: 'pending',
                requestDate: today.subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'Credit Card'
            },
            {
                id: '2',
                orderId: 'ORD-1002',
                customerName: 'Jane Smith',
                amount: 25.50,
                reason: 'Wrong item received',
                status: 'approved',
                requestDate: today.subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'PayPal'
            },
            {
                id: '3',
                orderId: 'ORD-1003',
                customerName: 'Bob Johnson',
                amount: 100.00,
                reason: 'Order cancellation',
                status: 'rejected',
                requestDate: today.subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'Bank Transfer'
            },
            {
                id: '4',
                orderId: 'ORD-1004',
                customerName: 'Alice Brown',
                amount: 120.00,
                reason: 'Product not as described',
                status: 'pending',
                requestDate: today.subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'Credit Card'
            },
            {
                id: '5',
                orderId: 'ORD-1005',
                customerName: 'Mike Wilson',
                amount: 15.00,
                reason: 'Delivery delayed',
                status: 'approved',
                requestDate: today.subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'PayPal'
            },
             {
                id: '6',
                orderId: 'ORD-1006',
                customerName: 'Sarah Lee',
                amount: 75.00,
                reason: 'Missing parts',
                status: 'pending',
                requestDate: today.subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'Bank Transfer'
            },
            {
                id: '7',
                orderId: 'ORD-1007',
                customerName: 'David Kim',
                amount: 300.00,
                reason: 'Damaged during shipping',
                status: 'rejected',
                requestDate: today.subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'Credit Card'
            },
            {
                id: '8',
                orderId: 'ORD-1008',
                customerName: 'Emily Chen',
                amount: 60.00,
                reason: 'Changed mind',
                status: 'pending',
                requestDate: today.subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
                paymentMethod: 'PayPal'
            },
        ];
        return data;
    };

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            const data = generateMockData();
            setRefundRequests(data);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleApproveRefund = (id: string) => {
        setRefundRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === id ? { ...req, status: 'approved' } : req
            )
        );
        message.success('Refund request approved');
    };

    const handleRejectRefund = (id: string) => {
        setRefundRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === id ? { ...req, status: 'rejected' } : req
            )
        );
        message.error('Refund request rejected');
    };

    const getStatusTag = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'pending':
                return <Tag color="yellow">Pending</Tag>;
            case 'approved':
                return <Tag color="green">Approved</Tag>;
            case 'rejected':
                return <Tag color="red">Rejected</Tag>;
            default:
                return null;
        }
    };

    // Filter and Search
    const filteredRefundRequests = refundRequests.filter(req => {
        const searchTextMatch =
            req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.reason.toLowerCase().includes(searchQuery.toLowerCase());

        const statusMatch = !statusFilter || req.status === statusFilter;

        const dateMatch = !dateFilter ||
            (dayjs(req.requestDate).isSameOrAfter(dateFilter[0], 'day') &&
                dayjs(req.requestDate).isSameOrBefore(dateFilter[1], 'day'));

        return searchTextMatch && statusMatch && dateMatch;
    });

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter(null);
        setDateFilter(null);
    };

    interface ColumnType {
      title: string;
      dataIndex?: keyof RefundRequest;
      key: string;
      render?: (text: any, record?: RefundRequest) => React.ReactNode;
    }

    const columns: ColumnType[] = [
      {
        title: 'Request ID',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <Typography.Text className="font-medium">{text}</Typography.Text>,
      },
      {
        title: 'Order ID',
        dataIndex: 'orderId',
        key: 'orderId',
        render: (text: string) => (
          <a href={`/admin/orders/view/${text}`} className="text-blue-500 hover:underline">
            {text} <ArrowRightOutlined style={{ fontSize: '0.7em' }} />
          </a>
        ),
      },
      {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (value: number) => <Typography.Text className="font-semibold">${value.toFixed(2)}</Typography.Text>,
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: RefundRequest['status']) => getStatusTag(status),
      },
      {
        title: 'Request Date',
        dataIndex: 'requestDate',
        key: 'requestDate',
        render: (text: string) => (
          <>
            <CalendarOutlined style={{ marginRight: 4, fontSize: '0.8em' }} />
            {dayjs(text).format('MMM DD, YYYY HH:mm:ss')}
          </>
        ),
      },
      {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          record ? (
            <Space size="middle">
              {record.status === 'pending' && (
                <>
                  <Popconfirm
                    title="Approve Refund"
                    description="Are you sure you want to approve this refund request?"
                    onConfirm={() => handleApproveRefund(record.id)}
                    okButtonProps={{ icon: <CheckCircleOutlined /> }}
                    cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
                  >
                    <Button
                      type="primary"
                      size="small"
                    >
                      Approve
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="Reject Refund"
                    description="Are you sure you want to reject this refund request?"
                    onConfirm={() => handleRejectRefund(record.id)}
                    okButtonProps={{ icon: <CloseCircleOutlined /> }}
                    cancelButtonProps={{ icon: <CheckCircleOutlined /> }}
                  >
                    <Button
                      danger
                      size="small"
                    >
                      Reject
                    </Button>
                  </Popconfirm>
                </>
              )}
              {record.status === 'approved' && (
                <Tag color="green">Approved</Tag>
              )}
              {record.status === 'rejected' && (
                <Tag color="red">Rejected</Tag>
              )}
            </Space>
          ) : null
        ),
      },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Refund Requests</h1>

            <Card className="mb-6 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 items-center">
                    <Input
                        placeholder="Search requests..."
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
                        <Select.Option value="pending">Pending</Select.Option>
                        <Select.Option value="approved">Approved</Select.Option>
                        <Select.Option value="rejected">Rejected</Select.Option>
                    </Select>
                    <DatePicker.RangePicker
                        onChange={setDateFilter}
                        value={dateFilter || null}
                        className="w-full sm:w-auto"
                        format="YYYY-MM-DD"
                    />
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
                        dataSource={filteredRefundRequests}
                        columns={columns}
                        rowKey="id"
                        className="dark:text-gray-300"
                    />
                )}
            </Card>
        </div>
    );
};

export default RefundRequestPage;
