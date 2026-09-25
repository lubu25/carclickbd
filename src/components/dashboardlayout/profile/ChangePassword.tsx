"use client";
import React, { useState } from "react";
import { useChangePasswordMutation } from "@/Redux/api/authApi";
import { Form, Input, Button, message, Alert } from "antd";
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const ChangePassword: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form] = Form.useForm();

  const validateConfirmPassword = ({
    getFieldValue,
  }: {
    getFieldValue: (name: string) => string;
  }) => ({
    validator(_: any, value: string) {
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
      setErrorMessage(null);
      setSuccessMessage(null);
      await changePassword(otherPasswords).unwrap();
      message.success("Password changed successfully!");
      setSuccessMessage("Password changed successfully!");
      form.resetFields();
    } catch (error: any) {
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        error?.data?.errorMessages?.[0]?.message ||
        "Password change failed. Please try again.";
      message.error(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  return (
    <div className="w-full">
      <div className="border-b-2 border-primary px-2 py-2 mb-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <LockOutlined /> Change Password
        </h3>
      </div>

      <div className="py-3 w-full max-w-md">
        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            showIcon
            closable
            className="mb-4"
            onClose={() => setErrorMessage(null)}
          />
        )}
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            showIcon
            closable
            className="mb-4"
            onClose={() => setSuccessMessage(null)}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleChange}
          className="space-y-2"
          autoComplete="off"
        >
          <Form.Item
            label="Current Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please enter your current password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your current password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
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
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your new password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
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
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Re-enter your new password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              size="large"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
