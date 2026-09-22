"use client";
import React from "react";
import MyBidTable from "@/components/table/MyBidTable";
import { useGetAllMyBidsQuery } from "@/Redux/features/bids/myBidApi";


const MyBids: React.FC = () => {
     const { data: response, isLoading } = useGetAllMyBidsQuery({});

     console.log({ response });
     

     const bids = response?.data || [];


  return (
    <div className="p-4 space-y-6">
      <MyBidTable
        bids={bids}
      />
    </div>
  );
};

export default MyBids;