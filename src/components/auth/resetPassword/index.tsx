"use client";

import React, { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message } from "antd";
import { useResetPasswordMutation } from "@/Redux/api/authApi";
interface ResetPasswordOTPProps {
  email: string;
  setAuthState: React.Dispatch<SetStateAction<number>>;
}
const ResetPasswordWithOTP: React.FC<ResetPasswordOTPProps> = ({
  setAuthState,
  email,
}) => {
  const [form] = Form.useForm();
  const [resetPassword, { isLoading, isError }] = useResetPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (values: {
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    setErrorMessage(null);

    const allData = { ...values, email: email };

    try {
      const res: any = await resetPassword({ data: allData }).unwrap();

      if (res?.statusCode === 200) {
        message.success("Password  Reset successfully.");
        setAuthState(0);
        form.resetFields();
      }
    } catch (error: any) {
      // console.log(error);
      message.error(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div
          className={`p-4 mb-4 border-l-4 bg-red-100 ${isError ? "border-red-500 text-red-700" : "border-green-400 text-white"}`}
        >
          {errorMessage}
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* OTP */}
        <Form.Item
          label="OTP"
          name="otp"
          rules={[
            { required: true, message: "Please enter the OTP." },
            {
              pattern: /^[0-9]{6}$/,
              message: "OTP must be a 6-digit number.",
            },
          ]}
        >
          <Input maxLength={6} placeholder="Enter your 6-digit OTP" />
        </Form.Item>

        {/* New Password */}
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please enter your new password.",
            },
            {
              min: 8,
              message: "Password must be at least 8 characters long.",
            },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d)/,
              message:
                "Password must include at least one uppercase letter and one number.",
            },
          ]}
        >
          <Input.Password placeholder="Enter your new password" />
        </Form.Item>

        {/* Confirm New Password */}
        <Form.Item
          label="Confirm New Password"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Please confirm your new password.",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match.")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your new password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPasswordWithOTP;
