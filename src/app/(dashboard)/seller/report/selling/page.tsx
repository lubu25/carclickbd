"use client";

import { Card, Col, Row, Table } from "antd";
import {
  CarOutlined,
  DollarCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const stats = [
  {
    title: "Total Sales",
    value: "0",
    icon: <CarOutlined />,
  },
  {
    title: "Total Orders",
    value: "0",
    icon: <ShoppingOutlined />,
  },
  {
    title: "Total Revenue",
    value: "BDT 0",
    icon: <DollarCircleOutlined />,
  },
];

const SellingReportPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">
        Selling Report
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

      <Card title="Sales Report" className="shadow-sm">
        <div className="mb-4 grid min-h-[220px] place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-950">0</p>
            <p className="mt-2 text-sm text-slate-500">
              No selling data available yet.
            </p>
          </div>
        </div>
        <Table
          dataSource={[]}
          columns={[
            { title: "Date", dataIndex: "date", key: "date" },
            { title: "Sales", dataIndex: "sales", key: "sales" },
            { title: "Orders", dataIndex: "orders", key: "orders" },
            { title: "Revenue", dataIndex: "revenue", key: "revenue" },
          ]}
          pagination={false}
          locale={{ emptyText: "0 data" }}
        />
      </Card>
    </div>
  );
};

export default SellingReportPage;
