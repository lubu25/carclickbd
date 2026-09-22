"use client";

import React from "react";
import { Card, Typography, Button } from "antd";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import EndBidTimer from "@/components/product/EndBidTimer";
import { useGetProductByIdQuery } from "@/Redux/api/productApi";
import LiveProductSkeleton from "./LiveProductSkeleton";
import { getMediaUrl } from "@/utils/media";
// import { getHighestOrMinimumBid } from "@/utils/getHighestOrMinimumBid";

const { Title, Text } = Typography;
const LiveAuctionProduct = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id, { skip: !id });
  const product = data?.data || [];
  const router = useRouter();

  return (
    <>
      {isLoading ? (
        <LiveProductSkeleton />
      ) : (
        <Card className="md:col-span-2">
          <Image
            width={200}
            height={200}
            src={getMediaUrl(product?.photos?.mainPhoto)}
            alt="Car"
            className="w-full h-full object-cover rounded-lg mb-4"
          />
          <div className="flex items-center justify-between">
            <Title level={3}>{product?.title}</Title>
            <EndBidTimer product={product} />
          </div>

          {/* <Text className="block ">
            Current Offer:{" "}
            <span className="text-primary font-bold !text-[20px]">
              ${getHighestOrMinimumBid(product?.bidInfo)}
            </span>
          </Text> */}
          <Button
            type="primary"
            size="large"
            className="w-full mt-5"
            onClick={() => router.push(`/auction-details/${product?._id}`)}
          >
            See details
          </Button>
        </Card>
      )}
    </>
  );
};

export default LiveAuctionProduct;
