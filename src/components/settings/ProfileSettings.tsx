import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

const ProfileSettings = () => {
  const [form] = Form.useForm<Profile>();
  const [loading, setLoading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Mock data for demonstration
    const mockProfile: Profile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      bio: 'A passionate developer.',
      profilePicture: '/images/default-profile.png',
    };
    form.setFieldsValue(mockProfile);
    setProfilePictureUrl(mockProfile.profilePicture);
    setLoading(false);
  }, [form]);

  const onFinish = (values: Profile) => {
    setLoading(true);
    const updatedProfile = { ...values, profilePicture: profilePictureUrl };
    console.log('Updated Profile:', updatedProfile);
    setTimeout(() => {
      message.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };

  const handleUploadChange = (info: { file: UploadFile }) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get the image URL from the response
      const imageUrl = info.file.response?.url || '';
      setProfilePictureUrl(imageUrl);
      setUploading(false);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>
      <div className="bg-white shadow-md rounded-md p-6">
        {loading ? (
          <p>Loading profile information...</p>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="mb-4 flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={profilePictureUrl || '/images/default-profile.png'}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              </div>
              <Form.Item name="profilePicture">
                <Upload
                  name="avatar"
                  action="/api/upload/profile"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={handleUploadChange}
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    {uploading ? 'Uploading' : 'Change Avatar'}
                  </Button>
                </Upload>
              </Form.Item>
            </div>

            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Please enter your first name!' }]}
            >
              <Input />
            </Form.Item>

            {/* ... other form items ... */}

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;