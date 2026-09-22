"use client";
import React, { useState } from "react";
import { useChangePasswordMutation } from "@/Redux/api/authApi";
import { Form, Input, Button, message } from "antd";
import { RuleObject } from "antd/es/form";

const ChangePassword: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form] = Form.useForm(); // Create a form instance

  const validateConfirmPassword = ({
    getFieldValue,
  }: {
    getFieldValue: (name: string) => string;
  }) => ({
    validator(_: RuleObject, value: string) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  const handleChange = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const { confirmPassword, ...otherPasswords } = values;

    try {
      const res: any = await changePassword(otherPasswords);
      if (res?.data?.statusCode === 200) {
        setErrorMessage(null);
        message.success("Password changed successfully.");
        form.resetFields(); // Reset the form fields after successful submission
      } else {
        const errorMsg = res?.error?.message || "Password change failed.";
        message.error(errorMsg);
        setErrorMessage(errorMsg);
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="col-span-9 bg-white shadow-lg">
    <div className="border-b-2 border-primary px-2 py-1 mb-3">
      <h3 className="font-semibold">Change Password</h3>
    </div>
    <div className="py-3 mb-5 w-full md:w-[50%]">
    <div className="py-5 px-5 lg:px-10 w-full">
      <Form
        form={form} // Attach the form instance
        layout="vertical"
        onFinish={handleChange}
        className="space-y-4"
        autoComplete="off"
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            {
              required: true,
              message: "Please enter your old password!",
            },
          ]}
        >
          <Input.Password placeholder="Enter your old password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please enter your new password!",
            },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "Password must be at least 6 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters!",
            },
          ]}
        >
          <Input.Password placeholder="Enter your new password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            validateConfirmPassword,
          ]}
        >
          <Input.Password placeholder="Enter your confirm password" />
        </Form.Item>

        {errorMessage && (
          <p className="text-sm text-red-500 mb-1">{errorMessage}</p>
        )}

        <Form.Item className="mt-5">
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
    </div>
  </div>
   
  );
};

export default ChangePassword;
