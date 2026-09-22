"use client"
"use client";
import { Table, Button, Tag, Image, Switch, message } from "antd";
import { FireOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const FlashDealsPage: React.FC = () => {
  const [deals, setDeals] = useState([
    {
      key: "1",
      title: "Smartphone X",
      banner: "/placeholder.png",
      startDate: "2023-10-01",
      endDate: "2023-10-31",
      status: "Active",
      featured: true,
      pageLink: "/smartphone-x",
    },
    {
      key: "2",
      title: "Wireless Headphones",
      banner: "/placeholder.png",
      startDate: "2023-10-05",
      endDate: "2023-10-20",
      status: "Active",
      featured: false,
      pageLink: "/wireless-headphones",
    },
    {
      key: "3",
      title: "Smart Watch Pro",
      banner: "/placeholder.png",
      startDate: "2023-09-25",
      endDate: "2023-10-15",
      status: "Expired",
      featured: true,
      pageLink: "/smart-watch-pro",
    },
    {
      key: "4",
      title: "4K Ultra HD TV",
      banner: "/placeholder.png",
      startDate: "2023-10-10",
      endDate: "2023-10-30",
      status: "Active",
      featured: false,
      pageLink: "/4k-ultra-hd-tv",
    },
    {
      key: "5",
      title: "Smartphone X",
      banner: "/placeholder.png",
      startDate: "2023-10-01",
      endDate: "2023-10-31",
      status: "Active",
      featured: true,
      pageLink: "/smartphone-x",
    },
    {
      key: "6",
      title: "Wireless Headphones",
      banner: "/placeholder.png",
      startDate: "2023-10-05",
      endDate: "2023-10-20",
      status: "Active",
      featured: false,
      pageLink: "/wireless-headphones",
    },
    {
      key: "7",
      title: "Smart Watch Pro",
      banner: "/placeholder.png",
      startDate: "2023-09-25",
      endDate: "2023-10-15",
      status: "Expired",
      featured: true,
      pageLink: "/smart-watch-pro",
    },
    {
      key: "8",
      title: "4K Ultra HD TV",
      banner: "/placeholder.png",
      startDate: "2023-10-10",
      endDate: "2023-10-30",
      status: "Active",
      featured: false,
      pageLink: "/4k-ultra-hd-tv",
    },
    {
      key: "9",
      title: "Smartphone X",
      banner: "/placeholder.png",
      startDate: "2023-10-01",
      endDate: "2023-10-31",
      status: "Active",
      featured: true,
      pageLink: "/smartphone-x",
    },
    {
      key: "10",
      title: "Wireless Headphones",
      banner: "/placeholder.png",
      startDate: "2023-10-05",
      endDate: "2023-10-20",
      status: "Active",
      featured: false,
      pageLink: "/wireless-headphones",
    },
    {
      key: "11",
      title: "Smart Watch Pro",
      banner: "/placeholder.png",
      startDate: "2023-09-25",
      endDate: "2023-10-15",
      status: "Expired",
      featured: true,
      pageLink: "/smart-watch-pro",
    },
    {
      key: "12",
      title: "4K Ultra HD TV",
      banner: "/placeholder.png",
      startDate: "2023-10-10",
      endDate: "2023-10-30",
      status: "Active",
      featured: false,
      pageLink: "/4k-ultra-hd-tv",
    },
  ]);

  const handleStatusChange = (key: string, checked: boolean) => {
    const updatedDeals = deals.map((deal) =>
      deal.key === key ? { ...deal, status: checked ? "Active" : "Expired" } : deal
    );
    setDeals(updatedDeals);
    message.success(`Status updated to ${checked ? "Active" : "Expired"}`);
  };

  const handleFeaturedChange = (key: string, checked: boolean) => {
    const updatedDeals = deals.map((deal) =>
      deal.key === key ? { ...deal, featured: checked } : deal
    );
    setDeals(updatedDeals);
    message.success(`Featured status updated to ${checked ? "Yes" : "No"}`);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      sorter: (a: any, b: any) => a.key - b.key,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a: any, b: any) => a.title.localeCompare(b.title),
    },
    {
      title: "Banner",
      dataIndex: "banner",
      key: "banner",
      render: (banner: string) => <Image src={banner} alt="Banner" width={100} />,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Switch
          checked={status === "Active"}
          onChange={(checked) => handleStatusChange(record.key, checked)}
          checkedChildren="Active"
          unCheckedChildren="Expired"
        />
      ),
    },
    {
      title: "Featured",
      dataIndex: "featured",
      key: "featured",
      render: (featured: boolean, record: any) => (
        <Switch
          checked={featured}
          onChange={(checked) => handleFeaturedChange(record.key, checked)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: "Page Link",
      dataIndex: "pageLink",
      key: "pageLink",
      render: (pageLink: string) => (
        <Button type="link" href={pageLink} target="_blank">
          View Deal
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FireOutlined className="text-red-500 mr-2" />
        Flash Deals
      </h1>

      <Table
        columns={columns}
        dataSource={deals}
        bordered
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FlashDealsPage;
