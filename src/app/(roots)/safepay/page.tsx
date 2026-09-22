"use client";
import React from 'react';
import { Button, Card, Typography } from 'antd';
import { CheckCircleOutlined, ArrowRightOutlined, CarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const SafePayPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 inline-flex items-center rounded-full bg-blue-50 px-5 py-2 text-lg font-semibold text-blue-700">
          carclickbd SafePay
        </div>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Buy or sell on carclickbd easily and safely.
        </Paragraph>
      </div>

      <section className="mb-8">
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Managing payment, documentation, and title transfer can be a hassle. carclickbd SafePay is designed to help
          buyers and sellers complete vehicle transactions with clearer steps, payment tracking, and document support.
        </Paragraph>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
          Get started after you agree on a vehicle purchase.
        </Paragraph>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Simply tap the SafePay button on your buyer or seller page to get the transaction started. If you don&apos;t see a
          SafePay option, contact support before sending funds or documents.
        </Paragraph>
      </section>

      <section className="mb-8">
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">How SafePay Works:</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <Meta
              avatar={<CheckCircleOutlined className="text-green-500 text-3xl mb-2" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buyer &amp; Seller complete information</Title>}
            />
          </Card>
          <Card className="shadow-md">
            <Meta
              avatar={<ArrowRightOutlined className="text-blue-500 text-3xl mb-2" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Buyer sends payment to SafePay</Title>}
            />
          </Card>
          <Card className="shadow-md">
            <Meta
              avatar={<CarOutlined className="text-green-500 text-3xl mb-2" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Seller gets paid by direct deposit or check</Title>}
            />
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">Here are a few more reasons to use SafePay:</Title>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Clear transaction steps help both sides understand what is required before completion.</li>
          <li>Payment and document status can be tracked from one place.</li>
          <li>Support is available if either side has a question during the process.</li>
          <li>Buyers and sellers should always verify final terms before releasing funds or vehicle documents.</li>
        </ul>
      </section>

      <section>
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">Have questions?</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400">
          Check the help center or contact us at <a href="mailto:safepay@carclickbd.com" className="text-blue-600 dark:text-blue-400">safepay@carclickbd.com</a> any time.
        </Paragraph>
      </section>
    </div>
  );
};

export default SafePayPage;
