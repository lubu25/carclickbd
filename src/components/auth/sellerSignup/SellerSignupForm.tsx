"use client";

import { Button, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSignupSellerMutation } from "@/Redux/api/authApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setIsLoggedIn, setProfileInfo } from "@/Redux/Slices/authSlice";

type SellerSignupFormProps = {
  sellerType: "dealer" | "personal";
};

const sellerCopy = {
  dealer: {
    title: "Create Dealer Account",
    subtitle: "Use your business details to start listing vehicles as a dealer.",
    nameLabel: "Business / Dealer Name",
    namePlaceholder: "e.g. Nexus Motors",
    addressLabel: "Showroom / Office Address",
  },
  personal: {
    title: "Create Personal Seller Account",
    subtitle: "Create a private seller profile to list your own vehicle.",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Rahim Ahmed",
    addressLabel: "Address",
  },
};

const SellerSignupForm = ({ sellerType }: SellerSignupFormProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signupSeller, { isLoading }] = useSignupSellerMutation();
  const copy = sellerCopy[sellerType];

  const handleSubmit = async (values: any) => {
    try {
      const response = await signupSeller({
        ...values,
        sellerType,
        accountType: sellerType,
        contactNo: values.whatsappNumber,
        address: values.showroomOfficeAddress,
      }).unwrap();
      const { accessToken, user } = response.data;

      dispatch(setIsLoggedIn(accessToken));
      dispatch(setProfileInfo(user));
      message.success(response?.message || "Seller account created successfully.");
      router.push("/seller");
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || "Failed to create seller account.");
    }
  };

  return (
    <main className="bg-slate-50 py-14 md:py-20">
      <section className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#003399]">
            Seller Signup
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{copy.subtitle}</p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-8"
          >
            <Form.Item
              label={copy.nameLabel}
              name="name"
            >
              <Input prefix={<UserOutlined />} placeholder={copy.namePlaceholder} />
            </Form.Item>

            <Form.Item label="Business Name" name="businessName">
              <Input prefix={<ShopOutlined />} placeholder="Business name (optional)" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="name@example.com" />
            </Form.Item>

            <Form.Item label="WhatsApp Number" name="whatsappNumber">
              <Input prefix={<PhoneOutlined />} placeholder="+880..." />
            </Form.Item>

            <Form.Item label={copy.addressLabel} name="showroomOfficeAddress">
              <Input prefix={<ShopOutlined />} placeholder="Dhaka, Bangladesh" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Create password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="!h-12 !w-full !rounded-lg !border-[#e50914] !bg-[#e50914] !font-extrabold !text-white hover:!bg-[#b80f17]"
            >
              {isLoading ? "Creating Account..." : copy.title}
            </Button>
          </Form>
        </div>
      </section>
    </main>
  );
};

export default SellerSignupForm;
