'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form, Input, Select, Switch, Typography, message } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
  defaultPaymentGatewaySettings,
  getPaymentGatewaySettings,
  savePaymentGatewaySettings,
  type PaymentGatewayMode,
} from '@/utils/paymentGatewaySettings';

const { Title, Text } = Typography;

const gatewayOptions = [
  { label: 'BDGate', value: 'bdgate' },
  { label: 'EPS', value: 'eps' },
];

const modeOptions: { label: string; value: PaymentGatewayMode }[] = [
  { label: 'Sandbox', value: 'sandbox' },
  { label: 'Live', value: 'live' },
];

const PaymentGatewaySettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settingsSummary, setSettingsSummary] = useState('');

  const savedSettings = useMemo(() => getPaymentGatewaySettings(), []);

  useEffect(() => {
    form.setFieldsValue(savedSettings);
    setSettingsSummary(
      savedSettings.activeGateway === 'eps'
        ? 'EPS is currently active and ready for checkout.'
        : 'BDGate remains the default active gateway.',
    );
  }, [form, savedSettings]);

  const onFinish = (values: typeof defaultPaymentGatewaySettings) => {
    setLoading(true);

    try {
      const saved = savePaymentGatewaySettings(values);
      const activeLabel = saved.activeGateway === 'eps' ? 'EPS' : 'BDGate';

      setSettingsSummary(
        `${activeLabel} is active in ${saved.mode} mode. ${
          saved.activeGateway === 'eps' && !saved.epsApiKey.trim()
            ? 'Add the EPS API key before using it.'
            : 'Gateway configuration saved successfully.'
        }`,
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
            Set the default gateway and store your API credentials in the admin panel.
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
        initialValues={defaultPaymentGatewaySettings}
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label="Enable payment gateway"
          name="enabled"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Active Gateway"
          name="activeGateway"
          rules={[{ required: true, message: 'Please choose a gateway.' }]}
        >
          <Select options={gatewayOptions} />
        </Form.Item>

        <Form.Item
          label="Mode"
          name="mode"
          rules={[{ required: true, message: 'Please choose a mode.' }]}
        >
          <Select options={modeOptions} />
        </Form.Item>

        <Form.Item
          label="EPS API Key"
          name="epsApiKey"
          tooltip="Add the EPS API key here. Save it once and the checkout flow will use it for EPS payments."
        >
          <Input.Password placeholder="Enter EPS API key" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="BDGate API Key"
          name="bdGateApiKey"
          tooltip="Optional if you still use BDGate for other transactions."
        >
          <Input.Password placeholder="Enter BDGate API key" autoComplete="off" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Save Payment Settings
        </Button>
      </Form>
    </div>
  );
};

export default PaymentGatewaySettings;
