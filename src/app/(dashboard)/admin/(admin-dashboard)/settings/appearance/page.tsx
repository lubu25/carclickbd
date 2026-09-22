"use client";
import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  Upload,
  Typography,
  Divider,
  Row,
  Col,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SettingsAppearancePage: React.FC = () => {
  const [form] = Form.useForm();

  const handleFormSubmit = (values: any) => {
    console.log("Form Values:", values);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="max-w-4xl mx-auto p-8 rounded-lg "
      >
        <Divider orientation="left">System Settings</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="systemName"
              label="System Name"
              rules={[{ required: true, message: "Please enter system name" }]}
            >
              <Input placeholder="Enter system name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="siteTitle"
              label="Site Title"
              rules={[{ required: true, message: "Please enter site title" }]}
            >
              <Input placeholder="Enter site title" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="siteMotto" label="Site Motto">
          <Input placeholder="Enter site motto" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="siteIcon" label="Site Icon">
              <Upload name="icon" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Icon</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="systemLogo" label="System Logo - White">
              <Upload name="logo" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Color Settings</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="baseColor" label="Website Base Color">
              <Input type="color" className="w-16 h-10 p-0 border-none" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="baseHoverColor" label="Website Base Hover Color">
              <Input type="color" className="w-16 h-10 p-0 border-none" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="secondaryBaseColor"
              label="Website Secondary Base Color"
            >
              <Input type="color" className="w-16 h-10 p-0 border-none" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="secondaryBaseHoverColor"
              label="Website Secondary Base Hover Color"
            >
              <Input type="color" className="w-16 h-10 p-0 border-none" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Global SEO</Divider>
        <Form.Item name="metaTitle" label="Meta Title">
          <Input placeholder="Enter meta title" />
        </Form.Item>

        <Form.Item name="metaDescription" label="Meta Description">
          <Input.TextArea placeholder="Enter meta description" rows={4} />
        </Form.Item>

        <Form.Item name="keywords" label="Keywords">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter keywords"
          />
        </Form.Item>

        <Form.Item name="metaImage" label="Meta Image">
          <Upload name="metaImage" listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload Meta Image</Button>
          </Upload>
        </Form.Item>

        <Divider orientation="left">Custom Script</Divider>
        <Form.Item
          name="headerScript"
          label="Header Custom Script - before </head>"
        >
          <Input.TextArea
            placeholder="Enter custom script for header"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="footerScript"
          label="Footer Custom Script - before </body>"
        >
          <Input.TextArea
            placeholder="Enter custom script for footer"
            rows={4}
          />
        </Form.Item>

        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SettingsAppearancePage;
