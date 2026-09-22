"use client";
import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

const AnnouncementSection: React.FC = () => {
  const announcements: Announcement[] = [
    {
      id: 1,
      title: 'New Feature: Watchlist!',
      content: 'You can now save cars to your watchlist and return to your favorite listings faster.',
      date: 'April 26, 2025',
    },
    {
      id: 2,
      title: 'Maintenance Scheduled',
      content: 'Our website will undergo scheduled maintenance on April 28th from 10 PM to 2 AM.',
      date: 'April 25, 2025',
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <Title level={3} className="mb-4">
        Announcements
      </Title>
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="mb-4">
          <Title level={4}>{announcement.title}</Title>
          <Paragraph>{announcement.content}</Paragraph>
          <small className="text-gray-500">{announcement.date}</small>
        </Card>
      ))}
    </div>
  );
};

export default AnnouncementSection;
