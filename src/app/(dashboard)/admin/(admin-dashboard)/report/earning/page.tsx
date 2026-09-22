"use client";
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Select, DatePicker, Typography } from 'antd';
import {
    DollarCircleOutlined,
    ShoppingOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import dynamic from 'next/dynamic';

interface EarningsData {
    date: string;
    earnings: number;
    orders: number;
    payments: number;
}

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


const EarningPage = () => {
    const [reportType, setReportType] = useState<'daily' | 'monthly' | 'custom'>('monthly');
    const [dateRange, setDateRange] = useState<{ startDate: dayjs.Dayjs | null; endDate: dayjs.Dayjs | null }>({
        startDate: null,
        endDate: null,
    });
    const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
    const [loading, setLoading] = useState(false);

    // Mock Data Generation
    const generateMockData = (
        type: 'daily' | 'monthly' | 'custom',
        startDate?: dayjs.Dayjs | null,
        endDate?: dayjs.Dayjs | null
    ): EarningsData[] => {
        const today = dayjs();
        let start: dayjs.Dayjs;
        let end: dayjs.Dayjs;

        if (type === 'daily') {
            start = today.startOf('day');
            end = today.endOf('day');
        } else if (type === 'monthly') {
            start = today.startOf('month');
            end = today.endOf('month');
        } else if (type === 'custom' && startDate && endDate) {
            start = startDate;
            end = endDate;
        } else {
            start = today.startOf('month'); // Default to monthly if no custom range
            end = today.endOf('month');
        }

        const data: EarningsData[] = [];
        let currentDate = start.clone();

        while (currentDate <= end) {
            const dateString = currentDate.format('YYYY-MM-DD');
            const earnings = Math.floor(Math.random() * 1000) + 500;  // Random earnings
            const orders = Math.floor(Math.random() * 100) + 50;    // Random orders
            const payments = Math.floor(Math.random() * 800) + 400;  // Random payments

            data.push({
                date: dateString,
                earnings,
                orders,
                payments,
            });

            currentDate = currentDate.add(1, 'day');
        }
        return data;
    };

    // Fetch/Generate Data
    useEffect(() => {
        setLoading(true);
        const timeoutId = setTimeout(() => {
            const data = generateMockData(reportType, dateRange.startDate, dateRange.endDate);
            setEarningsData(data);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [reportType, dateRange]);

    const handleReportTypeChange = (value: 'daily' | 'monthly' | 'custom') => {
        setReportType(value);
        setDateRange({ startDate: null, endDate: null });
    };

    const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
        if (dates) {
            setDateRange({ startDate: dates[0], endDate: dates[1] });
        } else {
            setDateRange({ startDate: null, endDate: null });
        }
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        return current > dayjs();
    };

    const getChartOptions = () => ({
        chart: {
            type: 'area',
            height: 300,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            type: 'datetime',
            categories: earningsData.map(item => item.date),
            tickAmount: 5,
            labels: {
                format: 'MMM DD, YYYY'
            }
        },
        yaxis: {
            title: {
                text: 'Amount ($)',
            },
            labels: {
                formatter: (value: number) => `$${value.toFixed(2)}`,
            },
        },
        tooltip: {
            x: {
                format: 'yyyy-MM-dd',
            },
            y: {
                formatter: (value: number) => `$${value.toFixed(2)}`,
            },
            intersect: false,
            shared: true
        },
        legend: {
            position: 'bottom',
        },
        colors: ['#8884d8', '#82ca9d', '#ffc658'], // Example colors
        series: [
            {
                name: 'Earnings',
                data: earningsData.map(item => item.earnings),
                color: '#8884d8'
            },
            {
                name: 'Orders',
                data: earningsData.map(item => item.orders),
                color: '#82ca9d'
            },
            {
                name: 'Payments',
                data: earningsData.map(item => item.payments),
                color: '#ffc658'
            },
        ],
        stroke: {
            curve: 'smooth',
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.85,
                opacityTo: 0.25,
                stops: [0, 100],
            },
        },
    });

    const renderChart = () => {
        const options = getChartOptions();
        return (
            <ReactApexChart
                options={options as ApexCharts.ApexOptions}
                series={options.series}
                type="area"
                height={300}
            />
        );
    };

    // Calculate total earnings, orders, and payments
    const totalEarnings = earningsData.reduce((acc, curr) => acc + curr.earnings, 0);
    const totalOrders = earningsData.reduce((acc, curr) => acc + curr.orders, 0);
    const totalPayments = earningsData.reduce((acc, curr) => acc + curr.payments, 0);


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Earnings</h1>

            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 items-end justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <span className="text-gray-700 dark:text-gray-300">Report Type:</span>
                        <Select
                            defaultValue="monthly"
                            style={{ width: 150 }}
                            onChange={handleReportTypeChange}
                            options={[
                                { value: 'daily', label: 'Daily' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'custom', label: 'Custom' },
                            ]}
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>

                    {reportType === 'custom' && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <span className="text-gray-700 dark:text-gray-300">Date Range:</span>
                            <DatePicker.RangePicker
                                onChange={handleDateRangeChange}
                                disabledDate={disabledDate}
                                className="dark:bg-gray-700 dark:text-gray-200"
                                style={{ width: 250 }}
                                format="YYYY-MM-DD"
                            />
                        </div>
                    )}
                </div>
            </Card>

            <Row gutter={24} className="mb-6">
                <Col xs={24} sm={12} lg={8}>
                    <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg dark:from-green-600 dark:to-green-800">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <Typography.Title level={4} className="text-white">Total Earnings</Typography.Title>
                                <Typography.Text className="text-xl font-bold text-white">
                                    ${totalEarnings.toFixed(2)}
                                </Typography.Text>
                            </div>
                            <DollarCircleOutlined className="text-4xl text-white opacity-70" />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg dark:from-blue-600 dark:to-blue-800">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <Typography.Title level={4} className="text-white">Total Orders</Typography.Title>
                                <Typography.Text className="text-xl font-bold text-white">
                                    {totalOrders}
                                </Typography.Text>
                            </div>
                            <ShoppingOutlined className="text-4xl text-white opacity-70" />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-lg dark:from-purple-600 dark:to-purple-800">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <Typography.Title level={4} className="text-white">Total Payments</Typography.Title>
                                <Typography.Text className="text-xl font-bold text-white">
                                    ${totalPayments.toFixed(2)}
                                </Typography.Text>
                            </div>
                            <CreditCardOutlined className="text-4xl text-white opacity-70" />
                        </div>
                    </Card>
                </Col>
            </Row>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <>
                        <div className="mb-6">
                            <Typography.Title level={4} className="text-gray-700 dark:text-gray-200">
                                {reportType === 'daily'
                                    ? `Daily Earnings Report (${dayjs().format('PPP')})`
                                    : reportType === 'monthly'
                                        ? `Monthly Earnings Report (${dayjs().format('MMMM, YYYY')})`
                                        : dateRange.startDate && dateRange.endDate
                                            ? `Custom Earnings Report (${dateRange.startDate.format('PPP')} - ${dateRange.endDate.format('PPP')})`
                                            : 'Earnings Report'}
                            </Typography.Title>
                        </div>
                        {renderChart()}
                    </>
                )}
            </Card>
        </div>
    );
};

export default EarningPage;

// import React from 'react';

// const page = () => {
//     return (
//         <div>
//             Comming Soon
//         </div>
//     );
// };

// export default page;