import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Table, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/lib/upload/interface';

interface CarouselItem {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl?: string;
}

const HeaderCarouselSettings = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // In a real application, you would fetch existing carousel items here
    // For now, let's initialize with an empty array or some default data
    setCarouselItems([]);
  }, []);

  const handleAddSlide = () => {
    form.validateFields().then((values) => {
      const newItem: CarouselItem = {
        id: Date.now().toString(), // Simple unique ID
        imageUrl: values.imageUrl,
        altText: values.altText,
        linkUrl: values.linkUrl,
      };
      setCarouselItems([...carouselItems, newItem]);
      form.resetFields();
    });
  };

  const handleRemoveSlide = (id: string) => {
    setCarouselItems(carouselItems.filter((item) => item.id !== id));
  };

  const handleSaveSettings = () => {
    // In a real application, you would send the carouselItems data to your backend
    console.log('Saving carousel items:', carouselItems);
    message.success('Carousel settings saved!');
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text: string) => <img src={text} alt="Carousel Slide" className="max-w-xs max-h-20 object-contain" />,
    },
    {
      title: 'Alt Text',
      dataIndex: 'altText',
      key: 'altText',
    },
    {
      title: 'Link URL',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: string, record: CarouselItem) => (
        <Button danger onClick={() => handleRemoveSlide(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  const handleImageUpload = (info: { file: UploadFile }) => {
    if (info.file.status === 'done') {
      // Assuming your backend returns the URL of the uploaded image in the response
      const imageUrl = info.file.response?.url || '';
      form.setFieldsValue({ imageUrl });
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-semibold mb-4">Header Carousel Settings</h1>

      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-3">Add New Slide</h2>
        <Form form={form} layout="vertical">
          <Form.Item label="Image URL" name="imageUrl" rules={[{ required: true, message: 'Please enter the image URL' }]}>
            <Input />
          </Form.Item>

          {/* Alternatively, you can use an Upload component for image selection */}
          {/* <Form.Item label="Upload Image" name="uploadImage">
            <Upload
              name="image"
              action="/api/upload" // Replace with your upload API endpoint
              listType="picture"
              maxCount={1}
              onChange={handleImageUpload}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item> */}

          <Form.Item label="Alt Text" name="altText" rules={[{ required: true, message: 'Please enter the alt text' }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Link URL (Optional)" name="linkUrl">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleAddSlide}>
              Add Slide
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-medium mb-3">Current Slides</h2>
        <Table dataSource={carouselItems} columns={columns} rowKey="id" />
      </div>

      {carouselItems.length > 0 && (
        <div className="mt-6">
          <Button type="primary" size="large" onClick={handleSaveSettings}>
            Save Carousel Settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderCarouselSettings;