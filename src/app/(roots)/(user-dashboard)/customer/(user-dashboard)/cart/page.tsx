"use client";
import FormSelectField from "@/components/Field/FormSelectField";
import { IProduct } from "@/Interface/product";
import { useDeleteProductMutation, useUpdateProductMutation } from "@/Redux/api/productApi";
import { useGetAllProductBidsQuery } from "@/Redux/features/bids/bidsApi";



import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import { Button, Input, message } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

const ProductsPage = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<IProduct | {}>({});
  const [formValues, setFormValues] = useState<any>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;


  // Update the form values when the form fields change
  const onFormChange = (values: any) => {
    setFormValues(values);
  };

 


  const { data, isLoading } = useGetAllProductBidsQuery({ ...query });

  const products = data?.products;
  const meta = data?.meta;


  const deleteProductHandler = async () => {
    const productId = (product as IProduct)._id;
    message.loading("Deleting.....");
    try {
      const res = await deleteProduct(productId);

      if (res) {
        message.success("Product Deleted successfully");
        setOpen(false);
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const updateOnChange = async (id: string) => {
    setFormValues(id)
  }
  const onSubmit = async () => {
    const values = {
      'productStatus': formValues
    }
    const productId = (product as IProduct)._id;
    message.loading("Updating.....");
    try {
      const res = await updateProduct({ id: productId, body: values }).unwrap();
      if (res?.id) {
        message.success("Product successfully updated.");
        setUpdateOpen(false);
      }
    } catch (err: any) {
      console.error("Error updating product:", err.message);
      message.error(err.message);
    }
  };
  const columns = [
    {
      title: "Product Title",
      dataIndex: "productTitle",
      sorter: true,
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: function (data: any) {
        return data && dayjs(data).format("MMM D, YYYY hh:mm A");
      },
      sorter: true,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: function (data: any) {
        return data && dayjs(data).format("MMM D, YYYY hh:mm A");
      },
      sorter: true,
    },

    {
      title: "Product Status",
      dataIndex: "productStatus",
      sorter: true,
    },
    {
      render: function (data: any) {
        return (
          <>
            <Button
              onClick={() => {
                setUpdateOpen(true);
                setProduct(data);
              }}
              type="primary"
              danger
            >
              Update Status
            </Button>
          </>
        );
      },
    },
    {
      title: "Action",
      render: function (data: any) {
        return (
          <>
            <Link href={`/admin/product/${data?.id}`}>
              <Button
                style={{
                  margin: "0px 5px",
                }}
                type="primary"
              >
                <EyeOutlined />
              </Button>
            </Link>
            <Link href={`/admin/product/${data?.id}`}>
              <Button
                style={{
                  margin: "0px 5px",
                }}
                type="primary"
              >
                <EditOutlined />
              </Button>
            </Link>

            <Button
              onClick={() => {
                setOpen(true);
                setProduct(data);
              }}
              type="primary"
              danger
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    console.log("Page:", page, "PageSize:", pageSize);
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    // console.log(order, field);
    setSortBy(field as string);
    setSortOrder(order === "ascend" ? "asc" : "desc");
  };

  const resetFilters = () => {
    setSortBy("");
    setSortOrder("");
    setSearchTerm("");
  };

  const deleteSelectedInquiries = async () => {

    message.loading("Deleting.....");
    try {
      const res = await deleteProduct({ ids: selectedRowKeys });

      if (res) {
        message.success("Selected inquiries deleted successfully");
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <div>
      

      <>
        {selectedRowKeys.length ?
          <Button
            type="primary"
            danger
            onClick={deleteSelectedInquiries}
          >
            <DeleteOutlined />
            Delete Selected Inquiries
          </Button> : ""
        }
        <Input
          type="text"
          size="large"
          placeholder="Search..."
          style={{
            width: "20%",
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div>
          <Link href="/admin/product/create-product">
            <Button type="primary">Create</Button>
          </Link>
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button
              onClick={resetFilters}
              type="primary"
              style={{ margin: "0px 5px" }}
            >
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </>
    </div>
  );
};

export default ProductsPage;
