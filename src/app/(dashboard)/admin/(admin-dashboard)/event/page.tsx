"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Space,
  Button,
  Tag,
  Typography,
  Input,
  Select,
  Modal,
  Form,
  Switch,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en";

interface EventItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  location: string;
}

const EventPage = () => {
  const [eventData, setEventData] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [form] = Form.useForm();

  // Mock Data (Replace with actual API calls)
  const generateMockData = (): EventItem[] => {
    const today = dayjs();
    const data: EventItem[] = [
      {
        id: "1",
        title: "Tech Conference 2024",
        description: "The largest tech conference of the year.",
        startDate: today.add(1, "month").format("YYYY-MM-DD"),
        endDate: today.add(1, "month").add(3, "days").format("YYYY-MM-DD"),
        isActive: true,
        location: "New York, NY",
      },
      {
        id: "2",
        title: "Marketing Summit",
        description: "Learn the latest marketing strategies.",
        startDate: today.add(2, "weeks").format("YYYY-MM-DD"),
        endDate: today.add(2, "weeks").add(2, "days").format("YYYY-MM-DD"),
        isActive: true,
        location: "Chicago, IL",
      },
      {
        id: "3",
        title: "Design Workshop",
        description: "Hands-on workshop for UI/UX designers.",
        startDate: today.subtract(1, "week").format("YYYY-MM-DD"),
        endDate: today.subtract(1, "week").add(2, "days").format("YYYY-MM-DD"),
        isActive: false,
        location: "Los Angeles, CA",
      },
      {
        id: "4",
        title: "Startup Pitch Competition",
        description: "Watch innovative startups pitch their ideas.",
        startDate: today.add(3, "months").format("YYYY-MM-DD"),
        endDate: today.add(3, "months").add(1, "day").format("YYYY-MM-DD"),
        isActive: true,
        location: "San Francisco, CA",
      },
      {
        id: "5",
        title: "Annual Film Festival",
        description: "Celebrating the best films of the year.",
        startDate: today.subtract(2, "months").format("YYYY-MM-DD"),
        endDate: today
          .subtract(2, "months")
          .add(7, "days")
          .format("YYYY-MM-DD"),
        isActive: false,
        location: "New York, NY",
      },
      {
        id: "6",
        title: "Food and Wine Festival",
        description: "A culinary experience for food lovers.",
        startDate: today.add(1, "month").add(1, "week").format("YYYY-MM-DD"),
        endDate: today
          .add(1, "month")
          .add(1, "week")
          .add(3, "days")
          .format("YYYY-MM-DD"),
        isActive: true,
        location: "Chicago, IL",
      },
    ];
    return data;
  };

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const data = generateMockData();
      setEventData(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAddEvent = (newEvent: Omit<EventItem, "id">) => {
    const newEventItem: EventItem = {
      id: String(Date.now()),
      ...newEvent,
    };
    setEventData((prevEventData) => [...prevEventData, newEventItem]);
    message.success("Event added successfully");
  };

  const handleEditEvent = (item: EventItem) => {
    setEditItem(item);
    form.setFieldsValue({
      title: item.title,
      description: item.description,
      startDate: dayjs(item.startDate),
      endDate: dayjs(item.endDate),
      isActive: item.isActive,
      location: item.location,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const values = await form.validateFields();
      if (!editItem) return;

      const updatedItem: EventItem = {
        ...editItem,
        title: values.title,
        description: values.description,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        isActive: values.isActive,
        location: values.location,
      };

      setEventData((prevEventData) =>
        prevEventData.map((event) =>
          event.id === updatedItem.id ? updatedItem : event
        )
      );
      setIsEditModalOpen(false);
      form.resetFields();
      message.success("Event updated successfully");
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEventData((prevEventData) =>
      prevEventData.filter((event) => event.id !== id)
    );
    message.success("Event deleted successfully");
  };

  const getIsActiveTag = (isActive: boolean) => {
    return isActive ? (
      <Tag color="green">Active</Tag>
    ) : (
      <Tag color="red">Inactive</Tag>
    );
  };

  // Filter and Search
  const filteredEventData = eventData.filter((event) => {
    const searchTextMatch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const isActiveMatch =
      isActiveFilter === null || event.isActive === isActiveFilter;
    const locationMatch = !locationFilter || event.location === locationFilter;

    return searchTextMatch && isActiveMatch && locationMatch;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setIsActiveFilter(null);
    setLocationFilter(null);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newEvent: Omit<EventItem, "id"> = {
        title: values.title,
        description: values.description,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        isActive: values.isActive,
        location: values.location,
      };
      handleAddEvent(newEvent);
      setIsAddModalOpen(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
    setEditItem(null);
  };

  // Get unique values for filters
  const locations = Array.from(new Set(eventData.map((item) => item.location)));

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Typography.Text className="font-medium">{text}</Typography.Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text: string) => (
        <>
          <CalendarOutlined style={{ marginRight: 4, fontSize: "0.8em" }} />
          {dayjs(text).format("MMM DD, YYYY")}
        </>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text: string) => (
        <>
          <CalendarOutlined style={{ marginRight: 4, fontSize: "0.8em" }} />
          {dayjs(text).format("MMM DD, YYYY")}
        </>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => getIsActiveTag(isActive),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: EventItem) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditEvent(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Event"
            description="Are you sure you want to delete this event?"
            onConfirm={() => handleDeleteEvent(record.id)}
            okButtonProps={{ icon: <CheckCircleOutlined /> }}
            cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Event Management
      </h1>

      <Card className="mb-6 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-wrap gap-4 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <Button type="primary" onClick={showAddModal} icon={<PlusOutlined />}>
            Create Event
          </Button>
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="Filter by Status"
            value={isActiveFilter === null ? undefined : isActiveFilter}
            onChange={(value) =>
              setIsActiveFilter(value === undefined ? null : value)
            }
            className="w-full sm:w-auto"
          >
            <Select.Option value={true}>Active</Select.Option>
            <Select.Option value={false}>Inactive</Select.Option>
          </Select>
          <Select
            placeholder="Filter by Location"
            value={locationFilter || undefined}
            onChange={(value) => setLocationFilter(value || null)}
            className="w-full sm:w-auto"
          >
            {locations.map((location) => (
              <Select.Option key={location} value={location}>
                {location}
              </Select.Option>
            ))}
          </Select>
          <Button
            onClick={clearFilters}
            className="w-full sm:w-auto"
            icon={<FilterOutlined />}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <Table
            dataSource={filteredEventData}
            columns={columns}
            rowKey="id"
            className="dark:text-gray-300"
            scroll={{ x: true }}
          />
        )}
      </Card>

      <Modal
        title="Create New Event"
        open={isAddModalOpen}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
      >
        <Form form={form} layout="vertical" name="add_event_form">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter event title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter event description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
            initialValue={true} // Set default value
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select location" }]}
          >
            <Select>
              <Select.Option value="New York, NY">New York, NY</Select.Option>
              <Select.Option value="Chicago, IL">Chicago, IL</Select.Option>
              <Select.Option value="Los Angeles, CA">
                Los Angeles, CA
              </Select.Option>
              <Select.Option value="San Francisco, CA">
                San Francisco, CA
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Event"
        open={isEditModalOpen}
        onOk={handleUpdateEvent}
        onCancel={handleEditModalCancel}
      >
        <Form form={form} layout="vertical" name="edit_event_form">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter event title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter event description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select location" }]}
          >
            <Select>
              <Select.Option value="New York, NY">New York, NY</Select.Option>
              <Select.Option value="Chicago, IL">Chicago, IL</Select.Option>
              <Select.Option value="Los Angeles, CA">
                Los Angeles, CA
              </Select.Option>
              <Select.Option value="San Francisco, CA">
                San Francisco, CA
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventPage;
