"use client";
import React from "react";
import { Card, Form, Upload, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface MediaSectionProps {
  onPreview: (file: any) => void;
  mainPhotoFile: any;
  setMainPhotoFile: React.Dispatch<React.SetStateAction<any>>;
  otherPhotoFiles: any[];
  setOtherPhotoFiles: React.Dispatch<React.SetStateAction<any[]>>;
  videoLinks: string[];
  setVideoLinks: React.Dispatch<React.SetStateAction<string[]>>;
}

const FILE_LIMITS = {
  MAIN_PHOTO: 1,
  OTHER_PHOTOS: 40,
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MediaSection: React.FC<MediaSectionProps> = ({
  onPreview,
  mainPhotoFile,
  setMainPhotoFile,
  otherPhotoFiles,
  setOtherPhotoFiles,
  videoLinks,
  setVideoLinks,
}) => {
  const uploadButton = (
    <button
      type="button"
      className="border-dotted border-2 border-gray-300 p-2 rounded-lg"
    >
      <PlusOutlined />
      <h3>Upload</h3>
    </button>
  );

  const validateImageBeforeUpload = (file: File) => {
    const isAllowedType = ALLOWED_IMAGE_TYPES.includes(file.type);
    if (!isAllowedType) {
      message.error("Only JPG, PNG, or WebP images are allowed.");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleMainPhotoChange = ({ fileList }: { fileList: any[] }) => {
    const newMainPhoto = fileList[0] || null;
    setMainPhotoFile(newMainPhoto);
  };

  const handleOtherPhotosChange = ({ fileList }: { fileList: any[] }) => {
    if (fileList.length <= FILE_LIMITS.OTHER_PHOTOS) {
      setOtherPhotoFiles(fileList);
    }
  };

  return (
    <Card title="Media" className="shadow-md mb-4">
      {/* Main Photo */}
      <Form.Item
        name="mainPhoto"
        label="Main photo (only one)"
        rules={[
          {
            validator: () =>
              mainPhotoFile
                ? Promise.resolve()
                : Promise.reject(new Error("Please upload the main photo")),
          },
        ]}
      >
        <Upload
          listType="picture-card"
          fileList={mainPhotoFile ? [mainPhotoFile] : []}
          onPreview={onPreview}
          onChange={handleMainPhotoChange}
          beforeUpload={validateImageBeforeUpload}
          maxCount={1}
        >
          {!mainPhotoFile && uploadButton}
        </Upload>
      </Form.Item>

      {/* Other Photos */}
      <Form.Item
        name="otherPhotos"
        label="Others Photos (up to 40)"
        rules={[
          {
            validator: () =>
              otherPhotoFiles.length
                ? Promise.resolve()
                : Promise.reject(
                    new Error("Please upload at least one other photo"),
                  ),
          },
        ]}
      >
        <Upload
          listType="picture-card"
          fileList={otherPhotoFiles}
          onPreview={onPreview}
          beforeUpload={validateImageBeforeUpload}
          onChange={handleOtherPhotosChange}
          multiple
          maxCount={FILE_LIMITS.OTHER_PHOTOS}
        >
          {otherPhotoFiles.length < FILE_LIMITS.OTHER_PHOTOS && uploadButton}
        </Upload>
      </Form.Item>

      {/* Video Links */}
      <Form.Item name="videoLinks" label="Video Links (YouTube)">
        <Select
          mode="tags"
          placeholder="Paste YouTube URLs and press Enter"
          tokenSeparators={[]}
          onChange={(links) => setVideoLinks(links as string[])}
          value={videoLinks}
        />
      </Form.Item>
    </Card>
  );
};

export default MediaSection;
