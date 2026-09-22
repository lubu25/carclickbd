"use client";
import React from "react";
import { Card, Form, Input, Button, Select } from "antd";
import { useGetAllCategoriesQuery } from "@/Redux/api/categoryApi";

const { TextArea } = Input;
const { Option } = Select;

const NotesCategorySection = ({ isLoading }: { isLoading: boolean }) => {
  const { data: catResp } = useGetAllCategoriesQuery?.({}) ?? { data: undefined };
  const categories = catResp?.data ?? [];

  return (
    <>
      <Card title="Seller Notes & Category" className="shadow-md mb-16">
        <Form.Item name="sellerNotes" label="Seller Notes">
          <TextArea rows={3} placeholder="Anything else the buyer should know" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Select category" }]}
        >
          <Select placeholder="Choose category" allowClear>
            {categories.length > 0
              ? categories.map((c: any) => (
                  <Option key={c.id} value={c.id}>
                    {c.title}
                  </Option>
                ))
              : (
                <>
                  <Option value="cars">Cars</Option>
                  <Option value="motorcycles">Motorcycles</Option>
                  <Option value="trucks">Trucks</Option>
                </>
              )}
          </Select>
        </Form.Item>
      </Card>
    </>
  );
};

export default NotesCategorySection;
