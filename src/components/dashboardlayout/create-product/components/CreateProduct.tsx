"use client";

import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row, Spin, message } from "antd";
import { useRouter } from "next/navigation";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/Redux/api/productApi";
import BasicInfoSection from "./BasicInfoSection";
import AccessoriesSection from "./AccessoriesSection";
import FeatureTagsSection from "./FeatureTagsSection";
import InternalNoteSection from "./InternalNoteSection";
import LocationSection from "./LocationSection";
import MediaSection from "./MediaSection";
import PricingSection from "./PricingSection";
import StatusSection from "./StatusSection";
import VehicleDetailsSection from "./VehicleDetailsSection";
import { getMediaUrl } from "@/utils/media";

type ProductCreateFormProps = {
  productId?: string;
};

const toUploadFile = (url: string, index: number, prefix: string) => ({
  uid: `${prefix}-${index}`,
  name: `${prefix}-${index + 1}`,
  status: "done",
  url: getMediaUrl(url),
  responseUrl: url,
});

const createStockNumber = (values: any) => {
  const maker = String(values.make || "CAR").replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase();
  const model = String(values.model || "BD").replace(/[^a-z0-9]/gi, "").slice(0, 3).toUpperCase();
  const suffix = Date.now().toString().slice(-6);

  return `CCBD-${maker}${model}-${suffix}`;
};

