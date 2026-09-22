import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
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
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  CommentOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  StarFilled,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import {
  useDeleteProductMutation,
  useToggleProducrtStatusMutation,
  useToggleProductFeaturedMutation,
  useUpdateProductStatusMutation,
} from "@/Redux/api/productApi";
import { IProduct, ProductListingStatus } from "@/Interface/product";
import {
  getProductStatusMeta,
  productStatusMeta,
  productStatuses,
} from "@/utils/productStatus";
import StatsCard from "./StatsCard";
import ProductDetailsModal from "../Modal/ProductDetailsModal";
import ProductCommentModal from "../Modal/ProductCommentModal";
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

const formatPrice = (value?: number | string) => {
  const amount = Number(value || 0);
  return amount ? `BDT ${amount.toLocaleString()}` : "Contact for price";
};

const formatMileage = (value?: number | string) => {
  const mileage = Number(value || 0);
  return mileage ? `${mileage.toLocaleString()} km` : "N/A";
};

const formatViews = (value?: number | string) => {
  const views = Number(value || 0);
  return Number.isFinite(views) ? views.toLocaleString("en-US") : "0";
};

const getLocation = (product: IProduct) =>
  [product.location?.city, product.location?.zipCode].filter(Boolean).join(", ");

const getSellerInfo = (product: IProduct) => {
  const seller = product.seller;
  if (!seller || typeof seller === "string") {
    return {
      name: "N/A",
      company: "N/A",
    };
  }

  return {
    name: seller.name || seller.email || "N/A",
    company: seller.businessName || "N/A",
  };
};

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  loading,
  pagination,
  onChange,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();
  const [toggleProductStatus] = useToggleProducrtStatusMutation();
  const [toggleProductFeatured] = useToggleProductFeaturedMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const isAdminProductTable = pathname.startsWith("/admin");

  const filteredProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return products || [];

    return (products || []).filter((product) => {
      const searchable = [
        product.title,
        product.make,
        product.model,
        product.launchingYear,
        product.mainPrice,
        product.mileage,
        product.transmission,
        product.bodyStyle,
        product.engine,
        product.stockNumber,
        product.referenceNumber,
        getSellerInfo(product).name,
        getSellerInfo(product).company,
        getLocation(product),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [products, searchText]);

  const stats = useMemo(() => {
    const list = products || [];
    return {
      total: list.length,
      active: list.filter((product) => !product.isDraft).length,
      featured: list.filter((product) => product.isFeatured).length,
      pending: list.filter((product) => getProductStatusMeta(product).label === "Pending").length,
    };
  }, [products]);

  const handleToggleStatus = async (product: IProduct) => {
    if (!product._id) {
      message.error("Invalid product ID");
      return;
    }

    try {
      await toggleProductStatus({ id: product._id }).unwrap();
      message.success(
        `Product ${product.isDraft ? "published" : "unpublished"} successfully`
      );
    } catch (error) {
      message.error("Failed to update product status");
    }
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

  const handleToggleFeatured = async (product: IProduct) => {
    if (!product._id) {
      message.error("Invalid product ID");
      return;
    }

    try {
      await toggleProductFeatured({ id: product._id }).unwrap();
      message.success(
        `Product ${product.isFeatured ? "unfeatured" : "featured"} successfully`
      );
    } catch (error) {
      message.error("Failed to update featured status");
    }
  };

  const viewProduct = (record: IProduct) => {
    setSelectedProduct(record);
    setIsDetailsModalVisible(true);
  };

  const editProduct = (record: IProduct) => {
    const basePath = pathname.startsWith("/seller")
      ? "/seller/my-product/edit"
      : "/admin/product/edit";
    router.push(`${basePath}/${record._id}`);
  };

  const viewProductComments = (record: IProduct) => {
    setModalTitle(`Comments for ${record.title}`);
    setModalContent(<ProductCommentModal productId={record._id} />);
    setIsModalVisible(true);
  };

  const deleteProductHandler = (record: IProduct) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: `Product: ${record.title}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        const hideLoadingMessage = message.loading("Deleting product...", 0);

        try {
          const res = await deleteProduct(record._id).unwrap();

          if (res?.success || res?.status === "success") {
            message.success("Product deleted successfully");
          } else {
            message.error(res?.message || "Failed to delete the product");
          }
        } catch (error: any) {
          message.error(`Error: ${error.message}`);
        } finally {
          hideLoadingMessage();
        }
      },
      onCancel() {
        message.info("Deletion canceled");
      },
    });
  };

  const columns: ColumnsType<IProduct> = [
    {
      title: "Vehicle",
      key: "vehicle",
      fixed: "left",
      width: 280,
      render: (_, record) => (
        <Space>
          <Avatar
            shape="square"
            size={48}
            src={getMediaUrl(record.photos?.mainPhoto)}
            alt={record.title}
          />
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => viewProduct(record)}
              className="block max-w-[190px] truncate text-left font-semibold text-slate-900 hover:text-blue-600"
            >
              {record.title || "Untitled vehicle"}
            </button>
            <p className="mt-0.5 text-xs text-slate-500">
              {[record.make, record.model].filter(Boolean).join(" ") || "Maker N/A"}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold text-blue-600">
              Ref: {record.stockNumber || record.referenceNumber || record._id?.slice(-8)?.toUpperCase()}
            </p>
          </div>
        </Space>
      ),
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Production Year",
      key: "productionYear",
      width: 90,
      responsive: ["sm"],
      render: (_, record) => record.productionYear || record.launchingYear || "N/A",
      sorter: (a, b) =>
        Number(a.productionYear || a.launchingYear || 0) -
        Number(b.productionYear || b.launchingYear || 0),
    },
    {
      title: "Price",
      dataIndex: "mainPrice",
      key: "mainPrice",
      width: 150,
      render: (mainPrice) => (
        <span className="font-semibold text-slate-900">{formatPrice(mainPrice)}</span>
      ),
      sorter: (a, b) => Number(a.mainPrice || 0) - Number(b.mainPrice || 0),
    },
    {
      title: "Mileage",
      dataIndex: "mileage",
      key: "mileage",
      width: 130,
      responsive: ["md"],
      render: (mileage) => formatMileage(mileage),
      sorter: (a, b) => Number(a.mileage || 0) - Number(b.mileage || 0),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      width: 100,
      responsive: ["md"],
      render: (views) => (
        <span className="font-semibold text-slate-900">{formatViews(views)}</span>
      ),
      sorter: (a, b) => Number(a.views || 0) - Number(b.views || 0),
    },
    {
      title: "Seller Name",
      key: "sellerName",
      width: 170,
      responsive: ["lg"],
      render: (_, record) => (
        <span className="font-semibold text-slate-900">
          {getSellerInfo(record).name}
        </span>
      ),
      sorter: (a, b) =>
        getSellerInfo(a).name.localeCompare(getSellerInfo(b).name),
    },
    {
      title: "Company",
      key: "sellerCompany",
      width: 180,
      responsive: ["lg"],
      render: (_, record) => (
        <span className="font-medium text-slate-700">
          {getSellerInfo(record).company}
        </span>
      ),
      sorter: (a, b) =>
        getSellerInfo(a).company.localeCompare(getSellerInfo(b).company),
    },
    {
      title: "Location",
      key: "location",
      width: 170,
      responsive: ["lg"],
      render: (_, record) => getLocation(record) || "N/A",
    },
    ...(isAdminProductTable
      ? [
          {
            title: "Admin Note",
            key: "adminNote",
            width: 220,
            responsive: ["xl"] as ColumnsType<IProduct>[number]["responsive"],
            render: (_: unknown, record: IProduct) => {
              const note = record.internalNote || record.adminNote;
              if (!note) return <span className="text-slate-400">N/A</span>;

              return (
                <Tooltip title={note}>
                  <p className="line-clamp-2 max-w-[210px] text-xs font-medium leading-5 text-slate-600">
                    {note}
                  </p>
                </Tooltip>
              );
            },
          },
        ]
      : []),
    {
      title: "Status",
      key: "status",
      width: 120,
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
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      responsive: ["md"],
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format("MMM D, YYYY") : "N/A",
      sorter: (a, b) =>
        dayjs(a.createdAt || 0).valueOf() - dayjs(b.createdAt || 0).valueOf(),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 90,
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => viewProduct(record)}>
              View details
            </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => editProduct(record)}>
              Edit
            </Menu.Item>
            <Menu.Item key="toggle-status">
              <Popconfirm
                title={`Are you sure you want to ${record.isDraft ? "approve and publish" : "unpublish"} this product?`}
                onConfirm={() => handleToggleStatus(record)}
                okText="Yes"
                cancelText="No"
              >
                <div className="flex items-center">
                  {record.isDraft ? (
                    <UploadOutlined className="mr-2 text-green-500" />
                  ) : (
                    <CloudDownloadOutlined className="mr-2 text-gray-500" />
                  )}
                  {record.isDraft ? "Approve & Publish" : "Unpublish"}
                </div>
              </Popconfirm>
            </Menu.Item>
            <Menu.SubMenu key="set-status" title="Set Status">
              {productStatuses.map((status) => (
                <Menu.Item
                  key={`status-${status}`}
                  onClick={() => handleSetStatus(record, status)}
                >
                  {productStatusMeta[status].label}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
            <Menu.Item key="toggle-featured">
              <Popconfirm
                title={`Are you sure you want to ${record.isFeatured ? "unfeature" : "feature"} this product?`}
                onConfirm={() => handleToggleFeatured(record)}
                okText="Yes"
                cancelText="No"
              >
                <div className="flex items-center">
                  {record.isFeatured ? (
                    <StarFilled className="mr-2 text-yellow-500" />
                  ) : (
                    <StarOutlined className="mr-2 text-gray-500" />
                  )}
                  {record.isFeatured ? "Unfeature" : "Feature"}
                </div>
              </Popconfirm>
            </Menu.Item>
            <Menu.Item
              key="comments"
              icon={<CommentOutlined />}
              onClick={() => viewProductComments(record)}
            >
              Comments
            </Menu.Item>
            {isAdminProductTable && (
              <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                danger
                onClick={() => deleteProductHandler(record)}
              >
                Delete
              </Menu.Item>
            )}
          </Menu>
        );

        return (
          <Tooltip title="Manage product">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button type="text" icon={<EllipsisOutlined />} />
            </Dropdown>
          </Tooltip>
        );
      },
    },
  ];

  const closeModal = () => {
    setIsModalVisible(false);
    setModalContent(null);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              Product Listings
            </h1>
            <p className="text-sm text-slate-500">
              Manage vehicles, pricing, availability, and listing quality.
            </p>
          </div>
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search by title, maker, model, price, year, location"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 text-base"
            />
          </div>
        </div>
      </Card>

      <Row gutter={16}>
        <Col span={6} xs={12} md={8} lg={6} className="mb-4">
          <StatsCard
            title="Total Listings"
            value={stats.total}
            icon={<ShoppingCartOutlined />}
            bgColor="bg-white"
            textColor="text-green-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Live Listings"
            value={stats.active}
            icon={<CheckCircleOutlined />}
            bgColor="bg-white"
            textColor="text-blue-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Featured"
            value={stats.featured}
            icon={<StarFilled />}
            bgColor="bg-white"
            textColor="text-yellow-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6}>
          <StatsCard
            title="Pending Approval"
            value={stats.pending}
            icon={<CloseCircleOutlined />}
            bgColor="bg-white"
            textColor="text-red-500"
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
        onChange={onChange}
        scroll={{ x: 1420 }}
      />

      <ProductDetailsModal
        visible={isDetailsModalVisible}
        onClose={() => setIsDetailsModalVisible(false)}
        product={selectedProduct}
      />

      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default ProductTable;
