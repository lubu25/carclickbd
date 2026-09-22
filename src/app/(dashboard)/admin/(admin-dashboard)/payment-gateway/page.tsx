"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Alert,
  Tabs,
  Table,
  Tag,
  Switch,
  Statistic,
  Row,
  Col,
  Divider,
  Badge,
  Tooltip,
  Typography,
  Space,
  Modal,
  Spin,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DollarOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

// ─── Fake transaction data (replace with real API later) ────────────────────
const MOCK_TRANSACTIONS = [
  { id: "TXN001", chassis: "ABC123456", amount: 500, status: "SUCCESS", date: "2026-09-22T10:30:00Z", name: "Rahman Ali", method: "EPS" },
  { id: "TXN002", chassis: "XYZ789012", amount: 500, status: "PENDING", date: "2026-09-21T14:15:00Z", name: "Karim Hossain", method: "EPS" },
  { id: "TXN003", chassis: "DEF345678", amount: 500, status: "FAILED", date: "2026-09-20T09:00:00Z", name: "Nasrin Akter", method: "EPS" },
  { id: "TXN004", chassis: "GHI901234", amount: 500, status: "SUCCESS", date: "2026-09-19T16:45:00Z", name: "Jabbar Mia", method: "EPS" },
  { id: "TXN005", chassis: "JKL567890", amount: 500, status: "SUCCESS", date: "2026-09-18T11:20:00Z", name: "Sumaiya Begum", method: "EPS" },
];

// ─── Status Tag ──────────────────────────────────────────────────────────────
const StatusTag = ({ status }: { status: string }) => {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    SUCCESS: { color: "success", icon: <CheckCircleOutlined /> },
    PENDING: { color: "warning", icon: <ReloadOutlined spin /> },
    FAILED: { color: "error", icon: <CloseCircleOutlined /> },
  };
  const { color, icon } = map[status] || { color: "default", icon: null };
  return <Tag color={color} icon={icon}>{status}</Tag>;
};

