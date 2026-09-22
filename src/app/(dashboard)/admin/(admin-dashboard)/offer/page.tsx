"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  Switch,
  Popconfirm,
  Dropdown,
  Menu,
  message,
  Modal,
  Form,
  Input as AntInput,
  DatePicker,
  Card,
  Space,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import OfferModal from "@/components/Modal/OfferModal";

const { RangePicker } = DatePicker;

interface Offer {
  id: string;
  title: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  description: string;
}

const OfferPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockData();
      setOffers(data);
      setLoading(false);
    }, 500);
  }, []);

  const generateMockData = (): Offer[] => {
    const today = dayjs();
    return [
      {
        id: "1",
        title: "Summer Sale",
        code: "SUMMER20",
        discount: 20,
        startDate: today.subtract(1, "day").format("YYYY-MM-DD"),
        endDate: today.add(30, "days").format("YYYY-MM-DD"),
        status: "active",
        description: "Get 20% off on all items this summer!",
      },
      {
        id: "2",
        title: "New User Discount",
        code: "NEWUSER50",
        discount: 50,
        startDate: today.format("YYYY-MM-DD"),
        endDate: today.add(7, "days").format("YYYY-MM-DD"),
        status: "active",
        description: "50% off for new users only.",
      },
      {
        id: "3",
        title: "Winter Clearance",
        code: "WINTER10",
        discount: 10,
        startDate: today.subtract(15, "days").format("YYYY-MM-DD"),
        endDate: today.subtract(1, "day").format("YYYY-MM-DD"),
        status: "inactive",
        description: "Clearance sale on winter items.",
      },
      {
        id: "4",
        title: "Flash Sale",
        code: "FLASH24",
        discount: 25,
        startDate: today.format("YYYY-MM-DD"),
        endDate: today.add(2, "days").format("YYYY-MM-DD"),
        status: "active",
        description: "24 Hour Flash Sale - Don't Miss Out!",
      },
      {
        id: "5",
        title: "Back to School",
        code: "SCHOOL15",
        discount: 15,
        startDate: today.add(5, "days").format("YYYY-MM-DD"),
        endDate: today.add(35, "days").format("YYYY-MM-DD"),
        status: "inactive",
        description: "Get ready for school with 15% off on all stationery.",
      },
    ];
  };

  const handleAddOffer = () => {
    setIsEditMode(false);
    setCurrentOffer(null);
    setIsModalVisible(true);
  };

  const handleEditOffer = (id: string) => {
    const offer = offers.find((offer) => offer.id === id);
    if (offer) {
      setIsEditMode(true);
      setCurrentOffer(offer);
      setIsModalVisible(true);
    }
  };

  const handleDeleteOffer = (id: string) => {
    setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== id));
    message.success("Offer deleted successfully");
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === id
          ? { ...offer, status: checked ? "active" : "inactive" }
          : offer
      )
    );
    message.success(
      `Offer ${checked ? "activated" : "deactivated"} successfully`
    );
  };

  const handleSaveOffer = (values: Offer) => {
    if (isEditMode && currentOffer) {
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === currentOffer.id ? { ...offer, ...values } : offer
        )
      );
      message.success("Offer updated successfully");
    } else {
      const newOffer: Offer = {
        ...values,
        id: `${offers.length + 1}`,
        status: "active",
      };
      setOffers((prevOffers) => [...prevOffers, newOffer]);
      message.success("Offer added successfully");
    }
    setIsModalVisible(false);
  };

  const filteredOffers = offers.filter((offer) => {
    const searchTextMatch =
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    return searchTextMatch;
  });

  interface ColumnRecord {
    id: string;
    title: string;
    code: string;
    discount: number;
    startDate: string;
    endDate: string;
    status: string;
    description: string;
  }

  const columns: Array<{
    title: string;
    dataIndex?: keyof ColumnRecord;
    key: string;
    render?: (value: any, record?: ColumnRecord) => React.ReactNode;
  }> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (value: number) => `${value}%`,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => dayjs(text).format("MMM DD, YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => dayjs(text).format("MMM DD, YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },

    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          record ? (
            <Space size="small">
             <Switch
                checked={record.status === "active"}
                onChange={(checked) => handleStatusChange(record.id, checked)}
                size="small"
              />
              <Tooltip title="Edit">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditOffer(record.id)}
                   size="small"
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure to delete this offer?"
                onConfirm={() => handleDeleteOffer(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    style={{ color: "red" }}
                     size="small"
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          ) : null
        ),
      },
 
  ];

  return (
    <div>
      <div >
        <Card>
          <div className="flex justify-between items-center mb-4 pt-3">
            <Input
              placeholder="Search offers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddOffer}
              style={{ marginLeft: 16 }}
            >
              Add Offer
            </Button>
          </div>
        </Card>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOffers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
      <OfferModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSaveOffer}
        isEditMode={isEditMode}
        currentOffer={currentOffer}
        onFinish={() => {}}
        form={Form.useForm()[0]}
      />
    </div>
  );
};

export default OfferPage;
