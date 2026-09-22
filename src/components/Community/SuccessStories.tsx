"use client";
import React from 'react';
import { Card, Typography, Avatar } from 'antd';

const { Title, Paragraph } = Typography;

interface SuccessStory {
  id: number;
  user: string;
  testimonial: string;
  car: string;
}

const SuccessStories: React.FC = () => {
  const stories: SuccessStory[] = [
    {
      id: 1,
      user: 'BuyerX',
      testimonial: 'I found my dream vintage car on this platform! The process was smooth and the community was helpful with my questions.',
      car: '1967 Ford Mustang',
    },
    {
      id: 2,
      user: 'SellerY',
      testimonial: 'Sold my truck quickly and at a great price. The clear listing format brought serious buyer inquiries.',
      car: '2018 Toyota Tacoma',
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <Title level={3} className="mb-4">
        Success Stories
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <Card key={story.id}>
            <div className="flex items-center mb-2">
              <Avatar size="small" />
              <span className="ml-2 font-semibold">{story.user}</span>
            </div>
            <Paragraph>{story.testimonial}</Paragraph>
            <small className="text-gray-500">Car: {story.car}</small>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
