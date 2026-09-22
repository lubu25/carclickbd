"use client";
import React from "react";
import { Card, Row, Col, Form, Select } from "antd";

const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
  "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar",
  "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
  "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi",
  "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
  "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi",
  "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati",
  "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
  "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

const LocationSection = () => (
  <Card title="Location" className="shadow-md mb-4">
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <Form.Item name={["location", "city"]} label="District">
          <Select
            showSearch
            allowClear
            placeholder="Select district"
            options={districts.map((district) => ({
              label: district,
              value: district,
            }))}
            optionFilterProp="label"
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);

export default LocationSection;
