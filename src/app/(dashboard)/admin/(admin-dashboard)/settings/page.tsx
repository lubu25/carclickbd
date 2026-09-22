'use client';

import { useState } from 'react';
import { Tabs, Form, Input, Switch, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import GeneralSettings from '@/components/settings/GeneralSettings';
import Appearance from '@/components/settings/Appearance';
import HeaderCarouselSettings from '@/components/settings/HeaderCarousel';
import ProfileComponentPage from '@/components/dashboardlayout/profile/Page';
import ChangePassword from '@/components/dashboardlayout/profile/ChangePassword';

const { TabPane } = Tabs;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (values: any) => {
    setLoading(true);
    console.log('Saving values...', values);
    message.success('Settings saved!');
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      <Tabs defaultActiveKey="general" type="card">
        {/* General Settings */}
        <TabPane tab="General Settings" key="general">
        <GeneralSettings />
        </TabPane>

        {/* Appearance Settings */}
        <TabPane tab="Appearance" key="appearance">
        <Appearance />
        </TabPane>

        <TabPane tab="Header Carousel" key="carousel">
          <Form layout="vertical" onFinish={handleSave}>
          <HeaderCarouselSettings />

            <Button type="primary" htmlType="submit" loading={loading}>
              Save Settings
            </Button>
          </Form>
        </TabPane>

        {/* Profile Settings */}
        <TabPane tab="Profile Settings" key="profile">
          <Form layout="vertical" onFinish={handleSave}>
          <ProfileComponentPage />

            <Button type="primary" htmlType="submit" loading={loading}>
              Save Profile Settings
            </Button>
          </Form>
        </TabPane>
        {/* Profile Settings */}
        <TabPane tab="Change Password" key="password">
          <Form layout="vertical" onFinish={handleSave}>
          <ChangePassword />

            {/* <Button type="primary" htmlType="submit" loading={loading}>
              Save Profile Settings
            </Button> */}
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
}
