"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Space,
  Select,
} from "antd";
import { CgShield } from "react-icons/cg";
import { FaUserShield } from "react-icons/fa";
import { useCreateSellerMutation } from "@/Redux/api/userApi";


const { Title, Text } = Typography;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminRegistrationForm() {
  const [createSeller] =   useCreateSellerMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await createSeller({
        ...data,
        sellerType: "dealer",
        accountType: "dealer",
      }).unwrap();
      messageApi.success("Seller created successfully");
      reset();
    } catch (error: any) {
      messageApi.error(
        error?.data?.message || error?.message || "Failed to create seller",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {contextHolder}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "left" }}>
          <Space align="center" size={12}>
            <CgShield size={32} />
            <Title level={2} style={{ margin: 0 }}>
              seller Management
            </Title>
          </Space>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space align="center">
              <FaUserShield size={20} />
              <Text strong>New seller</Text>
            </Space>

            <Form
              layout="vertical"
              onFinish={handleSubmit(onSubmit)}
              style={{ maxWidth: 500 }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Full Name"
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <Input {...field} placeholder="Enter seller's full name" />
                  </Form.Item>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Email Address"
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter seller's email address"
                    />
                  </Form.Item>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Initial Password"
                    validateStatus={fieldState.error ? "error" : ""}
                  >
                    <Input.Password {...field} placeholder="password" />
                  </Form.Item>
                )}
              />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  icon={<FaUserShield size={16} />}
                >
                  Create Seller
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
