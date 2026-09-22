"use client";
import React, { useState, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message } from "antd";
import { useSigninMutation } from "@/Redux/api/authApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setIsLoggedIn, setProfileInfo } from "@/Redux/Slices/authSlice";
import AuthWithThirdPerty from "../authWithThirdPerty";
import handleRedirect from "@/utils/handleRedirect";

const SignInPage: React.FC<{
  setAuthState: React.Dispatch<SetStateAction<number>>;
}> = ({ setAuthState }) => {
  const [signin, { isLoading }] = useSigninMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      const response = await signin(values).unwrap();

      if (response?.statusCode === 200) {
        const { accessToken, user } = response.data;

        if (user.isDisabled) {
          message.error("Your account is disabled.");
          return;
        }

        dispatch(setIsLoggedIn(accessToken));
        dispatch(setProfileInfo(user));
        message.success(response?.message);
        handleRedirect(user.role, router);
      } else {
        message.error("An unexpected error occurred.");
      }
    } catch (error: any) {
      const errorMsg = error?.message || "Sign-in failed. Please try again.";
      message.error(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center relative">
      <div>
        <h2 className="font-bold text-dark text-3xl text-center mb-2">
          Sign In
        </h2>
        <p className="text-lg text-center mb-6">
          Need to create an account?{" "}
          <button className="text-primary" onClick={() => setAuthState(1)}>
            Sign up here
          </button>
        </p>

        <AuthWithThirdPerty />

        <Form
          layout="vertical"
          onFinish={handleSignIn}
          className="mt-6"
          initialValues={{ email: "", password: "" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <div className="mb-3">
            <button
              onClick={() => setAuthState(3)}
              className="underline text-md text-primary"
            >
              Forgot password?
            </button>
          </div>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              className="w-full !py-5"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInPage;
