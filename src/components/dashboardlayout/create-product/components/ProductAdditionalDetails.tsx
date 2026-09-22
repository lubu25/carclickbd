"use client";
import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { IProduct } from "@/Interface/product";
import ProductFormStep from "./ProductFormStep";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";
 
import {
  getFromLocalStorage,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import { productFormStepValueKeys } from "../../product.storage-key";

const { Option } = Select;

const ProductAddtionalDetails = () => {
  const [form] = Form.useForm();
  const currentStep = useAppSelector(
    (state) => state.productReducer.setFormStep,
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
    const savedValues = getFromLocalStorage(productFormStepValueKeys.stepFour);
    if (savedValues) {
      form.setFieldsValue(JSON.parse(savedValues));
    }
  }, [form]);

  // Save form data to localStorage on every change
  const onValuesChange = (changedValues: any, allValues: IProduct) => {
    setToLocalStorageAsStringify(productFormStepValueKeys.stepFour, allValues);
  };

  return (
    <Form
      className="bg-white p-4 rounded"
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Form.Item
        rules={[
          {
            required: true,
            message: "Please add at least one  product heilight.",
          },
        ]}
        name="highlights"
        label="Highlights"
      >
        <Select mode="tags" placeholder="Add highlights" />
      </Form.Item>

      <Form.Item name="equipment" label="Equipment">
        <Select mode="tags" placeholder="Add equipment" />
      </Form.Item>

      <Form.Item name="modification" label="Modification">
        <Select mode="tags" placeholder="Add modifications" />
      </Form.Item>

      <Form.Item name="recentServiceHistory" label="Recent Service History">
        <Select mode="tags" placeholder="Add service history" />
      </Form.Item>
      <Form.Item
        name="otherItemsIncludedInSale"
        label="Other Items Include In Sale "
      >
        <Select mode="tags" placeholder="Add Other item inclued in sale " />
      </Form.Item>

      <ProductFormStep />
    </Form>
  );
};

export default ProductAddtionalDetails;
