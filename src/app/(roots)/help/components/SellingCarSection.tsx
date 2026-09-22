import { Button, Card, Col, Divider, Layout, Row, Steps, Typography } from "antd";
import {
  CameraOutlined,
  CheckOutlined,
  DollarOutlined,
  FileTextOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const steps = [
  {
    title: "Prepare Your Vehicle",
    description:
      "Gather registration, insurance, service records, and tax documents. Clean the vehicle and complete minor repairs before listing.",
    icon: <ToolOutlined />,
  },
  {
    title: "Take Great Photos",
    description:
      "Capture clear photos of the exterior, interior, engine bay, dashboard, tires, and key features using good lighting and multiple angles.",
    icon: <CameraOutlined />,
  },
  {
    title: "Set the Right Price",
    description:
      "Research similar vehicles and current market rates. Price competitively to attract serious buyers faster.",
    icon: <DollarOutlined />,
  },
  {
    title: "Create Your Listing",
    description:
      "Write a detailed description covering features, condition, maintenance history, mileage, fuel type, engine size, and known issues.",
    icon: <FileTextOutlined />,
  },
];

const documents = [
  "Original Registration Book",
  "Insurance Certificate",
  "Service History",
  "Tax Clearance Certificate",
  "Transfer Form",
];

const vehicleDetails = [
  "Mileage & Condition",
  "Fuel Type & Engine Size",
  "Transmission Type",
  "Service & Maintenance Records",
  "Any Accidents or Damage History",
  "Current Market Value",
];

const sellerTips = [
  "Use one strong main photo and up to 10 clear supporting photos.",
  "Mention real condition honestly to build buyer trust.",
  "Keep availability and listing status updated.",
  "Respond quickly and arrange inspections in safe, public locations.",
];

const Checklist = ({ title, items }: { title: string; items: string[] }) => (
  <Card
    title={title}
    bordered={false}
    className="h-full rounded-lg border border-slate-200 shadow-sm"
  >
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-600">
            <CheckOutlined />
          </span>
          <Text className="text-slate-700">{item}</Text>
        </div>
      ))}
    </div>
  </Card>
);

const SellingCarSection = () => {
  return (
    <Layout className="bg-slate-50">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
            Vehicle Selling Guide
          </p>
          <Title level={1} className="!mb-3 !text-slate-950">
            Sell faster with a complete, trustworthy listing
          </Title>
          <Paragraph className="max-w-3xl !text-base !leading-7 !text-slate-600">
            Maximize your vehicle&apos;s visibility with clear documentation,
            accurate details, strong photos, and professional buyer communication.
          </Paragraph>
          <Divider className="!my-5 !w-24 !min-w-0 !border-t-4 !border-[#f0b90b]" />
        </div>

        <Card bordered={false} className="rounded-lg border border-slate-200 shadow-sm">
          <Steps current={3} direction="vertical" size="default">
            {steps.map((step) => (
              <Step
                key={step.title}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>
        </Card>

        <Divider />
        <Title level={3} className="!mb-5 !text-slate-950">
          Documentation checklist
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Checklist title="Essential Documents" items={documents} />
          </Col>
          <Col xs={24} md={12}>
            <Checklist title="Vehicle Details to Provide" items={vehicleDetails} />
          </Col>
        </Row>

        <Card
          bordered={false}
          className="mt-5 rounded-lg border border-sky-100 bg-gradient-to-br from-white to-sky-50 shadow-sm"
          title="Seller Tips"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {sellerTips.map((tip) => (
              <div key={tip} className="rounded-md bg-white p-4 text-sm font-medium leading-6 text-slate-600 ring-1 ring-slate-200">
                {tip}
              </div>
            ))}
          </div>
        </Card>

        <Divider />
        <Button type="primary" size="large" block href="/sell-item">
          Start Selling Now
        </Button>
      </div>
    </Layout>
  );
};

export default SellingCarSection;
