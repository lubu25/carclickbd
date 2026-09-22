"use client";
import React, { useState } from 'react';
import { Card, Typography, Input, Button, List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

interface Reply {
  author: string;
  content: string;
  date: string;
}

interface Discussion {
  id: number;
  author: string;
  content: string;
  replies: Reply[];
  date: string;
}

const DiscussionForum: React.FC = () => {
  const [newComment, setNewComment] = useState<string>('');
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: 1,
      author: 'CarLover123',
      content: 'What should buyers check first when comparing classic muscle car listings?',
      replies: [
        { author: 'GearHead', content: 'I\'m particularly interested in the Mustang!', date: 'Yesterday' },
      ],
      date: '2 days ago',
    },
    // ... more discussions
  ]);

  const handlePostComment = () => {
    if (newComment.trim()) {
      const newDiscussion: Discussion = {
        id: Date.now(),
        author: 'CurrentUser', // Replace with actual user
        content: newComment,
        replies: [],
        date: 'Just now',
      };
      setDiscussions([newDiscussion, ...discussions]);
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <Title level={3} className="mb-4">
        Discussion Forum
      </Title>

      <div className="mb-4">
        <TextArea
          rows={4}
          placeholder="Share your thoughts or ask a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="primary" className="mt-2" onClick={handlePostComment}>
          Post
        </Button>
      </div>

      <List<Discussion>
        itemLayout="horizontal"
        dataSource={discussions}
        renderItem={(item) => (
            <List<Discussion>
            itemLayout="horizontal"
            dataSource={discussions}
            renderItem={(item) => (
              <li className="mb-4">
                {/* <Comment
                  author={<a href="#user">{item.author}</a>}
                  avatar={<Avatar icon={<UserOutlined />} />}
                  content={<p>{item.content}</p>}
                  datetime={<span>{item.date}</span>}
                >
                  {item.replies.length > 0 && (
                    <List<Reply>
                      className="ml-8"
                      header={`${item.replies.length} Replies`}
                      itemLayout="horizontal"
                      dataSource={item.replies}
                      renderItem={(reply) => (
                        <li>
                          <Comment
                            author={<a href="#user">{reply.author}</a>}
                            avatar={<Avatar icon={<UserOutlined />} />}
                            content={<p>{reply.content}</p>}
                            datetime={<span>{reply.date}</span>}
                          />
                        </li>
                      )}
                    />
                  )}
                </Comment> */}
              </li>
            )}
          />
        )}
      />
    </div>
  );
};

export default DiscussionForum;
