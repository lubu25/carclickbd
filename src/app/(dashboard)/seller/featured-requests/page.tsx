"use client";

import { Card, Col, Row, Table } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from "@ant-design/icons";

const stats = [
  {
    title: "Total Requests",
    value: "0",
    icon: <StarOutlined />,
  },
  {
    title: "Pending",
    value: "0",
    icon: <ClockCircleOutlined />,
  },
  {
    title: "Approved",
    value: "0",
    icon: <CheckCircleOutlined />,
  },
];

const FeaturedRequestsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Featured Requests
      </h1>

      <Row gutter={[16, 16]} className="mb-6">
        {stats.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.title}>
            <Card className="shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {item.title}
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {item.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-100 text-xl text-slate-600">
                  {item.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Request List" className="shadow-sm">
        <Table
          dataSource={[]}
          columns={[
            { title: "Vehicle", dataIndex: "vehicle", key: "vehicle" },
            { title: "Reference", dataIndex: "reference", key: "reference" },
            { title: "Status", dataIndex: "status", key: "status" },
            { title: "Request Date", dataIndex: "requestDate", key: "requestDate" },
          ]}
          pagination={false}
          locale={{ emptyText: "0 data" }}
        />
      </Card>
    </div>
  );
};

export default FeaturedRequestsPage;
