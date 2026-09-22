"use client"
import Container from "@/shared/wrapper/Container";
import React from "react";
import CommentsHistory from "./components/BidHistory";
import { useParams } from "next/navigation";
import LiveAuctionProduct from "./components/LiveAuctionProduct";

const CommentsPage = () => {
  const { id } = useParams();

  // Ensure productId is a string
  const productId = Array.isArray(id) ? id[0] : id;

  if (!productId) {
    return <div>Product ID is missing!</div>;
  }

  return (
    <Container>
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <LiveAuctionProduct />
          {/* Pass the validated productId to CommentsHistory */}
          <CommentsHistory productId={productId} />
        </div>
      </div>
    </Container>
  );
};

export default CommentsPage;
