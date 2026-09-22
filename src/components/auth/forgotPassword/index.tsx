"use client";

import React, { SetStateAction, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useForgotPasswordMutation } from "@/Redux/api/authApi";
import { MailOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ResetPasswordWithOTP from "../resetPassword";

// Validation schema for the form
const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword: React.FC<{
  setAuthState: React.Dispatch<SetStateAction<number>>;
}> = ({ setAuthState }) => {
  const [isNext, setNext] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [form] = Form.useForm();

  // Handle form submission
  const onSubmit = async (values: { email: string }) => {
    setEmail(values.email);
    try {
      const res: any = await forgotPassword(values).unwrap();

      if (res?.statusCode === 200) {
        message.success("Please check your email inbox.");
        setNext(true);
        // setAuthState(4); // Navigate to the next step
        form.resetFields(); // Reset form fields
      }
    } catch (error: any) {
      message.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="p-3 w-full">
      <div className="mb-3 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <button
          className="text-md text-primary my-1"
          onClick={() => setAuthState(0)}
        >
          Back to Sign In
        </button>
        <p className="text-gray-600 mt-2">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {/* Form */}
      {!isNext ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
        >
          {/* Email Field */}
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email!",
              },
              {
                required: true,
                message: "Email is required!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your account email"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="!py-5"
            >
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <ResetPasswordWithOTP
            setAuthState={setAuthState}
            email={email as any}
          />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
