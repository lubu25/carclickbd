'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Form, Select, Switch, Typography, message, Input } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { type PaymentGatewayMode, savePaymentGatewaySettings } from '@/utils/paymentGatewaySettings';

const { Title, Text } = Typography;

const modeOptions: { label: string; value: PaymentGatewayMode }[] = [
  { label: 'Sandbox', value: 'sandbox' },
  { label: 'Live', value: 'live' },
];

const PaymentGatewaySettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settingsSummary, setSettingsSummary] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/payment-gateway');
      const data = await res.json();
      form.setFieldsValue(data);
      
      // Sync fetched mode to local storage so other components are aware
      savePaymentGatewaySettings({
        mode: data.mode,
        enabled: data.enabled,
        epsApiKey: '',
        activeGateway: 'eps'
      });
      
      setSettingsSummary(
        data.enabled
          ? `EPS is the active payment gateway running in ${data.mode} mode.`
          : 'EPS payment gateway is currently disabled.'
      );
    } catch (err) {
      message.error('Failed to load payment gateway settings.');
    } finally {
      setFetching(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const res = await fetch('/api/admin/payment-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      const { config } = await res.json();
      
      // Sync non-secret settings to local storage so client components (like EPS.tsx) know the active mode
      savePaymentGatewaySettings({
        mode: config.mode,
        enabled: config.enabled,
        epsApiKey: '',
        activeGateway: 'eps'
      });

      setSettingsSummary(
        config.enabled
          ? `EPS is active in ${config.mode} mode. Gateway configuration saved successfully.`
          : 'EPS payment gateway disabled.'
      );

      message.success('Payment gateway settings saved successfully.');
    } catch (error) {
      console.error(error);
      message.error('Could not save the payment gateway settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Title level={4} className="!mb-1">
            Payment Gateway Configuration
          </Title>
          <Text type="secondary">
            Configure your EPS credentials directly from the admin panel to activate the payment gateway instantly.
          </Text>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircleOutlined className="mr-1" />
          Admin Ready
        </div>
      </div>

      {settingsSummary ? (
        <Alert
          type="info"
          showIcon
          icon={<CreditCardOutlined />}
          message={settingsSummary}
        />
      ) : null}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
        disabled={fetching}
      >
        <Form.Item
          label="Enable payment gateway"
          name="enabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Mode"
          name="mode"
          rules={[{ required: true, message: 'Please choose a mode.' }]}
        >
          <Select options={modeOptions} />
        </Form.Item>

        <Form.Item label="Merchant ID" name="merchantId" rules={[{ required: true }]}>
          <Input placeholder="Enter your EPS Merchant ID" />
        </Form.Item>

        <Form.Item label="Store ID" name="storeId" rules={[{ required: true }]}>
          <Input placeholder="Enter your EPS Store ID" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input placeholder="Enter your EPS Username" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter your EPS Password" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Auth Hash" name="authHash" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter your Auth Hash" />
          </Form.Item>
          <Form.Item label="Init Hash" name="initHash" rules={[{ required: true }]}>
            <Input.Password placeholder="Enter your Init Hash" />
          </Form.Item>
        </div>

        <Button type="primary" htmlType="submit" loading={loading} disabled={fetching}>
          Save Payment Settings
        </Button>
      </Form>
    </div>
  );
};

export default PaymentGatewaySettings;
