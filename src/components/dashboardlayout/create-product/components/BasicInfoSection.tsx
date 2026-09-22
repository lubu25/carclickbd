"use client";
import React from "react";
import { Card, Form, Input, Row, Col, Select } from "antd";

const { Option } = Select;

const years = Array.from(
  { length: new Date().getFullYear() - 1949 },
  (_, i) => 1950 + i
).reverse();

const BasicInfoSection = () => {
  return (
    <Card title="Basic Information" className="shadow-md mb-4">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="e.g. 2023 Toyota Harrier Z Leather Package" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="make"
            label="Maker"
            rules={[{ required: true, message: "Please enter maker" }]}
          >
            <Input placeholder="e.g. Toyota, Honda, Lexus" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="model"
            label="Car Name"
            rules={[{ required: true, message: "Please enter car name" }]}
          >
            <Input placeholder="e.g. Harrier, Corolla Cross, LX" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="grade" label="Grade">
            <Input placeholder="e.g. Z Leather Package" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            name="productionYear"
            label="Production Year"
            rules={[{ required: true, message: "Please select production year" }]}
          >
            <Select showSearch placeholder="Select production year" allowClear>
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item name="registrationYear" label="Registration Year (Optional)">
            <Select showSearch placeholder="Select registration year" allowClear>
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default BasicInfoSection;
