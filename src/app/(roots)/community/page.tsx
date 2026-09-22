"use client";
import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import AnnouncementSection from '@/components/Community/AnnouncementSection';
import DiscussionForum from '@/components/Community/DiscussionForum';
import SuccessStories from '@/components/Community/SuccessStories';
import HelpSection from '@/components/Community/HelpSection';


const { Content } = Layout;
const { Title } = Typography;

const CommunityPage: React.FC = () => {
  return (
    <Layout className="bg-gray-100 min-h-screen">
      <Content className="container mx-auto py-8 px-4 md:px-8">
        <Title level={2} className="text-center mb-6">
          Community
        </Title>

        <Space direction="vertical" size="large" className="w-full">
          <AnnouncementSection />
          <Divider />
          <DiscussionForum />
          <Divider />
          <SuccessStories />
          <Divider />
          <HelpSection />
        </Space>
      </Content>
    </Layout>
  );
};

export default CommunityPage;