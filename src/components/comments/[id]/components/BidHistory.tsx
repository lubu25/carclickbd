"use client";

import React from "react";
import { Card, List, Avatar, Typography, Tag } from "antd";
import moment from "moment";
import ProductCommentsSkeleton from "@/components/product/skeleton/ProductCommentSkeleton";
import { useGetAllCommentsOnProductQuery } from "@/Redux/features/comment/commentApi";
import { getMediaUrl } from "@/utils/media";

const { Text } = Typography;

type CommentsHistoryProps = {
  productId: string;
};

const CommentsHistory: React.FC<CommentsHistoryProps> = ({ productId }) => {
  const { data, isLoading } = useGetAllCommentsOnProductQuery(productId, {
    skip: !productId,
    pollingInterval: 2000,
  });

  const comments = data?.data || [];

  return (
    <Card
      title="Comments"
      className="md:col-span-1 h-[85vh] sticky top-0 overflow-y-auto"
    >
      {isLoading ? (
        <ProductCommentsSkeleton />
        
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(comment: any) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={getMediaUrl(comment?.user?.profilePhoto)} />}
                title={
                  <div className="flex justify-between items-center">
                    <span>
                      {comment?.user?.name || "Anonymous"}
                    </span>
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
      )}
    </Card>
  );
};

export default CommentsHistory;
