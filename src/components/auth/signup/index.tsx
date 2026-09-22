"use client";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, PhoneOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import { ISignUpData } from "@/Interface/auth";
import { useSignupMutation } from "@/Redux/api/authApi";
import AuthWithThirdPerty from "../authWithThirdPerty";
import SignupEmail from "./SignupEmail";
import { useAppDispatch } from "@/Redux/hooks";
import { setIsLoggedIn, setProfileInfo } from "@/Redux/Slices/authSlice";

const SignUpPage: React.FC<{
  setAuthState: React.Dispatch<SetStateAction<number>>;
}> = ({ setAuthState }) => {
  const [isNext, setNext] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useAppDispatch();

  // Form submission handler
  const handleSignUp = async (values: {
    password: string;
    confirmPassword: string;
    name?: string;
    businessName?: string;
    whatsappNumber?: string;
    showroomOfficeAddress?: string;
  }) => {
    try {
      const response = await signup({
        ...values,
        email: email,
        contactNo: values.whatsappNumber,
        address: values.showroomOfficeAddress,
      } as ISignUpData).unwrap();
      const { accessToken, user } = response.data;

      dispatch(setIsLoggedIn(accessToken));
      dispatch(setProfileInfo(user));

      message.success(response?.message || "Account created successfully.");
      router.push("/"); // Redirect to the homepage
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred.";
      message.error(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="font-bold xl:text-3xl text-center">Sign up</h2>

      {!isNext && (
        <>
          <p className="mb-3 text-md md:text-lg my-3 text-center">
            Already have an account?{" "}
            <button onClick={() => setAuthState(0)} className="text-primary">
              Sign in here
            </button>
          </p>

          {/* Third-party authentication */}
          <AuthWithThirdPerty />
        </>
      )}

      {isNext ? (
        <Form
          layout="vertical"
          onFinish={handleSignUp}
          className="mt-5"
          initialValues={{
            password: "",
            confirmPassword: "",
            name: "",
            businessName: "",
            whatsappNumber: "",
            showroomOfficeAddress: "",
          }}
        >
          {/* Password Input */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password
              placeholder="Create a password..."
              prefix={<LockOutlined />}
            />
          </Form.Item>

          {/* Confirm Password Input */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your password..."
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
          >
            <Input placeholder="Your name (optional)" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Business Name" name="businessName">
            <Input placeholder="Business name (optional)" prefix={<ShopOutlined />} />
          </Form.Item>

          <Form.Item label="WhatsApp Number" name="whatsappNumber">
            <Input placeholder="+880..." prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item label="Showroom / Office Address" name="showroomOfficeAddress">
            <Input placeholder="Address (optional)" prefix={<ShopOutlined />} />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
              className="!bg-green-500 hover:!bg-green-600 !text-black"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </Form.Item>

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-500 mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-green-500">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-500">
              Privacy Policy
            </a>
            .
          </p>

          {/* Help Link */}
          <div className="mt-4 text-center">
            <a href="#" className="text-green-500 text-sm">
              Need help?
            </a>
          </div>
        </Form>
      ) : (
        <SignupEmail setEmail={setEmail} setNext={setNext} />
      )}
    </div>
  );
};

export default SignUpPage;
