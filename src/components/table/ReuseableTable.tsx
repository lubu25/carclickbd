import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { Row, Col, Table, Card, Input } from "antd";
import { IProduct } from "@/Interface/product";
import { FaCheckCircle, FaTimesCircle, FaShoppingCart } from "react-icons/fa";
import StatsCard from "./StatsCard";

interface ReuseableTableProps {
  products: IProduct[];
  loading: boolean;
  columns: ColumnsType<IProduct>;
  rowSelection?: any;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onChange: (pagination: any) => void;
}

const ReuseableTable: React.FC<ReuseableTableProps> = ({
  products,
  loading,
  pagination,
  columns,

  onChange,
}) => {

  const [searchText, setSearchText] = useState("");


  return (
    <div className="space-y-4">
      <Card className="shadow-md rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-500">Products List</h1>
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 text-lg border rounded-lg"
            />
          </div>
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={6} xs={12} md={8} lg={6} className="mb-4">
          <StatsCard
            title="Total Products"
            value={products.length || 0}
            icon={<FaShoppingCart />}
            bgColor="bg-white"
            textColor="text-green-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Total Active"
            value={0}
            icon={<FaCheckCircle />}
            bgColor="bg-white"
            textColor="text-blue-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Total Category"
            value={31}
            icon={<FaCheckCircle />}
            bgColor="bg-white"
            textColor="text-green-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Total Disabled"
            value={0}
            icon={<FaTimesCircle />}
            bgColor="bg-white"
            textColor="text-red-500"
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        rowSelection={{ type: "checkbox" }}
        dataSource={products || []}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
        onChange={onChange}
        scroll={{ x: true }}
      />

    </div>
  );
};

export default ReuseableTable;
