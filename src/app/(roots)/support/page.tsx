/* eslint-disable react/no-unescaped-entities */
"use client";
import React from 'react';
import { Button, Card, Typography } from 'antd';
import {  } from 'antd';
import {
  QuestionCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  // MessageCircleOutlined, // Removed MessageCircleOutlined
  WechatOutlined, // Replaced with WechatOutlined
  YoutubeOutlined,
  FacebookFilled,
  InstagramFilled,
  TwitterOutlined
} from '@ant-design/icons';
import { getWhatsAppUrl, siteContact } from '@/constants/siteContact';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const SupportPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <Title level={1} className="text-gray-800 dark:text-gray-200">Support</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Need help? We're here for you.
        </Paragraph>
      </div>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Frequently Asked Questions</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Check out our FAQs for quick answers to common questions:
        </Paragraph>
        <Button type="primary" size="large" href="/faq">
          <QuestionCircleOutlined className="mr-2" />
          Visit the FAQ
        </Button>
      </section>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Contact Us</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          If you couldn't find an answer in the FAQs, here are several ways to get in touch:
        </Paragraph>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <Meta
              avatar={<MailOutlined className="text-blue-500 text-3xl mb-4" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Email</Title>}
              description={
                <Paragraph className="text-gray-600 dark:text-gray-400">
                  For general inquiries: <a href={`mailto:${siteContact.email}`} className="text-blue-600 dark:text-blue-400">{siteContact.email}</a>
                  <br />
                  For shipping questions: <a href={`mailto:${siteContact.email}`} className="text-blue-600 dark:text-blue-400">{siteContact.email}</a>
                </Paragraph>
              }
            />
          </Card>

          <Card className="shadow-md">
            <Meta
              avatar={<PhoneOutlined className="text-green-500 text-3xl mb-4" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Phone</Title>}
              description={
                <Paragraph className="text-gray-600 dark:text-gray-400">
                  Contact our support team on WhatsApp: {siteContact.whatsapp}.
                  <br />
                  Dhaka office support hours apply.
                </Paragraph>
              }
            />
          </Card>

          <Card className="shadow-md">
            <Meta
              avatar={<WechatOutlined className="text-purple-500 text-3xl mb-4" />} // Changed to Wechat
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Live Chat</Title>}
              description={
                <Paragraph className="text-gray-600 dark:text-gray-400">
                  Chat with a support agent instantly on WhatsApp.
                  <br />
                  <a href={getWhatsAppUrl()} className="text-blue-600 dark:text-blue-400">Start WhatsApp chat</a>
                </Paragraph>
              }
            />
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Social Media</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 mb-6">
          Connect with us on social media for the latest updates, announcements, and community discussions:
        </Paragraph>
        <div className="flex justify-center gap-6">
          <a href="#" className="text-[#003399] hover:text-[#f0b90b] transition-colors" aria-label="YouTube">
            <YoutubeOutlined className="text-3xl" />
          </a>
          <a href="https://facebook.com/CarClickBD" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Facebook">
            <FacebookFilled className="text-3xl" />
          </a>
          <a href="#" className="text-pink-500 hover:text-pink-700 transition-colors" aria-label="Instagram">
            <InstagramFilled className="text-3xl" />
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors" aria-label="Twitter">
            <TwitterOutlined className="text-3xl" />
          </a>
        </div>
      </section>

      <section>
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Mailing Address</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400">
          {siteContact.company}
          <br />
          {siteContact.addressLines[0]}
          <br />
          {siteContact.addressLines[1]}
          <br />
          Email: {siteContact.email}
          <br />
          WhatsApp: {siteContact.whatsapp}
        </Paragraph>
      </section>
    </div>
  );
};

export default SupportPage;
