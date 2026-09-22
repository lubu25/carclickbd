"use client";
import React, { useState } from 'react';
import {
  Layout,
  Typography,
  DatePicker,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Space,
} from 'antd';
import {
  LoginOutlined,
  LogoutOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Content } = Layout;

interface Activity {
  key: string;
  activity: string;
  timestamp: string;
  duration?: string;
}

const ReportPage: React.FC = () => {
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const handleDateChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    setDates(dates as [dayjs.Dayjs, dayjs.Dayjs] | null);
    // Implement data fetching based on selected date range
  };

  const summaryData = [
    {
      title: 'Logins',
      value: 15,
      icon: <LoginOutlined />,
    },
    {
      title: 'Logouts',
      value: 14,
      icon: <LogoutOutlined />,
    },
    {
      title: 'Total Time Spent',
      value: '5h 30m',
      icon: <ClockCircleOutlined />,
    },
    {
      title: 'Actions Performed',
      value: 25,
      icon: <FileTextOutlined />,
    },
  ];

  const activityData: Activity[] = [
    {
      key: '1',
      activity: 'Logged in',
      timestamp: '2025-05-07 09:00 AM',
    },
    {
      key: '2',
      activity: 'Viewed Dashboard',
      timestamp: '2025-05-07 09:05 AM',
    },
    {
      key: '3',
      activity: 'Updated Profile',
      timestamp: '2025-05-07 09:15 AM',
    },
    {
      key: '4',
      activity: 'Logged out',
      timestamp: '2025-05-07 10:00 AM',
    },
    {
      key: '5',
      activity: 'Logged in',
      timestamp: '2025-05-07 02:00 PM',
    },
    {
      key: '6',
      activity: 'Changed Password',
      timestamp: '2025-05-07 02:30 PM',
    },
    {
      key: '7',
      activity: 'Logged out',
      timestamp: '2025-05-07 03:00 PM',
    },
  ];

  const columns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  return (
    <Layout style={{ padding: '24px' }}>
      <Content>
        <Title level={2}>User Activity Report</Title>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <RangePicker onChange={handleDateChange} />
          <Row gutter={16}>
            {summaryData.map((item) => (
              <Col span={6} key={item.title}>
                <Card>
                  <Statistic
                    title={item.title}
                    value={item.value}
                    prefix={item.icon}
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <Table
            columns={columns}
            dataSource={activityData}
            pagination={{ pageSize: 5 }}
          />
        </Space>
      </Content>
    </Layout>
  );
};

export default ReportPage;
