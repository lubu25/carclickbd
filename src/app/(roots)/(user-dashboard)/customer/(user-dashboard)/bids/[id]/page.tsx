"use client";
import React, { useState } from "react";
import { Row, Col, Card, Input } from "antd";
import { useGetProductByIdQuery } from "@/Redux/api/productApi";
import BidsTable from "./BidsTable";
import { useParams } from "next/navigation";
import { useGetSpecificProductBidsQuery } from "@/Redux/features/bids/bidsApi";
import dayjs from "dayjs";
import { FaDollarSign } from "react-icons/fa6";
import { RiAuctionFill } from "react-icons/ri";
import { TbCalendarTime } from "react-icons/tb";
import { MdArrowBack } from "react-icons/md";
import { RiAuctionLine } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import StatsCard from "@/components/table/StatsCard";

const ProductBids: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");

  const { data, isLoading: isProductDetailsLoading } =
    useGetProductByIdQuery(id);

  const product = data?.data || {};
  const { data: bids, isLoading } = useGetSpecificProductBidsQuery(id);

  const bidData = bids?.data || [];

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="p-4 space-y-6">
     
      <Card className="shadow-md rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-500">{product.title}</h1>
          <div className="w-full max-w-lg">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 text-lg border rounded-lg"
            />
          </div>
        </div>
      </Card>
      <Row gutter={16}>
        <Col span={6} xs={12} md={8} lg={6} className="mb-4">
          <StatsCard
            title="Total Inquiries"
            value={bidData.length || 0}
            icon={<RiAuctionFill  />}
            bgColor="bg-white"
            textColor="text-green-500"
          />
        </Col>
        <Col span={6} xs={12} md={8} lg={6} className="mb-4">
          <StatsCard
            title="Latest Amount"
            value={bidData[0]?.bidAmount || 0}
            icon={<FaDollarSign  />}
            bgColor="bg-white"
            textColor="text-blue-500"
          />
        </Col>
        <Col span={6} xs={24} md={8} lg={6} className="mb-4">
          <StatsCard
            title="Listing Date"
            value={
              product?.endBid
                ? dayjs(product.bidInfo.biddingDuration.endBid).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : "N/A"
            }
            icon={<TbCalendarTime  />}
            bgColor="bg-white"
            textColor="text-gray-500"
          />
        </Col>
        {/* <Col span={6} xs={24} md={8} lg={6}>
          <StatsCard
            title="Total Disabled"
            value={0}
            icon={<TbCalendarTime />}
            bgColor="bg-white"
            textColor="text-[#003399]"
          />
        </Col> */}
      </Row>
      <BidsTable
        bidData={bidData}
        loading={isLoading}
        onSearch={handleSearch}
        pagination={{
          current: page,
          pageSize,
          total: bidData.length,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default ProductBids;
