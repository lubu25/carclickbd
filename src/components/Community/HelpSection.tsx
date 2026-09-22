"use client"
import React from 'react';
import { Typography, Collapse } from 'antd';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface FAQItem {
  key: string;
  title: string;
  content: string;
}

const HelpSection: React.FC = () => {
  const faqData: FAQItem[] = [
    {
      key: '1',
      title: 'How do I contact a seller?',
      content: 'Open the car listing you are interested in and use the contact or inquiry option. CarClickBD helps keep buyer and seller communication clear before you decide to inspect or purchase.',
    },
    {
      key: '2',
      title: 'What should I check before buying?',
      content: 'Review the listing photos, specifications, mileage, chassis information, ownership documents, and vehicle condition. Always inspect the car before making a payment.',
    },
    {
      key: '3',
      title: 'How do I sell my car?',
      content: 'Create a seller account, add accurate vehicle details, upload clear photos, and submit the listing. New listings are reviewed before they go live.',
    },
    // ... more FAQ items
  ];

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <Title level={3} className="mb-4">
        Help & FAQ
      </Title>
      <Collapse accordion>
        {faqData.map((item) => (
          <Panel header={item.title} key={item.key}>
            <Paragraph>{item.content}</Paragraph>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default HelpSection;
