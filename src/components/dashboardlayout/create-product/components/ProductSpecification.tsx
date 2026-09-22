"use client";
import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { IProduct } from "@/Interface/product";

import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";

import {
  getFromLocalStorage,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import ProductFormStep from "./ProductFormStep";
import { productFormStepValueKeys } from "../../product.storage-key";
import {
  productDrivetrainOptions,
  productEngineTypesOptions,
  productExteriorColorOptions,
  productInteriorColorOptions,
  productMileageOptions,
  productTransmissionOptions,
} from "../content/content";

const { Option } = Select;

const ProductSpecification = () => {
  const [form] = Form.useForm();
  const currentStep = useAppSelector(
    (state) => state.productReducer.setFormStep
  );
  const dispatch = useAppDispatch();

  // Navigate to the next step
  const nextStep = () => {
    dispatch(setProductFormStep(currentStep + 1));
  };

  // Handle form submission
  const onFinish = (values: IProduct) => {
    console.log("Submitted Values:", values);
    nextStep();
  };

  // Load initial values from localStorage if they exist
  useEffect(() => {
    const savedValues = getFromLocalStorage(productFormStepValueKeys.stepThree);
    if (savedValues) {
      form.setFieldsValue(JSON.parse(savedValues));
    }
  }, [form]);

  // Save form data to localStorage on every change
  const onValuesChange = (changedValues: any, allValues: IProduct) => {
    setToLocalStorageAsStringify(productFormStepValueKeys.stepThree, allValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      {/* Product Transmission and Drivetrain */}
      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item
          name="transmission"
          label="Transmission"
          rules={[
            { required: true, message: "Please select the transmission" },
          ]}
        >
          <Select
            onChange={(value) => {
              form.setFieldsValue({ transmission: value }); // Make sure the form state is updated
            }}
            placeholder="Select transmission"
          >
            {productTransmissionOptions.map(({ value, label }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          className="w-full"
          name="drivetrain"
          label="Drivetrain"
          rules={[
            { required: false, message: "Please enter the Drivetrain" },
            {
              min: 2,
              message: "Drivetrain Type must be at least 2 characters",
            },
          ]}
        >
          <Input placeholder="Enter title EDrivetrain" />
        </Form.Item>
      </div>

      {/* Product Engine and Mileage */}
      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item
          className="w-full"
          name="engine"
          label="Engine Type"
          rules={[
            { required: false, message: "Please enter the Engine Type" },
            { min: 2, message: "Engine Type must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter title Engine Type" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="mileage"
          label="Mileage"
          rules={[
            { required: false, message: "Please enter the Mileage" },
            { min: 2, message: "Mileage must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter title Mileage" />
        </Form.Item>
      </div>

      {/* Product Exterior and Interior Color */}
      <div className="md:grid grid-cols-2 items-center gap-5 w-full">
        <Form.Item
          className="w-full"
          name="exteriorColor"
          label="Exterior Color"
          rules={[
            { required: false, message: "Please enter the Exterior Color" },
            { min: 3, message: "Exterior Color must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter title Exterior Color" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="interiorColor"
          label="Interior Color"
          rules={[
            { required: false, message: "Please enter the Interior Color" },
            {
              min: 3,
              message: "Interior Color Color must be at least 3 characters",
            },
          ]}
        >
          <Input placeholder="Enter title Interior Color" />
        </Form.Item>
      </div>

      <ProductFormStep />
    </Form>
  );
};

export default ProductSpecification;
