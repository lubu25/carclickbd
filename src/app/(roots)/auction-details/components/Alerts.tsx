"use client";
import { Card, Button, Input, Select } from "antd";

const { Option } = Select;

export default function Alerts() {
  return (
    <Card className="shadow rounded-lg">
      <h2 className="text-lg font-medium mb-2">Get alerts on similar vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Input placeholder="First name" />
        <Input placeholder="Last name" />
        <Select defaultValue="Weekly">
          <Option value="Daily">Daily</Option>
          <Option value="Weekly">Weekly</Option>
        </Select>
      </div>
      <Button type="primary">Set alert</Button>
    </Card>
  );
}
