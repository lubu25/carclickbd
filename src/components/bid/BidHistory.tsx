"use client";
import React from "react";
import { Card, List, Avatar, Typography, Tag } from "antd";
import moment from "moment";
import { useGetSpecificProductBidsQuery } from "@/Redux/features/bids/bidsApi";
import ProductCommentsSkeleton from "@/components/product/skeleton/ProductCommentSkeleton";
import { getMediaUrl } from "@/utils/media";

const { Text } = Typography;

type BidHistoryProps = {
  productId: string;
};

const BidHistory: React.FC<BidHistoryProps> = ({ productId }) => {
  const { data, isLoading } = useGetSpecificProductBidsQuery(productId, {
    skip: !productId,
    pollingInterval: 2000,
  });

  const bids = data?.data || [];

  const allBids = [...bids].sort(
    (a, b) => parseFloat(b.bidAmount) - parseFloat(a.bidAmount)
  );

  return (
    <Card title="Bid History" className="overflow-y-auto max-h-[70vh]">
      {isLoading ? (
        <ProductCommentsSkeleton />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={allBids}
          renderItem={(bid, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={getMediaUrl(bid?.buyer?.profilePhoto)} />}
                title={
                  <div className="flex justify-between items-center">
                    <span>{bid?.buyer?.email}</span>
                    {index === 0 && <Tag color="green">Highest</Tag>}
                  </div>
                }
                description={
                  <div>
                    <Text strong>${bid?.bidAmount}</Text>
                    <Text className="block text-xs text-gray-500">
                      {moment(bid?.createdAt).fromNow()}
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

export default BidHistory;
