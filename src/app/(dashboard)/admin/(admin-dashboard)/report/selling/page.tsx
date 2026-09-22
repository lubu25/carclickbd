"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Select, DatePicker, Typography } from 'antd';
import {
    BarChartOutlined,
    LineChartOutlined,
    AreaChartOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; 
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


interface SalesData {
    date: string;
    sales: number;
    orders: number;
    revenue: number;
}

const SellingReportPage = () => {
    const [reportType, setReportType] = useState<'daily' | 'monthly' | 'custom'>('monthly');
    const [dateRange, setDateRange] = useState<{ startDate: dayjs.Dayjs | null; endDate: dayjs.Dayjs | null }>({
        startDate: null,
        endDate: null,
    });
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar'); // Default chart type is 'bar'
    const [loading, setLoading] = useState(false);
    const barChartColor = '#2563eb'; // Tailwind blue-600, you can choose any color

    // Mock Data Generation (Replace with actual API calls)
    const generateMockData = (
        type: 'daily' | 'monthly' | 'custom',
        startDate?: dayjs.Dayjs | null,
        endDate?: dayjs.Dayjs | null
    ): SalesData[] => {
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
            // Default to monthly
            start = today.startOf('month');
            end = today.endOf('month');
        }

        const data: SalesData[] = [];
        let currentDate = start.clone();

        while (currentDate <= end) {
            const dateString = currentDate.format('YYYY-MM-DD');
            const sales = Math.floor(Math.random() * 100) + 50; // Random sales between 50 and 150
            const orders = Math.floor(Math.random() * 50) + 20; // Random orders between 20 and 70
            const revenue = sales * (Math.random() * 10 + 10); // Random price between 10 and 20

            data.push({
                date: dateString,
                sales,
                orders,
                revenue,
            });

            currentDate = currentDate.add(1, 'day');
        }
        return data;
    };

    // Fetch/Generate Data
    useEffect(() => {
        setLoading(true);
        // Simulate API call delay
        const timeoutId = setTimeout(() => {
            let data = generateMockData(reportType, dateRange.startDate, dateRange.endDate);
            setSalesData(data);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [reportType, dateRange]);

    const handleReportTypeChange = (value: 'daily' | 'monthly' | 'custom') => {
        setReportType(value);
        // Reset date range when report type changes
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
        // Can not select days after today
        return current > dayjs();
    };

    const getChartOptions = () => ({
        chart: {
            type: chartType,
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
            type: 'datetime' as 'datetime',
            categories: salesData.map((item) => item.date),
            tickAmount: 5,
            labels: {
                formatter: (value: string) => {
                    return dayjs(value).format('MMM DD,[]'); // Added year for monthly view
                },
            },
        },
        yaxis: {
            title: {
                text: 'Revenue',
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
        },
        legend: {
            position: 'bottom' as 'bottom', // Explicitly cast to a valid type
        },
        colors: [chartType === 'bar' ? barChartColor : '#6366f1'], // Apply color conditionally
        ...(chartType === 'area' && {
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100],
                },
            },
        }),
        series: [
            {
                name: 'Revenue',
                data: salesData.map((item) => item.revenue),
            },
        ],
    });

    const renderChart = () => {
        const options = getChartOptions();
        return (
            <ReactApexChart
                options={options}
                series={options.series}
                type={chartType}
                height={300}
            />
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Selling Report</h1>

            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 items-end">
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
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <span className="text-gray-700 dark:text-gray-300">Chart Type:</span>
                        <Select
                            defaultValue="bar" // Set default chart type to 'bar'
                            style={{ width: 150 }}
                            onChange={(value) => setChartType(value as 'bar' | 'line' | 'area')}
                            options={[
                                { value: 'bar', label: 'Bar Chart', icon: <BarChartOutlined /> },
                                { value: 'line', label: 'Line Chart', icon: <LineChartOutlined /> },
                                { value: 'area', label: 'Area Chart', icon: <AreaChartOutlined /> },
                            ]}
                            className="dark:bg-gray-700 dark:text-gray-200"
                        />
                    </div>
                </div>
            </Card>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                {loading ? (
                    <div className="text-center py-10">Loading...</div> // Simple loading indicator
                ) : (
                    <>
                        <div className="mb-6">
                            <Typography.Title level={4} className="text-gray-700 dark:text-gray-200">
                                {reportType === 'daily'
                                    ? `Daily Sales Report (${dayjs().format('PPP')})`
                                    : reportType === 'monthly'
                                        ? `Monthly Sales Report (${dayjs().format('MMMM,[]')})` // Added year to monthly title
                                        : dateRange.startDate && dateRange.endDate
                                            ? `Custom Sales Report (${dateRange.startDate.format('PPP')} - ${dateRange.endDate.format('PPP')})`
                                            : 'Sales Report'}
                            </Typography.Title>
                        </div>
                        {renderChart()}
                    </>
                )}
            </Card>

            <Card className="mt-6 shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Sales Data</h2>
                <Table
                    dataSource={salesData}
                    columns={[
                        {
                            title: 'Date',
                            dataIndex: 'date',
                            key: 'date',
                            className: 'text-gray-700 dark:text-gray-300',
                            render: (text: string) => dayjs(text).format('MMM DD,[]'), // Added year to table date
                        },
                        {
                            title: 'Sales',
                            dataIndex: 'sales',
                            key: 'sales',
                            className: 'text-gray-700 dark:text-gray-300',
                        },
                        {
                            title: 'Orders',
                            dataIndex: 'orders',
                            key: 'orders',
                            className: 'text-gray-700 dark:text-gray-300',
                        },
                        {
                            title: 'Revenue',
                            dataIndex: 'revenue',
                            key: 'revenue',
                            className: 'text-gray-700 dark:text-gray-300',
                            render: (value: number) => `$${value.toFixed(2)}`,
                        },
                    ]}
                    rowKey="date"
                    className="text-gray-700 dark:text-gray-300"
                />
            </Card>
        </div>
    );
};

export default SellingReportPage;

