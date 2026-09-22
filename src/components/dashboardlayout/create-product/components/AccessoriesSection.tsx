"use client";
import React, { useMemo, useState } from "react";
import { Card, Form, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const accessoryOptions = [
  "Alloy Wheels",
  "ABS",
  "Airbag",
  "A/C",
  "Back Tire",
  "Back Camera",
  "Power Steering",
  "Power Window",
  "Rear Spoiler",
  "Leather Seat",
  "Push Start",
  "Power Seat",
  "DVD",
  "Spare Tire",
  "TV",
  "CD Changer",
  "CD Player",
];

const AccessoriesSection = () => {
  const form = Form.useFormInstance();
  const [searchText, setSearchText] = useState("");
  const rawAccessories = Form.useWatch("accessories", form);
  const selectedAccessories = Array.isArray(rawAccessories)
    ? rawAccessories
    : rawAccessories
    ? [rawAccessories]
    : [];

  const filteredAccessories = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return accessoryOptions;
    return accessoryOptions.filter((item) => item.toLowerCase().includes(query));
  }, [searchText]);

  const setAccessories = (items: string[]) => {
    form.setFieldsValue({ accessories: items });
  };

  const toggleAccessory = (item: string) => {
    const exists = selectedAccessories.includes(item);
    setAccessories(
      exists
        ? selectedAccessories.filter((selected) => selected !== item)
        : [...selectedAccessories, item]
    );
  };

  const addCustomAccessory = () => {
    const value = searchText.trim();
    if (!value || selectedAccessories.includes(value)) return;
    setAccessories([...selectedAccessories, value]);
    setSearchText("");
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between gap-3">
          <span>Accessories</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      }
      className="shadow-md mb-4"
    >
      <Form.Item name="accessories" hidden>
        <Input />
      </Form.Item>

      <div className="mb-4">
        <Input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onPressEnter={addCustomAccessory}
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Search & add more options"
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {filteredAccessories.map((item) => {
          const active = selectedAccessories.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggleAccessory(item)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                active
                  ? "bg-[#003399] text-white shadow-sm"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <Form.Item name="optionsText" label="Options">
        <Input.TextArea
          rows={4}
          placeholder="Write additional options, packages, accessories, or special notes"
        />
      </Form.Item>
    </Card>
  );
};

export default AccessoriesSection;
