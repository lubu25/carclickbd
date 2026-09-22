"use client";
import React from 'react';
import { Button, Card } from 'antd';
import { Typography } from 'antd';
import { Input } from 'antd';
import { CarOutlined, CheckCircleOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { siteContact } from '@/constants/siteContact';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const ShippingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <Title level={2} className="text-gray-800 dark:text-gray-200">carclickbd Shipping</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Buy on carclickbd - now with seamless shipping!
        </Paragraph>
      </div>

      <section className="mb-8">
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          CarClickBD is a vehicle marketplace for buyers and sellers, and we&apos;re excited to offer the
          best way to ship your new car directly to you! Whether you&apos;re shipping across town, from the other side of the
          country, or internationally, we&apos;re here to provide you with the smoothest shipping experience possible.
        </Paragraph>
      </section>

      <section className="mb-8">
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">Get an instant quote for your vehicle delivery!</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Simply enter your zip code and receive an instant quote for shipping your dream car directly to your door. There
          are no hidden fees, no hassles, and no surprises. Once you have finalized the purchase, choose between open or
          fully enclosed shipping options and finalize the order - and then relax!
        </Paragraph>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center">
          <Input
            placeholder="Enter Zip Code"
            className="w-full sm:w-64"
          />
          <Button type="primary">Get a Quote</Button>
        </div>
      </section>

      <section className="mb-8">
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">How carclickbd Shipping Works:</Title>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <Meta
              avatar={<CarOutlined className="text-blue-500 text-3xl mb-2" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Get an instant quote</Title>}
              description={<Paragraph className="text-gray-600 dark:text-gray-400">before you finalize the purchase</Paragraph>}
            />
          </Card>
          <Card className="shadow-md">
            <Meta
              avatar={<CheckCircleOutlined className="text-green-500 text-3xl mb-2" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Book online</Title>}
              description={<Paragraph className="text-gray-600 dark:text-gray-400">from your winner&apos;s page</Paragraph>}
            />
          </Card>
          <Card className="shadow-md">
            <Meta
              avatar={<CarOutlined className="text-green-500 text-3xl mb-2" />}
              title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Your car is delivered</Title>}
              description={<Paragraph className="text-gray-600 dark:text-gray-400">quickly &amp; safely</Paragraph>}
            />
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">Easy solutions, and expert support!</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Do you need to import your new car? Have a tight schedule? Need to meet somewhere outside of your
          neighborhood? Our support team can help you review available shipping options. Email us at <Text strong><MailOutlined className="mr-1" />{siteContact.email}</Text> for more information.
        </Paragraph>
      </section>

      <section>
        <Title level={3} className="mb-4 text-gray-700 dark:text-gray-300">Here are a few more reasons why you should book your vehicle
          transportation via carclickbd Shipping:</Title>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <Text strong>Seamless Integration:</Text> carclickbd Shipping is powered by the best-in-class automotive transport
            company to deliver a seamless, integrated shipping experience. From initial quote through vehicle delivery,
            every aspect of your shipment is fully integrated into your carclickbd portal.
          </li>
          <li>
            <Text strong>Real-time updates:</Text> You&apos;ll receive an estimated time of arrival (ETA) as soon as you book your
            shipment through carclickbd. Updates are automatically shown on your winner&apos;s page as your new car is
            scheduled for pickup, in transit, and delivered.
          </li>
          <li>
            <Text strong>Friendly and knowledgeable service:</Text> Our team will reach out to you immediately after your shipment
            is booked to confirm any specific details of your shipment. You&apos;ll then hear from us periodically, updating you
            on your shipment&apos;s progress. If you have any questions, email {siteContact.email} or WhatsApp {siteContact.whatsapp}.
          </li>
          <li>
            <Text strong>Fully insured and modern fleet:</Text> Whether you choose an open or enclosed carrier, you can rest assured that
            your car will arrive safely. See our shipping terms and conditions for more information.
          </li>
          <li>
            <Text strong>Transparent pricing:</Text> With carclickbd Shipping, the price you see is the price you pay. Unlike many shipping
            companies, we quote accurate and fair prices to ensure that your car is delivered in a timely manner. We will
            never ask you for more money to complete your shipment.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ShippingPage;
