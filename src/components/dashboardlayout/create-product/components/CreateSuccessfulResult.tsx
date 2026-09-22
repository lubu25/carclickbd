"use client";
import { useAppDispatch } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";
import { Button, Result } from "antd";
import Link from "next/link";
import React from "react";

const CreateProductSuccessfulResult = () => {
  const dispatch = useAppDispatch();
  return (
    <Result
      status="success"
      title="Product Posted Successfully"
      extra={[
        <Link href={"/"} key="Home">
          <Button type="primary">Home</Button>
        </Link>,
        <Button
          onClick={() => dispatch(setProductFormStep(0))}
          key="post-another"
        >
          Post Another Product
        </Button>,
      ]}
    />
  );
};

export default CreateProductSuccessfulResult;
