import { EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Flex,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { MdOutlineDelete } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import {
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "@/Redux/api/productApi";
import { IProduct, ProductListingStatus } from "@/Interface/product";
import {
  getProductStatusMeta,
  productStatusMeta,
  productStatuses,
} from "@/utils/productStatus";
import { getMediaUrl } from "@/utils/media";

const { confirm } = Modal;

interface ProductTableProps {
  products: IProduct[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onChange: (pagination: any) => void;
}

const PastAuctionTable: React.FC<ProductTableProps> = ({
  products,
  loading: tableLoading,
  pagination,
  onChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchText, setSearchText] = useState("");
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const deleteProductHandler = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const deleteSelectedProducts = async () => {
    confirm({
      title: "Are you sure you want to delete selected products?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map((id) => deleteProduct(id).unwrap()));
          message.success("Selected products deleted successfully");
          setSelectedRowKeys([]);
        } catch (error) {
          message.error("Failed to delete selected products");
        }
      },
    });
  };

  const reloadSelection = () => {
    setBulkLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setBulkLoading(false);
    }, 1000);
  };

  const viewProduct = (record: IProduct) => {
    const basePath = pathname.startsWith("/seller")
      ? "/seller/my-product"
      : "/admin/product";
    router.push(`${basePath}/${record._id}`);
  };

  const editProduct = (record: IProduct) => {
    const basePath = pathname.startsWith("/seller")
      ? "/seller/my-product/edit"
      : "/admin/product/edit";
    router.push(`${basePath}/${record._id}`);
  };

  const handleSetStatus = async (
    product: IProduct,
    status: ProductListingStatus
  ) => {
    try {
      await updateProductStatus({
        id: product._id,
        status,
      }).unwrap();
      message.success(`Product status updated to ${productStatusMeta[status].label}`);
    } catch (error) {
      message.error("Failed to update product status");
    }
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "Title",
      key: "image_title",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (_, record) => (
        <Space>
          <Avatar
            shape="square"
            size={32}
            src={getMediaUrl(record.photos?.mainPhoto)}
            alt={record.title}
          />
          <span>{record.title || "No name"}</span>
        </Space>
      ),
      filterMode: "tree",
      filterSearch: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Price",
      dataIndex: "mainPrice",
      key: "mainPrice",
      sorter: (a, b) => Number(a.mainPrice || 0) - Number(b.mainPrice || 0),
      render: (mainPrice) => (
        <span>BDT {mainPrice ? Number(mainPrice).toLocaleString() : "0"}</span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md", "lg", "xl"],
      render: (createdAt) => (
        <span>{createdAt ? dayjs(createdAt).format("MMM D, YYYY") : "N/A"}</span>
      ),
      sorter: (a, b) => {
        const createdA = a?.createdAt;
        const createdB = b?.createdAt;
        return dayjs(createdA).isBefore(dayjs(createdB)) ? -1 : 1;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const meta = getProductStatusMeta(record);
        return (
          <Tag color={meta.tagColor} style={meta.badgeStyle}>
            {meta.label}
          </Tag>
        );
      },
      filters: productStatuses.map((status) => ({
        text: productStatusMeta[status].label,
        value: status,
      })),
      onFilter: (value, record) =>
        getProductStatusMeta(record).label ===
        productStatusMeta[value as ProductListingStatus].label,
    },
    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md", "lg", "xl"],
      render: (_, record) => {
        const statusMenu = (
          <Menu>
            {productStatuses.map((status) => (
              <Menu.Item
                key={`status-${status}`}
                onClick={() => handleSetStatus(record, status)}
              >
                {productStatusMeta[status].label}
              </Menu.Item>
            ))}
          </Menu>
        );

        return (
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown overlay={statusMenu} trigger={["click"]}>
            <Button size="small" className="!border-sky-200 !bg-sky-50 !font-semibold !text-sky-700">
              Set Status
            </Button>
          </Dropdown>
          <Button
            variant="filled"
            color="default"
            size="small"
            onClick={() => viewProduct(record)}
          >
            <Tooltip title="View product detail" color="gray">
              <IoEye className="cursor-pointer text-gray-500 transition-transform duration-200 ease-in-out hover:scale-110 hover:text-gray-800" />
            </Tooltip>
          </Button>

          <Button
            variant="filled"
            color="primary"
            size="small"
            onClick={() => editProduct(record)}
          >
            <Tooltip title="Edit product" color="blue">
              <EditOutlined />
            </Tooltip>
          </Button>

          <Popconfirm
            title="Delete product"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            description="Are you sure you want to delete this product?"
            onConfirm={() => record._id && deleteProductHandler(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button variant="filled" color="danger" size="small">
              <Tooltip title="Delete product" color="red">
                <MdOutlineDelete className="cursor-pointer text-red-600 transition-transform duration-200 ease-in-out hover:scale-110 hover:text-red-400" />
              </Tooltip>
            </Button>
          </Popconfirm>
        </div>
        );
      },
    },
  ];

  const filteredProducts = products?.filter(
    (product) =>
      product.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      product.mainPrice?.toString().includes(searchText)
  );

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-500">Product Listings</h1>
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="p-3 text-lg"
            />
          </div>
        </div>
      </Card>

      <Row>
        <Flex gap="middle" align="center">
          <Button
            type="primary"
            onClick={reloadSelection}
            disabled={!selectedRowKeys.length}
            loading={bulkLoading}
          >
            Reload
          </Button>
          <Button
            type="primary"
            danger
            onClick={deleteSelectedProducts}
            disabled={!selectedRowKeys.length}
          >
            Delete Selected
          </Button>
          {selectedRowKeys.length > 0
            ? `Selected ${selectedRowKeys.length} items`
            : null}
        </Flex>
      </Row>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={filteredProducts || []}
        rowKey="_id"
        loading={tableLoading || bulkLoading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
        onChange={onChange}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default PastAuctionTable;
