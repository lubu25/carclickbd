"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Row,
  Col,
  Tooltip,
  message,
  Input,
  Select,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";
import { useCreateProductMutation } from "@/Redux/api/productApi";
import { useGetAllCategoriesQuery } from "@/Redux/api/categoryApi";
import ProductFormStep from "./ProductFormStep";
import {
  getFromLocalStorageAsParse,
  removeFromLocalStorage,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import { base64ToFile } from "@/utils/file";
import { productFormStepValueKeys } from "../../product.storage-key";
import { IProduct } from "@/Interface/product";

const { Option } = Select;

// ---------- File Validation ----------
const FILE_LIMITS = {
  MAIN_PHOTO: 1,
  OTHER_PHOTOS: 40,
};

const validateFiles = (
  files: File[] | null,
  maxCount: number,
  fieldName: string
): boolean => {
  if (!files || files.length === 0) {
    message.error(`${fieldName} is required`);
    return false;
  }
  if (files.length > maxCount) {
    message.error(`Maximum ${maxCount} files are allowed for ${fieldName}`);
    return false;
  }
  return true;
};

// ---------- Component ----------
const ProductBiddingInfo = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [stepOneFormData, setStepOneFormData] = useState<IProduct | null>(null);
  const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null);
  const [otherPhotoFiles, setOtherPhotosFiles] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const { data: response } = useGetAllCategoriesQuery({});
  const categories = response?.data || [];

  const mainCategory = categories.filter((cat: any) => !cat.parentCategory);
  const subCategory = categories.filter((cat: any) => cat.parentCategory);

  const [createProduct, { isLoading }] = useCreateProductMutation();

  // ---------- Load Step One Data ----------
  useEffect(() => {
    try {
      const stepOne = getFromLocalStorageAsParse(
        productFormStepValueKeys.stepOne
      );
      if (!stepOne) {
        dispatch(setProductFormStep(0));
        return;
      }

      // Load main photo
      const mainPhoto = localStorage.getItem("mainPhoto");
      if (mainPhoto) {
        setMainPhotoFile(base64ToFile(mainPhoto, "mainProductImg"));
      }

      // Load other photos
      const otherPhotos = getFromLocalStorageAsParse("otherPhotos") || [];
      if (otherPhotos.length > 0) {
        const files = otherPhotos.map((url: string, index: number) =>
          base64ToFile(url, `othersproductphoto${index + 1}`)
        );
        setOtherPhotosFiles(files);
      }

      // Load video links
      const videos = getFromLocalStorageAsParse("videoLinks") || [];
      setVideoLinks(videos);

      setStepOneFormData(stepOne);
    } catch (error) {
      message.error("Failed to load form data");
      dispatch(setProductFormStep(0));
    }
  }, [dispatch]);

  // ---------- Subcategory Logic ----------
  const handleMainCategoryChange = (selectedCategoryId: string) => {
    const subs = subCategory.filter(
      (cat: any) => cat.parentCategory.id === selectedCategoryId
    );
    setSubcategories(subs);
  };

  // ---------- Save Step Two Values ----------
  const onValuesChange = (_: any, allValues: IProduct) => {
    setToLocalStorageAsStringify(
      productFormStepValueKeys.stepTwo,
      JSON.stringify(allValues)
    );
  };

  // ---------- Submit ----------
  const onFinish = async (values: IProduct) => {
    try {
      if (!validateFiles([mainPhotoFile!], FILE_LIMITS.MAIN_PHOTO, "Main Photo"))
        return;
      if (
        !validateFiles(otherPhotoFiles, FILE_LIMITS.OTHER_PHOTOS, "Other Photos")
      )
        return;

      const productData: IProduct = {
        ...values,
        ...stepOneFormData,
        videos: videoLinks,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(productData));
      if (mainPhotoFile) formData.append("mainPhoto", mainPhotoFile);
      otherPhotoFiles.forEach((file) => formData.append("others", file));

      const response = await createProduct(formData).unwrap();
      if (response?.statusCode === 201) {
        message.success("✅ Product created successfully");
        dispatch(setProductFormStep(0));

        [
          productFormStepValueKeys.stepOne,
          productFormStepValueKeys.stepTwo,
          "mainPhoto",
          "otherPhotos",
          "videoLinks",
        ].forEach((key) => removeFromLocalStorage(key));

        setMainPhotoFile(null);
        setOtherPhotosFiles([]);
        setVideoLinks([]);
        form.resetFields();
      }
    } catch (error: any) {
      console.error(error);
      message.error(error?.data?.message || "An unexpected error occurred");
    }
  };

  // ---------- UI ----------
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      className="bg-white p-4 rounded"
      disabled={isLoading}
    >
      <div className="md:grid grid-cols-4 items-center gap-5 w-full">
        <div className="col-span-2">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter the product title" },
              { min: 3, message: "Title must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter product title" />
          </Form.Item>
        </div>

        <Form.Item name="mainCategory" label="Main Category">
          <Select
            placeholder="Select Main Category"
            onChange={handleMainCategoryChange}
            allowClear
          >
            {mainCategory.map((category: any) => (
              <Option key={category.id} value={category.id}>
                {category.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {subcategories.length > 0 && (
          <Form.Item name="subCategory" label="Subcategory">
            <Select placeholder="Select Subcategory" allowClear>
              {subcategories.map((subcategory: any) => (
                <Option key={subcategory.id} value={subcategory.id}>
                  {subcategory.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </div>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: "Please enter the product description" },
          { min: 10, message: "Description must be at least 10 characters" },
        ]}
      >
        <Input placeholder="Enter product description" />
      </Form.Item>

      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item name="brand" label="Brand">
          <Input placeholder="Enter Brand" />
        </Form.Item>

        <Form.Item name="model" label="Model">
          <Input placeholder="Enter Model" />
        </Form.Item>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Form.Item
            name="price"
            label={
              <span>
                Price{" "}
                <Tooltip title="The starting bid amount for the product">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { required: true, message: "Please enter the minimum bid" },
              { type: "number", min: 0, message: "Must be greater than 0" },
            ]}
          >
            <InputNumber min={0} placeholder="Enter Price" className="w-full" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            name="offerPrice"
            label={
              <span>
                Offer Price{" "}
                <Tooltip title="Optional: Buy now price for direct purchase">
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
          >
            <InputNumber
              min={0}
              placeholder="Enter Offer Price"
              className="w-full"
            />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="highlights" label="Highlights">
            <Select mode="tags" placeholder="Add product highlights" />
          </Form.Item>
        </Col>
      </Row>

      <div className="mt-4">
        <ProductFormStep isLoading={isLoading} />
      </div>
    </Form>
  );
};

export default ProductBiddingInfo;
