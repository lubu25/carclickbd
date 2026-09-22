import React from "react";
import { Col, Image, Modal, Row, Tag } from "antd";
import { IProduct } from "@/Interface/product";
import dayjs from "dayjs";
import AuctionNavBar from "../product/AuctionNavbar";
import VehicleDetailsTable from "../product/CarDetailsTable";
import CommentsSection from "../product/CommentsSection";
import { getMediaUrl } from "@/utils/media";

interface ProductDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  product: IProduct | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  visible,
  onClose,
  product,
}) => {
  if (!product) return null;

  const allImages = [
    ...(product.photos?.mainPhoto ? [product.photos.mainPhoto] : []),
    ...(product.photos?.others || []),
  ];

  return (
    <Modal
      title={`Product Details - ${product.title}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div className="space-y-4">
      <Row gutter={[16, 16]}>
          {allImages.length > 0 ? (
            <Col span={24}>
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((url, index) => (
                  <div key={index} className="overflow-hidden rounded-md shadow-sm">
                    <Image
                      src={getMediaUrl(url)}
                      alt={`product-image-${index}`}
                      className="w-full h-64 object-cover cursor-pointer transition-transform duration-200 transform hover:scale-105"
                      preview={{ maskClassName: "bg-black/50" }}
                    />
                  </div>
                ))}
              </div>
            </Col>
          ) : (
            <Col span={24}>
              <p className="text-gray-500 italic">No images available.</p>
            </Col>
          )}
        </Row>
        <div>
          <AuctionNavBar product={product}/>
          <VehicleDetailsTable vehicle={product} />
          <CommentsSection comments={product?.comments} />
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailsModal;
