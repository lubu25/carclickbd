import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, message, Select, InputNumber } from 'antd';
import { QuestionCircleOutlined, TagOutlined, ShareAltOutlined, BuildOutlined } from '@ant-design/icons';

interface GeneralSettings {
  siteTitle: string;
  tagline: string;
  defaultTheme: 'light' | 'dark';
  allowUserRegistration: boolean;
  defaultLanguage: string;
  timeZone: string;
  contactEmail?: string;
  enableAnalytics: boolean;
  // SEO Settings
  metaKeywords?: string;
  metaDescription?: string;
  enableSearchEngineIndexing: boolean;
  // Social Media
  facebookPage?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  // Site Maintenance
  enableMaintenanceMode: boolean;
  maintenanceModeMessage?: string;
}

const GeneralSettings = () => {
  const [form] = Form.useForm<GeneralSettings>();
  const [initialValues, setInitialValues] = useState<GeneralSettings>({
    siteTitle: '',
    tagline: '',
    defaultTheme: 'light',
    allowUserRegistration: false,
    defaultLanguage: 'en',
    timeZone: 'UTC',
    contactEmail: '',
    enableAnalytics: false,
    // SEO
    metaKeywords: '',
    metaDescription: '',
    enableSearchEngineIndexing: true,
    // Social Media
    facebookPage: '',
    twitterHandle: '',
    instagramHandle: '',
    // Site Maintenance
    enableMaintenanceMode: false,
    maintenanceModeMessage: 'Site is currently under maintenance. Please check back later.',
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'বাংলা' },
  ];

  const timeZoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Asia/Dhaka', label: 'Asia/Dhaka' },
    // Add more timezone options (you might want to fetch a comprehensive list)
  ];

  useEffect(() => {
    // In a real application, fetch the current general settings from your backend
    // Example API call:
    // fetch('/api/settings/general')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     setInitialValues(data);
    //     form.setFieldsValue(data);
    //   });

    // Mock initial values
    setInitialValues({
      siteTitle: 'My Awesome Platform',
      tagline: 'Connecting the world',
      defaultTheme: 'light',
      allowUserRegistration: true,
      defaultLanguage: 'en',
      timeZone: 'Asia/Dhaka',
      contactEmail: 'info@example.com',
      enableAnalytics: true,
      // SEO
      metaKeywords: 'platform, connect, world, community',
      metaDescription: 'A platform to connect with people and share your thoughts.',
      enableSearchEngineIndexing: true,
      // Social Media
      facebookPage: 'https://facebook.com/CarClickBD',
      twitterHandle: '@myplatform',
      instagramHandle: 'myplatform',
      // Site Maintenance
      enableMaintenanceMode: false,
      maintenanceModeMessage: 'We are currently performing maintenance.  Please check back soon.',
    });
    form.setFieldsValue({
      siteTitle: 'My Awesome Platform',
      tagline: 'Connecting the world',
      defaultTheme: 'light',
      allowUserRegistration: true,
      defaultLanguage: 'en',
      timeZone: 'Asia/Dhaka',
      contactEmail: 'info@example.com',
      enableAnalytics: true,
      // SEO
      metaKeywords: 'platform, connect, world, community',
      metaDescription: 'A platform to connect with people and share your thoughts.',
      enableSearchEngineIndexing: true,
      // Social Media
      facebookPage: 'https://facebook.com/CarClickBD',
      twitterHandle: '@myplatform',
      instagramHandle: 'myplatform',
      // Site Maintenance
      enableMaintenanceMode: false,
      maintenanceModeMessage: 'We are currently performing maintenance.  Please check back soon.',
    });
  }, [form]);

  const onFinish = (values: GeneralSettings) => {
    console.log('Saving settings:', values);
    // In a real application, send these values to your backend API to update the settings
    // Example API call:
    // fetch('/api/settings/general', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(values),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     message.success('General settings saved successfully!');
    //   })
    //   .catch((error) => {
    //     message.error('Failed to save general settings.');
    //     console.error('Error saving settings:', error);
    //   });
    message.success('General settings saved successfully!');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">General Settings</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-6" // Add vertical spacing between form items
        >
          {/* Site Information Section */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <TagOutlined className="mr-2" /> Site Information
            </h2>
            <Form.Item
              label="Site Title"
              name="siteTitle"
              rules={[{ required: true, message: 'Please enter the site title!' }]}
              tooltip={{ title: 'The main title of your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tagline"
              name="tagline"
              tooltip={{ title: 'A short description or motto for your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Default Theme"
              name="defaultTheme"
              tooltip={{ title: 'The default visual theme for your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Form.Item name="defaultTheme" noStyle>
                <Select className="w-full" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Allow User Registration"
              name="allowUserRegistration"
              valuePropName="checked"
              tooltip={{ title: 'Enable or disable user registration on your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Default Language"
              name="defaultLanguage"
              tooltip={{ title: 'The primary language of your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Select className="w-full" options={languageOptions} />
            </Form.Item>

            <Form.Item
              label="Time Zone"
              name="timeZone"
              tooltip={{ title: 'The default time zone for your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Select className="w-full" options={timeZoneOptions} showSearch filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              } />
            </Form.Item>

            <Form.Item
              label="Contact Email"
              name="contactEmail"
              rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
              tooltip={{ title: 'The main contact email address for your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Enable Analytics"
              name="enableAnalytics"
              valuePropName="checked"
              tooltip={{ title: 'Enable or disable website analytics tracking.', icon: <QuestionCircleOutlined /> }}
            >
              <Switch />
            </Form.Item>
          </div>

          {/* SEO Settings Section */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <TagOutlined className="mr-2" /> SEO Settings
            </h2>
            <Form.Item
              label="Meta Keywords"
              name="metaKeywords"
              tooltip={{ title: 'Keywords that describe your website (for search engines).', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Meta Description"
              name="metaDescription"
              tooltip={{ title: 'A brief description of your website (for search engine results).', icon: <QuestionCircleOutlined /> }}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              label="Enable Search Engine Indexing"
              name="enableSearchEngineIndexing"
              valuePropName="checked"
              tooltip={{ title: 'Allow search engines to index your website.', icon: <QuestionCircleOutlined /> }}
            >
              <Switch />
            </Form.Item>
          </div>

          {/* Social Media Settings Section */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <ShareAltOutlined className="mr-2" /> Social Media
            </h2>
            <Form.Item
              label="Facebook Page URL"
              name="facebookPage"
              tooltip={{ title: 'URL of your Facebook page.', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Twitter Handle"
              name="twitterHandle"
              tooltip={{ title: 'Your Twitter handle (e.g., @yourname).', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Instagram Handle"
              name="instagramHandle"
              tooltip={{ title: 'Your Instagram handle (e.g., yourname).', icon: <QuestionCircleOutlined /> }}
            >
              <Input />
            </Form.Item>
          </div>

          {/* Site Maintenance Section */}
          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <BuildOutlined className="mr-2" /> Site Maintenance
            </h2>
            <Form.Item
              label="Enable Maintenance Mode"
              name="enableMaintenanceMode"
              valuePropName="checked"
              tooltip={{ title: 'Put your site into maintenance mode, displaying a message to visitors.', icon: <QuestionCircleOutlined /> }}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="Maintenance Mode Message"
              name="maintenanceModeMessage"
              rules={[{ required: true, message: 'Please enter a message for maintenance mode!' }]}
              tooltip={{ title: 'The message to display to visitors during maintenance mode.', icon: <QuestionCircleOutlined /> }}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>

          {/* Save Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default GeneralSettings;