// ─── Main Component ──────────────────────────────────────────────────────────
const PaymentGatewayPage = () => {
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [testing, setTesting] = useState(false);
  const [isSandbox, setIsSandbox] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchConfig = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/eps/config");
      const data = await res.json();
      if (data.success && data.data) {
        setConfig(data.data);
        form.setFieldsValue({
          storeId: data.data.storeId,
          signatureKey: data.data.signatureKey,
          gatewayUrl: data.data.gatewayUrl || (isSandbox ? "https://sandbox.eps.com.bd/payment" : "https://eps.com.bd/payment"),
        });
        setIsSandbox(!data.data.gatewayUrl?.includes("sandbox") === false);
        setIsActive(data.data.isActive !== false);
      }
    } catch (error) {
      console.error("Failed to load EPS config:", error);
    } finally {
      setFetching(false);
    }
  }, [form, isSandbox]);

  useEffect(() => { fetchConfig(); }, []);

  const onSave = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("/api/eps/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, isActive, isSandbox }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("✅ EPS Payment Gateway settings saved! Changes are live immediately.");
        setConfig(data.data);
      } else {
        message.error("Failed to save settings: " + data.message);
      }
    } catch {
      message.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const onTest = async (values: any) => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/eps/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: values.testAmount || 500,
          chassis: values.testChassis || "TEST-CHASSIS-123",
          name: values.testName || "Test User",
          email: values.testEmail || "test@example.com",
          mobileNumber: "01700000000",
          address: "Dhaka, Bangladesh",
        }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        message.success("✅ Test payment link generated successfully!");
      } else {
        message.error("❌ Test failed: " + data.message);
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
      message.error("Connection error!");
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied!");
  };

  const handleSandboxToggle = (val: boolean) => {
    setIsSandbox(val);
    form.setFieldValue("gatewayUrl", val ? "https://sandbox.eps.com.bd/payment" : "https://eps.com.bd/payment");
  };

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const totalSuccess = MOCK_TRANSACTIONS.filter(t => t.status === "SUCCESS").length;
  const totalRevenue = MOCK_TRANSACTIONS.filter(t => t.status === "SUCCESS").reduce((a, b) => a + b.amount, 0);
  const totalFailed = MOCK_TRANSACTIONS.filter(t => t.status === "FAILED").length;

  // ─── Transaction columns ─────────────────────────────────────────────────────
  const txColumns = [
    { title: "Transaction ID", dataIndex: "id", key: "id", render: (v: string) => <Text code>{v}</Text> },
    { title: "Customer", dataIndex: "name", key: "name" },
    { title: "Chassis No.", dataIndex: "chassis", key: "chassis" },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (v: number) => <Text strong>৳ {v}</Text> },
    { title: "Status", dataIndex: "status", key: "status", render: (v: string) => <StatusTag status={v} /> },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (v: string) => moment(v).format("DD MMM YYYY, hh:mm A"),
    },
  ];

  // ─── Tabs ────────────────────────────────────────────────────────────────────
  const tabItems = [
    {
      key: "overview",
      label: <span><DollarOutlined /> Overview</span>,
      children: (
        <div>
          {/* Status Banner */}
          <Alert
            message={
              <Space>
                <Badge status={isActive ? "success" : "error"} />
                <Text strong>EPS Payment Gateway is currently {isActive ? "ACTIVE" : "DISABLED"}</Text>
                <Tag color={isSandbox ? "orange" : "green"}>{isSandbox ? "SANDBOX MODE" : "LIVE MODE"}</Tag>
              </Space>
            }
            type={isActive ? "success" : "error"}
            className="mb-6"
          />

          {/* Stats */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card className="text-center shadow-sm border-blue-200">
                <Statistic title="Total Transactions" value={MOCK_TRANSACTIONS.length} prefix={<UnorderedListOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="text-center shadow-sm border-green-200">
                <Statistic title="Successful" value={totalSuccess} valueStyle={{ color: "#3f8600" }} prefix={<CheckCircleOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="text-center shadow-sm border-red-200">
                <Statistic title="Failed" value={totalFailed} valueStyle={{ color: "#cf1322" }} prefix={<CloseCircleOutlined />} />
              </Card>
            </Col>
            <Col span={6}>
              <Card className="text-center shadow-sm border-purple-200">
                <Statistic title="Total Revenue" value={totalRevenue} prefix="৳" valueStyle={{ color: "#722ed1" }} />
              </Card>
            </Col>
          </Row>

          {/* Quick Config Summary */}
          {fetching ? (
            <div className="text-center py-8"><Spin size="large" /></div>
          ) : config?.storeId ? (
            <Card title={<><SafetyCertificateOutlined /> Current Configuration</>} className="shadow-sm">
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical">
                    <div>
                      <Text type="secondary">Store ID</Text>
                      <div>
                        <Text strong>{config.storeId}</Text>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => copyToClipboard(config.storeId)} />
                      </div>
                    </div>
                    <div>
                      <Text type="secondary">Signature Key</Text>
                      <div>
                        <Text strong>{showKey ? config.signatureKey : "••••••••••••••••"}</Text>
                        <Button type="link" icon={showKey ? <EyeInvisibleOutlined /> : <EyeOutlined />} onClick={() => setShowKey(!showKey)} />
                      </div>
                    </div>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical">
                    <div>
                      <Text type="secondary">Gateway URL</Text>
                      <div>
                        <Text strong style={{ fontSize: 12 }}>{config.gatewayUrl}</Text>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => copyToClipboard(config.gatewayUrl)} />
                      </div>
                    </div>
                    <div>
                      <Text type="secondary">Mode</Text>
                      <div><Tag color={isSandbox ? "orange" : "green"}>{isSandbox ? "🧪 Sandbox" : "🚀 Live Production"}</Tag></div>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>
          ) : (
            <Alert
              message="⚠️ Payment Gateway Not Configured"
              description="EPS credentials are not set. Go to the Configuration tab to add your Store ID and Signature Key."
              type="warning"
              showIcon
              action={<Button size="small" type="primary" onClick={() => setActiveTab("configuration")}>Configure Now</Button>}
            />
          )}
        </div>
      ),
    },
    {
      key: "configuration",
      label: <span><SettingOutlined /> Configuration</span>,
      children: (
        <div>
          <Alert
            message="EPS Payment Gateway Setup"
            description="Enter your EPS merchant credentials below. These settings are applied immediately — no server restart required."
            type="info"
            showIcon
            className="mb-6"
          />

          {/* Mode Toggle */}
          <Card className="mb-4 shadow-sm">
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={5} style={{ margin: 0 }}>Gateway Mode</Title>
                <Text type="secondary">Switch between Sandbox (testing) and Live (real payments)</Text>
              </Col>
              <Col>
                <Space>
                  <Tag color="orange">Sandbox</Tag>
                  <Switch checked={!isSandbox} onChange={(val) => handleSandboxToggle(!val)} />
                  <Tag color="green">Live</Tag>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Active Toggle */}
          <Card className="mb-4 shadow-sm">
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={5} style={{ margin: 0 }}>Gateway Status</Title>
                <Text type="secondary">Enable or disable EPS payment processing entirely</Text>
              </Col>
              <Col>
                <Space>
                  <Text>{isActive ? "🟢 Active" : "🔴 Disabled"}</Text>
                  <Switch checked={isActive} onChange={setIsActive} />
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Credentials Form */}
          <Card title={<><SafetyCertificateOutlined /> Merchant Credentials</>} className="shadow-sm">
            <Form form={form} layout="vertical" onFinish={onSave} autoComplete="off">
              <Form.Item
                label={<Tooltip title="Your EPS Merchant/Store ID provided by EPS Bangladesh"><span>Store ID (Merchant ID) <InfoCircleOutlined /></span></Tooltip>}
                name="storeId"
                rules={[{ required: true, message: "Please input your EPS Store ID!" }]}
              >
                <Input placeholder="e.g. carclickbd" size="large" prefix={<SafetyCertificateOutlined />} />
              </Form.Item>

              <Form.Item
                label={<Tooltip title="Your secret Signature Key from EPS merchant portal"><span>Signature Key <InfoCircleOutlined /></span></Tooltip>}
                name="signatureKey"
                rules={[{ required: true, message: "Please input your EPS Signature Key!" }]}
              >
                <Input.Password placeholder="Enter your EPS signature key" size="large" />
              </Form.Item>

              <Form.Item
                label="Gateway URL"
                name="gatewayUrl"
                rules={[{ required: true, message: "Please input the Gateway URL!" }]}
                extra={
                  <span>
                    Sandbox: <Text code>https://sandbox.eps.com.bd/payment</Text> |
                    Live: <Text code>https://eps.com.bd/payment</Text>
                  </span>
                }
              >
                <Input placeholder="https://sandbox.eps.com.bd/payment" size="large" prefix={<LinkOutlined />} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" size="large" loading={loading} disabled={fetching} icon={<ThunderboltOutlined />}>
                    Save & Apply Settings
                  </Button>
                  <Button size="large" onClick={fetchConfig} icon={<ReloadOutlined />}>Reload</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ),
    },
    {
      key: "transactions",
      label: <span><UnorderedListOutlined /> Transactions</span>,
      children: (
        <div>
          <Alert
            message="Payment Transaction History"
            description="All EPS payment transactions are listed below. Successful payments have been processed through the gateway."
            type="info"
            showIcon
            className="mb-4"
          />
          <Table
            columns={txColumns}
            dataSource={MOCK_TRANSACTIONS}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </div>
      ),
    },
    {
      key: "test",
      label: <span><ThunderboltOutlined /> Test Gateway</span>,
      children: (
        <div>
          <Alert
            message="Test Payment Link Generator"
            description="Use this tool to verify your EPS credentials are working. A test payment URL will be generated without any real charge."
            type="warning"
            showIcon
            className="mb-6"
          />

          <Card title="Generate Test Payment Link" className="shadow-sm" style={{ maxWidth: 600 }}>
            <Form form={testForm} layout="vertical" onFinish={onTest}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Test Amount (৳)" name="testAmount" initialValue={500}>
                    <Input type="number" placeholder="500" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Chassis Number" name="testChassis" initialValue="TEST-CHASSIS-001">
                    <Input placeholder="TEST-CHASSIS-001" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Customer Name" name="testName" initialValue="Test User">
                    <Input placeholder="Test User" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Customer Email" name="testEmail" initialValue="test@carclickbd.com">
                    <Input placeholder="test@carclickbd.com" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" loading={testing} icon={<ThunderboltOutlined />}>
                  Generate Test Link
                </Button>
              </Form.Item>
            </Form>

            {testResult && (
              <div className="mt-4">
                <Divider />
                {testResult.success ? (
                  <Alert
                    message="✅ Test Successful! Payment link generated."
                    description={
                      <div>
                        <Paragraph>
                          <Text strong>Payment URL: </Text>
                          <Text code style={{ wordBreak: "break-all" }}>{testResult.data?.payment_url}</Text>
                          <Button type="link" icon={<CopyOutlined />} onClick={() => copyToClipboard(testResult.data?.payment_url)} />
                        </Paragraph>
                        <Paragraph>
                          <Text strong>Order ID: </Text><Text code>{testResult.data?.orderId}</Text>
                        </Paragraph>
                      </div>
                    }
                    type="success"
                  />
                ) : (
                  <Alert
                    message="❌ Test Failed"
                    description={testResult.message || "Could not generate payment link. Check your credentials in the Configuration tab."}
                    type="error"
                  />
                )}
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      key: "docs",
      label: <span><InfoCircleOutlined /> Documentation</span>,
      children: (
        <div>
          <Card title="EPS Integration Guide" className="shadow-sm mb-4">
            <Title level={5}>How it works</Title>
            <Paragraph>
              When a user clicks <Text strong>"Pay Now"</Text> on an auction sheet verification page, the system:
            </Paragraph>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Sends the payment request to <Text code>/api/eps/checkout</Text> (our internal API).</li>
              <li>The API reads your credentials from the admin panel settings.</li>
              <li>Builds a signed payment URL and redirects the user to the EPS payment page.</li>
              <li>After payment, EPS redirects back to our <Text code>/payments</Text> success page.</li>
            </ol>
            <Divider />
            <Title level={5}>Getting your EPS Credentials</Title>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Visit <a href="https://eps.com.bd" target="_blank" rel="noopener noreferrer">eps.com.bd</a> and register a merchant account.</li>
              <li>Get your <Text strong>Store ID</Text> and <Text strong>Signature Key</Text> from the merchant portal.</li>
              <li>Enter them in the <Text strong>Configuration</Text> tab above.</li>
              <li>Use <Text strong>Sandbox mode</Text> for testing before going live.</li>
            </ol>
            <Divider />
            <Title level={5}>Important URLs</Title>
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="p-2 border border-gray-200 font-semibold">Checkout API</td>
                  <td className="p-2 border border-gray-200"><Text code>/api/eps/checkout</Text></td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-200 font-semibold">Config API</td>
                  <td className="p-2 border border-gray-200"><Text code>/api/eps/config</Text></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-2 border border-gray-200 font-semibold">Sandbox URL</td>
                  <td className="p-2 border border-gray-200"><Text code>https://sandbox.eps.com.bd/payment</Text></td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-200 font-semibold">Live URL</td>
                  <td className="p-2 border border-gray-200"><Text code>https://eps.com.bd/payment</Text></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={3} style={{ margin: 0 }}>
          <DollarOutlined className="mr-2 text-blue-500" />
          Payment Gateway Management
        </Title>
        <Text type="secondary">Manage your EPS payment gateway configuration, monitor transactions, and test integration.</Text>
      </div>

      {fetching ? (
        <div className="flex justify-center items-center h-64"><Spin size="large" tip="Loading gateway settings..." /></div>
      ) : (
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
      )}
    </div>
  );
};

export default PaymentGatewayPage;