const firstValue = (...values: any[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const firstPriceValue = (...values: any[]) => {
  const pricedValue = values.find((value) => {
    if (value === undefined || value === null || value === "") return false;
    return Number(value) > 0;
  });

  return pricedValue ?? firstValue(...values);
};

const matchSelectValue = (value: any, options: string[]) => {
  if (value === undefined || value === null || value === "") return value;
  const normalizedValue = String(value).replace(/[^a-z0-9]/gi, "").toLowerCase();
  return (
    options.find(
      (option) =>
        option.replace(/[^a-z0-9]/gi, "").toLowerCase() === normalizedValue
    ) || value
  );
};

const fuelTypeOptions = [
  "Petrol",
  "Octane",
  "Diesel",
  "Hybrid",
  "Electric",
  "EV",
  "HEV",
  "CNG",
  "LPG",
];
const transmissionOptions = ["Automatic", "Manual"];
const driveTypeOptions = ["4WD", "2WD"];
const steeringOptions = ["LEFT", "RIGHT", "OTHER"];
const bodyTypeOptions = [
  "Sedan",
  "SUV",
  "Coupe",
  "Convertible",
  "SUV/Crossover",
  "Van/Minivan",
  "Truck",
  "Hatchback",
  "Wagon",
];
const conditionOptions = [
  "New",
  "Reconditioned",
  "Local Used",
  "Pre Owned",
  "Used",
];

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({ productId }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const isEditMode = Boolean(productId);
  const [autoStockNumber] = useState(() => createStockNumber({}));
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [mainPhotoFile, setMainPhotoFile] = useState<any>(null);
  const [otherPhotoFiles, setOtherPhotoFiles] = useState<any[]>([]);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: productResponse, isLoading: isProductLoading } =
    useGetProductByIdQuery(productId as string, { skip: !productId });

  useEffect(() => {
    const product = productResponse?.data;
    if (!product) return;

    form.setFieldsValue({
      ...product,
      make: product.make || product.maker,
      model: product.model || product.carName || product.car_name,
      productionYear: product.productionYear || product.year || product.launchingYear,
      registrationYear: product.registrationYear,
      stockNumber: product.stockNumber || product.referenceNumber,
      mainPrice: firstPriceValue(
        product.mainPrice,
        product.price,
        product.fixedPrice,
        product.salePrice,
        product.askingPrice,
        product.highestBid,
        product.minBid
      ),
      engine: firstValue(
        product.engine,
        product.engineCc,
        product.engineCC,
        product.engineSize,
        product.engineCapacity
      ),
      modelCode: firstValue(product.modelCode, product.model_code),
      fuelType: matchSelectValue(product.fuelType || product.fuel, fuelTypeOptions),
      transmission: matchSelectValue(product.transmission, transmissionOptions),
      drivetrain: matchSelectValue(
        product.drivetrain || product.driveType || product.drive,
        driveTypeOptions
      ),
      steering: matchSelectValue(
        product.steering || product.steeringType,
        steeringOptions
      ),
      seats: product.seats || product.seatCount,
      bodyStyle: matchSelectValue(
        product.bodyStyle || product.bodyType || product.body,
        bodyTypeOptions
      ),
      color: product.color || product.exteriorColor,
      vin: product.vin || product.vinChassisNumber,
      condition: matchSelectValue(product.condition, conditionOptions),
      featuresAndOptions:
        product.featuresAndOptions || product.equipment || product.highlights,
      accessories: product.accessories || product.optionsList,
      optionsText: product.optionsText || product.options || product.additionalOptions,
      internalNote: product.internalNote || product.adminNote,
      videoLinks: product.videos || [],
      status: product.status || (product.isDraft ? "pending" : "approval"),
    });

    if (product.photos?.mainPhoto) {
      const mainPhoto = toUploadFile(product.photos.mainPhoto, 0, "main-photo");
      setMainPhotoFile(mainPhoto);
      form.setFieldsValue({ mainPhoto: [mainPhoto] });
    }
    if (product.photos?.others?.length) {
      const otherPhotos = product.photos.others.map((url: string, index: number) =>
        toUploadFile(url, index, "other-photo")
      );
      setOtherPhotoFiles(otherPhotos);
      form.setFieldsValue({ otherPhotos });
    }
    setVideoLinks(product.videos || []);
  }, [form, productResponse]);

  const handlePreview = (file: any) => {
    setPreviewImage(file.thumbUrl || getMediaUrl(file.url) || "");
    setPreviewVisible(true);
  };

  const buildProductData = (values: any) => {
    const productValues = { ...values };
    delete productValues.mainPhoto;
    delete productValues.otherPhotos;
    delete productValues.videoLinks;
    const productionYear = values.productionYear || values.year;
    const resolvedMake = values.make?.trim();
    const resolvedModel = values.model?.trim();
    const referenceNumber =
      values.stockNumber ||
      values.referenceNumber ||
      autoStockNumber ||
      createStockNumber(values);
    const generatedTitle = [
      productionYear,
      resolvedMake,
      resolvedModel,
      values.grade,
    ]
      .filter(Boolean)
      .join(" ");
    const title = values.title?.trim() || generatedTitle;

    const status = values.status || "pending";

    return {
      ...productValues,
      make: resolvedMake,
      model: resolvedModel,
      title,
      maker: resolvedMake,
      year: productionYear,
      launchingYear: productionYear,
      productionYear,
      registrationYear: values.registrationYear,
      stockNumber: referenceNumber,
      referenceNumber,
      engineSize: values.engine,
      engineCc: values.engine,
      engineCC: values.engine,
      modelCode: values.modelCode,
      driveType: values.drivetrain,
      steering: values.steering,
      steeringType: values.steering,
      seats: values.seats,
      seatCount: values.seats,
      bodyType: values.bodyStyle,
      exteriorColor: values.color,
      vinChassisNumber: values.vin,
      price: values.mainPrice,
      featuresOptions: values.featuresAndOptions,
      accessories: values.accessories,
      optionsList: values.accessories,
      optionsText: values.optionsText,
      options: values.optionsText,
      additionalOptions: values.optionsText,
      internalNote: values.internalNote,
      adminNote: values.internalNote,
      equipment: values.featuresAndOptions,
      highlights: values.featuresAndOptions,
      videos: videoLinks,
      existingMainPhoto: mainPhotoFile?.responseUrl,
      existingOtherPhotos: otherPhotoFiles
        .filter((file: any) => !(file?.originFileObj || file?.file))
        .map((file: any) => file?.responseUrl || file?.url)
        .filter(Boolean),
      status,
      isDraft: status === "pending",
      isSoldOut: status === "sold" || status === "reserve",
    };
  };

  const appendPhotos = (formData: FormData) => {
    const main =
      mainPhotoFile?.originFileObj || mainPhotoFile?.file || mainPhotoFile;
    if (main instanceof File) {
      formData.append("mainPhoto", main);
    }

    otherPhotoFiles.forEach((file: any) => {
      const actual = file?.originFileObj || file?.file || null;
      if (actual instanceof File) {
        formData.append("others", actual);
      }
    });
  };

  const requiredFields = [
    ["productionYear", "Production Year"],
    ["mainPrice", "Price"],
    ["mileage", "Mileage"],
    ["engine", "Engine CC"],
    ["fuelType", "Fuel Type"],
    ["transmission", "Transmission"],
    ["drivetrain", "Drive Type"],
    ["bodyStyle", "Body Type"],
    ["color", "Color"],
    ["condition", "Condition"],
  ];

  const hasMissingRequiredFields = (values: any) => {
    const missing = requiredFields.filter(([field]) => {
      const value = values[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length) {
      const [field, label] = missing[0];
      message.error(`${label} is required.`);
      form.scrollToField(field, { behavior: "smooth", block: "center" });
      return true;
    }

    return false;
  };

  const onFinish = async (values: any) => {
    try {
      if (hasMissingRequiredFields(values)) {
        return;
      }

      if (!mainPhotoFile) {
        message.error("Main photo is required!");
        return;
      }
      if (!otherPhotoFiles.length) {
        message.error("Please upload at least one other photo!");
        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(buildProductData(values)));
      appendPhotos(formData);

      const res = isEditMode
        ? await updateProduct({ id: productId, data: formData }).unwrap()
        : await createProduct(formData).unwrap();

      if (res?.statusCode === 201 || res?.statusCode === 200 || res?.success) {
        message.success(
          isEditMode
            ? "Product updated successfully."
            : "Product created successfully."
        );
        form.resetFields();
        setMainPhotoFile(null);
        setOtherPhotoFiles([]);
        setVideoLinks([]);
        router.back();
      } else {
        message.error(res?.message || "Failed to save product");
      }
    } catch (err: any) {
      console.error(err);
      message.error(err?.data?.message || "Failed to save product");
    }
  };

  if (isEditMode && isProductLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded bg-white">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="rounded bg-white p-4 sm:p-6"
        initialValues={{ status: "pending", stockNumber: autoStockNumber }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <BasicInfoSection />
            <PricingSection />
            <VehicleDetailsSection />
            <LocationSection />
            <FeatureTagsSection />
          </Col>

          <Col xs={24} lg={8}>
            <MediaSection
              onPreview={handlePreview}
              mainPhotoFile={mainPhotoFile}
              setMainPhotoFile={setMainPhotoFile}
              otherPhotoFiles={otherPhotoFiles}
              setOtherPhotoFiles={setOtherPhotoFiles}
              videoLinks={videoLinks}
              setVideoLinks={setVideoLinks}
            />
            <StatusSection />
            <AccessoriesSection />
            <InternalNoteSection />
          </Col>
        </Row>

        <div className="mt-8 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading || isUpdating}
            className="h-12 w-full px-8 sm:w-auto"
          >
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </Form>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="min(92vw, 720px)"
      >
        <Image
          src={previewImage || "/placeholder.png"}
          alt="Preview"
          width={680}
          height={400}
          className="h-auto w-full"
        />
      </Modal>
    </>
  );
};

export default ProductCreateForm;
