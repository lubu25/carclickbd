"use client";
import { Card, Button, Input, Select } from "antd";

const { Option } = Select;

export default function ShippingEstimate({ zip, setZip, shippingType, setShippingType }: any) {
  return (
    <Card className="shadow rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Shipping estimate</h2>
        <Button type="link" className="text-sm px-0">View map</Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={shippingType} onChange={(val) => setShippingType(val)} className="w-36">
          <Option value="domestic">Domestic</Option>
          <Option value="international">International</Option>
        </Select>
        <Input placeholder="Enter US zip code" value={zip} onChange={(e) => setZip(e.target.value)} className="w-36" />
        <Button type="primary">Check estimate</Button>
      </div>
    </Card>
  );
}
