"use client";
import React from "react";
import { Card, Form, Select } from "antd";

const FeatureTagsSection = () => (
  <Card title="Features" className="shadow-md mb-4">
    <Form.Item name="featuresAndOptions" label="Features">
      <Select
        mode="tags"
        tokenSeparators={[]}
        placeholder="Press Enter to add feature"
        open={false}
      />
    </Form.Item>
  </Card>
);

export default FeatureTagsSection;
