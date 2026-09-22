import { Button, Card, Col, Divider, Layout, Row, Steps, Typography } from "antd";
import { CheckOutlined, InfoCircleOutlined, SafetyOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const steps = [
  {
    title: "Search & Browse",
    description:
      "Use CarClickBD search filters to find vehicles that match your budget and requirements. Compare prices, features, mileage, and location before shortlisting.",
    icon: <InfoCircleOutlined />,
  },
  {
    title: "Verify Details",
    description:
      "Check registration year, production year, mileage, grade, history, and condition. Ask CarClickBD for seller contact details and availability.",
    icon: <CheckOutlined />,
  },
  {
    title: "Inspect the Vehicle",
    description:
      "Arrange a meeting in a safe, public, and well-lit location such as an office, showroom, or shopping mall. Inspect the vehicle in daylight when possible.",
    icon: <SafetyOutlined />,
  },
  {
    title: "Negotiate & Pay",
    description:
      "Negotiate based on market rate and condition. Use bank transfers or cashier's checks, and avoid large cash payments to unknown individuals.",
    icon: <CheckOutlined />,
  },
];

const documents = [
  "Registration Book",
  "Insurance Certificate",
  "Service History",
  "Tax Clearance",
  "Transfer Form",
];

const vehicleChecks = [
  "Engine Sound & Performance",
  "Mileage & Odometer",
  "Exterior & Paint",
  "Interior & Upholstery",
  "Brakes & Suspension",
];

const proTips = [
  "Get a pre-purchase inspection report from an authorized mechanic.",
  "Meet the seller at their home or workplace to verify ownership.",
  "Verify the chassis number with the seller.",
  "Check for outstanding loans or mortgages on vehicles sold by individual sellers.",
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

const BuyingCarSection = () => {
  return (
    <Layout className="bg-slate-50">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">
            Vehicle Buying Guide
          </p>
          <Title level={1} className="!mb-3 !text-slate-950">
            Buy your next vehicle with confidence
          </Title>
          <Paragraph className="max-w-3xl !text-base !leading-7 !text-slate-600">
            A step-by-step guide to help you search, verify, inspect, negotiate,
            and complete your purchase safely through CarClickBD.
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
          What to check before buying
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Checklist title="Documents" items={documents} />
          </Col>
          <Col xs={24} md={12}>
            <Checklist title="Vehicle Condition" items={vehicleChecks} />
          </Col>
        </Row>

        <Card
          bordered={false}
          className="mt-5 rounded-lg border border-sky-100 bg-gradient-to-br from-white to-sky-50 shadow-sm"
          title="Pro Tips"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {proTips.map((tip) => (
              <div key={tip} className="rounded-md bg-white p-4 text-sm font-medium leading-6 text-slate-600 ring-1 ring-slate-200">
                {tip}
              </div>
            ))}
          </div>
        </Card>

        <Divider />
        <Button type="primary" size="large" block href="/cars">
          Browse Cars Now
        </Button>
      </div>
    </Layout>
  );
};

export default BuyingCarSection;
