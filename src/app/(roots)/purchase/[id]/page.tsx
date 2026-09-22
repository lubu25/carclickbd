"use client";
import { useState } from "react";
import {
  Typography,
  Button,
  Card,
  Table,
  Breadcrumb,
  Tabs,
  Modal,
  InputNumber,
  message,
} from "antd";
import {
  HomeOutlined,
  CarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useGetProductByIdQuery } from "@/Redux/api/productApi";
import ProductSkeletonContainer from "../../../../components/product/skeleton/ProductSkeletonContainer";
import { IProduct } from "@/Interface/product";
import BuyerOrderInfo from "./components/BuyerOrderInfo";
import PurchaseProcess from "./components/PurchaseProcess";
import { getWhatsAppUrl } from "@/constants/siteContact";
import { useCreateOrderMutation } from "@/Redux/api/orderApi";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function PurchasePage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [apr, setApr] = useState(3.99);

  const id = params.id;
  const { data, isLoading } = useGetProductByIdQuery(`${id}`);
  const [createOrder] = useCreateOrderMutation();

  if (isLoading) return <ProductSkeletonContainer />;
  if (!data) return <div>Product not found</div>;

  const product = data.data as IProduct;

  const vehiclePrice = product.mainPrice;
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = apr / 100 / 12;
  const numberOfPayments = loanTerm;

  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
      : 0;

  const columns = [
    { title: "Detail", dataIndex: "detail", key: "detail", width: "40%" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const specifiedData = [
    { key: "1", detail: "Model", value: product.model },
    { key: "2", detail: "Year", value: product.launchingYear },
    { key: "3", detail: "Mileage", value: product.mileage },
  ];

  const handleOrderSubmit = async (formData: any) => {
    const orderPayload = {
      productId: product._id,
      totalAmount: vehiclePrice,
      buyerInfo: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      },
    };

    message.loading("Creating order...");

    try {
      const res = await createOrder(orderPayload).unwrap();
        message.success("Order created successfully");
        router.push("/order-uccess");
      
    } catch (err: any) {
      console.error(err.message);
      message.error("Order creation failed");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item href="/">
          <HomeOutlined />
          <span className="ml-2">Home</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item href={`/auction-details/${product._id}`}>
          <CarOutlined />
          <span className="ml-2">{product.title}</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg mb-8">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Specifications" key="1">
                <Table
                  columns={columns}
                  dataSource={specifiedData}
                  pagination={false}
                />
              </TabPane>
              {product.equipment?.length > 0 && (
                <TabPane tab="Equipments" key="2">
                  <ul className="grid grid-cols-2 gap-4">
                    {product.equipment.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </TabPane>
              )}
              {product.highlights?.length > 0 && (
                <TabPane tab="Highlights" key="3">
                  <ul className="grid grid-cols-2 gap-4">
                    {product.highlights.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </TabPane>
              )}
              {product.modification?.length > 0 && (
                <TabPane tab="Modifications" key="4">
                  <ul className="grid grid-cols-2 gap-4">
                    {product.modification.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </TabPane>
              )}
            </Tabs>
          </Card>
        </div>

        {/* Right: Summary & Finance */}
        <div>
          <Card className="shadow-lg mb-8">
            <Text className="block text-2xl text-blue-600 font-bold mb-4">
              Total Price: ${vehiclePrice.toLocaleString()}
            </Text>
            <Button
              type="primary"
              size="large"
              className="w-full bg-blue-600 hover:bg-blue-700 border-none h-12 text-lg"
              onClick={() => setShowFinanceModal(true)}
            >
              Calculate Financing
            </Button>
          </Card>
          <Card className="shadow-lg">
            <Title level={4}>Need Help?</Title>
            <Paragraph>
              Our carclickbd team is here to assist you with your purchase.
            </Paragraph>
            <a
              href={getWhatsAppUrl("Hello! I have a question about CarClickBD purchase support")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Contact us on WhatsApp
            </a>
          </Card>
        </div>
      </div>

      {/* Order Form */}
      <BuyerOrderInfo onSubmit={handleOrderSubmit} />
      <PurchaseProcess />

      <Text type="secondary" className="block text-center mt-6">
        Need help?{" "}
        <Link href="/contact" className="text-blue-600 hover:underline">
          Contact our support team
        </Link>
      </Text>

      {/* Financing Modal */}
      <Modal
        title="Financing Calculator"
        open={showFinanceModal}
        onCancel={() => setShowFinanceModal(false)}
        footer={null}
        width={600}
      >
        <div className="p-4 space-y-6">
          <Title level={4}>Estimated Monthly Payment</Title>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Text strong>Vehicle Price</Text>
              <p>${vehiclePrice.toLocaleString()}</p>
            </div>
            <div>
              <Text strong>Loan Amount</Text>
              <p>${loanAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Text>Down Payment ($)</Text>
              <InputNumber
                min={0}
                max={vehiclePrice}
                value={downPayment}
                onChange={(value) => setDownPayment(value || 0)}
                className="w-full"
              />
            </div>
            <div>
              <Text>Loan Term (months)</Text>
              <InputNumber
                min={12}
                max={84}
                value={loanTerm}
                onChange={(value) => setLoanTerm(value || 60)}
                className="w-full"
              />
            </div>
            <div>
              <Text>APR (%)</Text>
              <InputNumber
                min={0.1}
                max={15}
                step={0.1}
                value={apr}
                onChange={(value) => setApr(value || 3.99)}
                className="w-full"
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <Text className="text-lg">Estimated Monthly Payment:</Text>
            <Title level={3} className="text-blue-600">
              ${monthlyPayment.toFixed(2)} /mo
            </Title>
          </div>
          <Button type="primary" block className="bg-blue-600 hover:bg-blue-700">
            Apply for Financing
          </Button>
        </div>
      </Modal>
    </div>
  );
}
