"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Upload,
  Modal,
  Card} from "antd";

import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setProductFormStep } from "@/Redux/Slices/productSlice";
import {PlusOutlined} from "@ant-design/icons";
import { productMedia } from "@/components/dashboardlayout/create-product/action/store";
import { HeaderCarouselMediaData, ISecondStepStoreAbleData } from "@/components/dashboardlayout/create-product/type/type";

const HeaderCarousel: React.FC = () => {
  const [form] = Form.useForm();
  const [mainPhotoFile, setMainPhotoFile] = useState<File | any>(null);
  const [enteriorPhotoFiles, setEnteriorPhotos] = useState<File[] | any>([]);
  const [exteriorPhotoFiles, setExteriorPhotos] = useState<File[] | any>([]);
  const [mechanicalPhotoFiles, setMechanicalPhotos] = useState<File[] | any>(
    []
  );
  const [otherPhotoFiles, setOtherPhotos] = useState<File[] | any>([]);
  const [docsPhotoFiles, setDocsPhotos] = useState<File[] | any>([]);

  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState(false);

  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(
    (state) => state.productReducer.setFormStep
  );

  // Retrieving items from localStorage
  useEffect(() => {
    const loadMedia = async () => {
      await productMedia.loadProductMediaFromLocalStorage(form, {
        mainPhoto: setMainPhotoFile,
        otherPhotos: setOtherPhotos,
        videoLinks: setVideoLinks,
      });
    };

    loadMedia();
  }, [form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data: HeaderCarouselMediaData = {
    mainPhotoFile,
    enteriorPhotoFiles,
    exteriorPhotoFiles,
    mechanicalPhotoFiles,
    otherPhotoFiles,
    docsPhotoFiles,
    videoLinks,
  };
  // Save to local storage whenever there’s a change
  useEffect(() => {
    productMedia.storeProductMediaToLocalStorage(data);
  }, [data, form]);

  const handlePreview = (file: any) => {
    setPreviewImage(file.thumbUrl || file.url || "");
    setPreviewVisible(true);
  };
  const handleMainPhotoChange = ({ fileList }: { fileList: File[] | any }) => {
    const newMainPhoto = fileList[0] || null;
    setMainPhotoFile(newMainPhoto);
  };

  const handleVideoLinksChange = (links: string[] | any) => {
    setVideoLinks(links);
  };

  const nextStep = () => {
    dispatch(setProductFormStep(currentStep + 1));
  };

  const uploadButton = (
    <button
      className="border-dotted border-2 border-gray-300 p-2 rounded-lg "
      type="button"
    >
      <PlusOutlined />
      <h3>Upload</h3>
    </button>
  );

  const handleChangePhotos = ({
    fileList,
    setFileList,
  }: {
    fileList: any[];
    setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  }) => {
    if (fileList.length <= 10) {
      setFileList(fileList);
    }
  };

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        nextStep();
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <div className="overflow-y-auto">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Card>
          <h1 className=" text-xl  font-bold pb-6">Header Carousel 01</h1>
          <div className="flex gap-10">
          <Form.Item
            name="mainPhoto"
            label="Main Photo"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="firstImage"
            label="First Image"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="thirdImage"
            label="Third Image"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>

            <Form.Item
              name="fourthImage"
              label="Fourth Image"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one document photo!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={exteriorPhotoFiles as any}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  handleChangePhotos({
                    fileList,
                    setFileList: setExteriorPhotos,
                  })
                }
                multiple
              >
                {exteriorPhotoFiles.length < 10 && uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              name="fifthImage"
              label="Fifth Image"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one document photo!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={exteriorPhotoFiles as any}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  handleChangePhotos({
                    fileList,
                    setFileList: setExteriorPhotos,
                  })
                }
                multiple
              >
                {exteriorPhotoFiles.length < 10 && uploadButton}
              </Upload>
            </Form.Item>
          </div>
        </Card>
        <Card>
          <h1 className=" text-xl  font-bold pb-6">Header Carousel 02</h1>
          <div className="flex gap-10">
          <Form.Item
            name="mainPhoto"
            label="Main Photo"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="firstImage"
            label="First Image"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="thirdImage"
            label="Third Image"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>

            <Form.Item
              name="fourthImage"
              label="Fourth Image"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one document photo!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={exteriorPhotoFiles as any}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  handleChangePhotos({
                    fileList,
                    setFileList: setExteriorPhotos,
                  })
                }
                multiple
              >
                {exteriorPhotoFiles.length < 10 && uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              name="fifthImage"
              label="Fifth Image"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one document photo!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={exteriorPhotoFiles as any}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  handleChangePhotos({
                    fileList,
                    setFileList: setExteriorPhotos,
                  })
                }
                multiple
              >
                {exteriorPhotoFiles.length < 10 && uploadButton}
              </Upload>
            </Form.Item>
          </div>
        </Card>
        <Card>
          <h1 className=" text-xl  font-bold pb-6">Header Carousel 03</h1>
          <div className="flex gap-10">
          <Form.Item
            name="mainPhoto"
            label="Main Photo"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="firstImage"
            label="First Image"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            name="thirdImage"
            label="Third Image"
            rules={[
              { required: true, message: "Please upload the main photo!" },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={mainPhotoFile ? [mainPhotoFile] : []}
              onPreview={handlePreview}
              onChange={handleMainPhotoChange}
              maxCount={1}
            >
              {!mainPhotoFile && uploadButton}
            </Upload>
          </Form.Item>

            <Form.Item
              name="fourthImage"
              label="Fourth Image"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one document photo!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={exteriorPhotoFiles as any}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  handleChangePhotos({
                    fileList,
                    setFileList: setExteriorPhotos,
                  })
                }
                multiple
              >
                {exteriorPhotoFiles.length < 10 && uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              name="fifthImage"
              label="Fifth Image"
              rules={[
                {
                  required: true,
                  message: "Please upload at least one document photo!",
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={exteriorPhotoFiles as any}
                onPreview={handlePreview}
                onChange={({ fileList }) =>
                  handleChangePhotos({
                    fileList,
                    setFileList: setExteriorPhotos,
                  })
                }
                multiple
              >
                {exteriorPhotoFiles.length < 10 && uploadButton}
              </Upload>
            </Form.Item>
          </div>
        </Card>
      </Form>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image
          src={previewImage}
          alt="Preview"
          layout="responsive"
          width={200}
          height={200}
        />
      </Modal>
    </div>
  );
};

export default HeaderCarousel;