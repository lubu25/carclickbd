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
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/en";

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  status: "in stock" | "low stock" | "out of stock";
  lastUpdated: string;
  location: string;
}

const StockPage = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // 'in stock', 'low stock', 'out of stock'
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const [form] = Form.useForm();

  // Mock Data (Replace with actual API calls)
  const generateMockData = (): StockItem[] => {
    const today = dayjs();
    const data: StockItem[] = [
      {
        id: "1",
        productName: "T-Shirt",
        sku: "TSHIRT-001",
        category: "Clothing",
        quantity: 100,
        unit: "pieces",
        status: "in stock",
        lastUpdated: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse A",
      },
      {
        id: "2",
        productName: "Jeans",
        sku: "JEANS-002",
        category: "Clothing",
        quantity: 25,
        unit: "pieces",
        status: "low stock",
        lastUpdated: today.subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse A",
      },
      {
        id: "3",
        productName: "Laptop",
        sku: "LAPTOP-001",
        category: "Electronics",
        quantity: 5,
        unit: "pieces",
        status: "out of stock",
        lastUpdated: today.subtract(10, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse B",
      },
      {
        id: "4",
        productName: "Mouse",
        sku: "MOUSE-001",
        category: "Electronics",
        quantity: 50,
        unit: "pieces",
        status: "in stock",
        lastUpdated: today.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse B",
      },
      {
        id: "5",
        productName: "Coffee Maker",
        sku: "COFFEE-001",
        category: "Appliances",
        quantity: 12,
        unit: "pieces",
        status: "low stock",
        lastUpdated: today.subtract(5, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse C",
      },
      {
        id: "6",
        productName: "Office Chair",
        sku: "CHAIR-001",
        category: "Furniture",
        quantity: 200,
        unit: "pieces",
        status: "in stock",
        lastUpdated: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse C",
      },
      {
        id: "7",
        productName: "Smartphone",
        sku: "PHONE-001",
        category: "Electronics",
        quantity: 8,
        unit: "pieces",
        status: "low stock",
        lastUpdated: today.subtract(4, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse A",
      },
      {
        id: "8",
        productName: "Dining Table",
        sku: "TABLE-001",
        category: "Furniture",
        quantity: 30,
        unit: "pieces",
        status: "in stock",
        lastUpdated: today.subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
        location: "Warehouse B",
      },
    ];
    return data;
  };

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const data = generateMockData();
      setStockData(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAddStock = (newItem: Omit<StockItem, "id" | "lastUpdated">) => {
    const newStockItem: StockItem = {
      id: String(Date.now()), // Generate a unique ID
      ...newItem,
      lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    setStockData((prevStockData) => [...prevStockData, newStockItem]);
    message.success("Stock item added successfully");
  };

  const handleEditStock = (item: StockItem) => {
    setEditItem(item);
    form.setFieldsValue({
      productName: item.productName,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      status: item.status,
      location: item.location,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStock = async () => {
    try {
      const values = await form.validateFields();
      if (!editItem) return;

      const updatedItem: StockItem = {
        ...editItem,
        productName: values.productName,
        sku: values.sku,
        category: values.category,
        quantity: values.quantity,
        unit: values.unit,
        status: values.status,
        lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"), // Update lastUpdated
        location: values.location,
      };

      setStockData((prevStockData) =>
        prevStockData.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      setIsEditModalOpen(false);
      form.resetFields();
      message.success("Stock item updated successfully");
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleDeleteStock = (id: string) => {
    setStockData((prevStockData) =>
      prevStockData.filter((item) => item.id !== id)
    );
    message.success("Stock item deleted successfully");
  };

  const getStatusTag = (status: StockItem["status"]) => {
    switch (status) {
      case "in stock":
        return <Tag color="green">In Stock</Tag>;
      case "low stock":
        return <Tag color="yellow">Low Stock</Tag>;
      case "out of stock":
        return <Tag color="red">Out of Stock</Tag>;
      default:
        return null;
    }
  };

  // Filter and Search
  const filteredStockData = stockData.filter((item) => {
    const searchTextMatch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = !statusFilter || item.status === statusFilter;
    const categoryMatch = !categoryFilter || item.category === categoryFilter;
    const locationMatch = !locationFilter || item.location === locationFilter;

    return searchTextMatch && statusMatch && categoryMatch && locationMatch;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setCategoryFilter(null);
    setLocationFilter(null);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields(); // Reset form fields when modal is closed
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newItem: Omit<StockItem, "id" | "lastUpdated"> = {
        productName: values.productName,
        sku: values.sku,
        category: values.category,
        quantity: values.quantity,
        unit: values.unit,
        status: values.status,
        location: values.location,
      };
      handleAddStock(newItem);
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
  const categories = Array.from(
    new Set(stockData.map((item) => item.category))
  );
  const locations = Array.from(new Set(stockData.map((item) => item.location)));
  const statuses = Array.from(new Set(stockData.map((item) => item.status)));

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text: string) => (
        <Typography.Text className="font-medium">{text}</Typography.Text>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (value: number, record: StockItem) => {
        let color = "";
        if (record.status === "out of stock") {
          color = "red";
        } else if (record.status === "low stock") {
          color = "orange";
        } else {
          color = "green";
        }
        return (
          <Typography.Text style={{ color }}>
            {value} {record.unit}
          </Typography.Text>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: StockItem["status"]) => getStatusTag(status),
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (text: string) => dayjs(text).format("MMM DD,롭슨 HH:mm:ss"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: StockItem) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStock(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Stock"
            description="Are you sure you want to delete this item from stock?"
            onConfirm={() => handleDeleteStock(record.id)}
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
      <Card className="mb-6 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-wrap gap-4 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Stock Management
            </h1>
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="Search stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto"
              prefix={<SearchOutlined />}
            />
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
          </div>
          <div className="flex gap-3 ">
            <Select
              placeholder="Filter by Status"
              value={statusFilter || undefined}
              onChange={(value) => setStatusFilter(value || null)}
              className="w-full sm:w-auto"
            >
              {statuses.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Category"
              value={categoryFilter || undefined}
              onChange={(value) => setCategoryFilter(value || null)}
              className="w-full sm:w-auto"
            >
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={clearFilters}
              className="w-full sm:w-auto"
              icon={<FilterOutlined />}
            >
              Clear Filters
            </Button>
            <Button
              type="primary"
              onClick={showAddModal}
              icon={<PlusOutlined />}
            >
              Add Stock
            </Button>
          </div>
        </div>
      </Card>

      <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <Table
            dataSource={filteredStockData}
            columns={columns}
            rowKey="id"
            className="dark:text-gray-300"
            scroll={{ x: true }}
          />
        )}
      </Card>

      <Modal
        title="Add New Stock Item"
        open={isAddModalOpen}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
      >
        <Form form={form} layout="vertical" name="add_stock_form">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Please enter SKU" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              <Select.Option value="Clothing">Clothing</Select.Option>
              <Select.Option value="Electronics">Electronics</Select.Option>
              <Select.Option value="Appliances">Appliances</Select.Option>
              <Select.Option value="Furniture">Furniture</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Please select unit" }]}
          >
            <Select>
              <Select.Option value="pieces">Pieces</Select.Option>
              <Select.Option value="kg">KG</Select.Option>
              <Select.Option value="grams">Grams</Select.Option>
              <Select.Option value="liters">Liters</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="in stock">In Stock</Select.Option>
              <Select.Option value="low stock">Low Stock</Select.Option>
              <Select.Option value="out of stock">Out of Stock</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select location" }]}
          >
            <Select>
              <Select.Option value="Warehouse A">Warehouse A</Select.Option>
              <Select.Option value="Warehouse B">Warehouse B</Select.Option>
              <Select.Option value="Warehouse C">Warehouse C</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Stock Item"
        open={isEditModalOpen}
        onOk={handleUpdateStock}
        onCancel={handleEditModalCancel}
      >
        <Form form={form} layout="vertical" name="edit_stock_form">
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "Please enter SKU" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              <Select.Option value="Clothing">Clothing</Select.Option>
              <Select.Option value="Electronics">Electronics</Select.Option>
              <Select.Option value="Appliances">Appliances</Select.Option>
              <Select.Option value="Furniture">Furniture</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Please select unit" }]}
          >
            <Select>
              <Select.Option value="pieces">Pieces</Select.Option>
              <Select.Option value="kg">KG</Select.Option>
              <Select.Option value="grams">Grams</Select.Option>
              <Select.Option value="liters">Liters</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="in stock">In Stock</Select.Option>
              <Select.Option value="low stock">Low Stock</Select.Option>
              <Select.Option value="out of stock">Out of Stock</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please select location" }]}
          >
            <Select>
              <Select.Option value="Warehouse A">Warehouse A</Select.Option>
              <Select.Option value="Warehouse B">Warehouse B</Select.Option>
              <Select.Option value="Warehouse C">Warehouse C</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockPage;
