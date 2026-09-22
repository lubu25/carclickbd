"use client";

import React from "react";
import { List, Avatar, Typography } from "antd";
import moment from "moment";
import ProductCommentsSkeleton from "@/components/product/skeleton/ProductCommentSkeleton";
import { useGetAllCommentsOnProductQuery } from "@/Redux/features/comment/commentApi";
import { getMediaUrl } from "@/utils/media";

const { Text } = Typography;

type ProductCommentsProps = {
  productId: string;
};

const ProductCommentModal: React.FC<ProductCommentsProps> = ({ productId }) => {
  const { data, isLoading } = useGetAllCommentsOnProductQuery(productId, {
    skip: !productId,
    pollingInterval: 2000,
  });

  const comments = data?.data || [];

  if (isLoading) return <ProductCommentsSkeleton />;
  if (comments.length === 0) return <p>No comments found.</p>;

  return (
    <List
      itemLayout="horizontal"
      dataSource={comments}
      renderItem={(comment: any) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={getMediaUrl(comment?.user?.profilePhoto)} />}
            title={
              <div className="flex justify-between items-center">
                <span>{comment?.user?.name || "Anonymous"}</span>
              </div>
            }
            description={
              <div>
                <Text strong>{comment?.comment}</Text>
                <Text className="block text-[10px] text-gray-500">
                  {moment(comment.createdAt).fromNow()}
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default ProductCommentModal;
