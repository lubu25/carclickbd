"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import { IProduct } from "@/Interface/product";
import ProductFormStep from "./ProductFormStep";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";
import {
  productBodyStyleForCreateProduct,
  productTitleStatus,
} from "@/content/product.constant";
import {
  getFromLocalStorage,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import { productFormStepValueKeys } from "../../product.storage-key";
import { useGetAllCategoriesQuery } from "@/Redux/api/categoryApi";

const { Option } = Select;

const ProductDetailForm = () => {
  const [form] = Form.useForm();
  const currentStep = useAppSelector(
    (state) => state.productReducer.setFormStep
  );
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const { data: response } = useGetAllCategoriesQuery({});
  const dispatch = useAppDispatch();

  const next = () => {
    dispatch(setProductFormStep(currentStep + 1));
  };

  const onFinish = (values: IProduct) => {
    console.log("Submitted Values:", values);
    next();
  };

  useEffect(() => {
    const savedValues = getFromLocalStorage(productFormStepValueKeys.stepOne);
    if (savedValues) {
      form.setFieldsValue(JSON.parse(savedValues));
    }
  }, [form]);

  const onValuesChange = (changedValues: any, allValues: IProduct) => {
    setToLocalStorageAsStringify(productFormStepValueKeys.stepOne, allValues);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const categories = response?.data || [];
  const mainCategory = categories.filter((cat: any) => !cat.parentCategory);
  const subCategory = categories.filter((cat: any) => cat.parentCategory);
  const handleMainCategoryChange = (selectedCategoryId: string) => {
    console.log("Selected Category", selectedCategoryId);

    const subcategories = subCategory.filter(
      (cat: any) => cat.parentCategory.id === selectedCategoryId
    );
    setSubcategories(subcategories);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
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
        <Form.Item
          name="mainCategory"
          label="Main Category"
          rules={[
            { required: false, message: "Please select a main category" },
          ]}
        >
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
      </div>

      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item
          className="w-full"
          name="make"
          label="Make"
          rules={[
            { required: false, message: "Please enter the make" },
            { min: 2, message: "Make must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter make" />
        </Form.Item>

        <Form.Item
          className="w-full"
          name="model"
          label="Model"
          rules={[
            { required: false, message: "Please enter the model" },
            { min: 2, message: "Model must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter model" />
        </Form.Item>
      </div>

      {/* product titleStatus and Vin */}
      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item
          className="w-full"
          name="titleStatus"
          label="Title Status"
          rules={[
            { required: false, message: "Please enter the title status" },
            { min: 3, message: "Model must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Ex: clean (CT), salvage, 'rebuilt/reconstructed, junk  " />
        </Form.Item>

        <Form.Item
          name="vin"
          label="VIN"
          className="w-full"
          rules={[
            { required: false, message: "Please enter the VIN" },
            {
              min: 5,
              message: "VIN must be at least 5 characters",
            },
          ]}
        >
          <Input placeholder="Enter VIN" />
        </Form.Item>
      </div>

      {/* product bodyStyle and lancing year */}
      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item
          className="w-full"
          name="bodyStyle"
          label="Body Style"
          rules={[
            { required: false, message: "Please enter the Body Style" },
            { min: 3, message: "Body Style must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter Body Style" />
        </Form.Item>
        <Form.Item
          name="launchingYear"
          label="Launching Year"
          rules={[
            { required: true, message: "Please select the  body status" },
          ]}
        >
          <Select placeholder="Select Launching Year">
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <ProductFormStep />
    </Form>
  );
};

export default ProductDetailForm;
