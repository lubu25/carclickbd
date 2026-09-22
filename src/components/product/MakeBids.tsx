"use client";

import { useState } from "react";
import { useMakeBidMutation } from "@/Redux/features/bids/bidsApi";
import { Input, Button, message } from "antd";

interface MakeBidsProps {
  productId: string;
  bidInfo: {
    highestBid?: number;
    minBid?: number;
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MakeBids: React.FC<MakeBidsProps> = ({ productId, bidInfo, setOpen }) => {
  const [bidAmount, setBidAmount] = useState<number | null>(null);
  const [createBid, { isLoading }] = useMakeBidMutation();

  const requiredBidAmount = (bidInfo?.highestBid ?? 0) > 0 ? bidInfo.highestBid! : bidInfo?.minBid ?? 0;
  const handleMakeBid = async () => {
    if (!bidAmount || bidAmount <= requiredBidAmount) {
      message.error(`Your offer must be more than $${requiredBidAmount}`);
      return;
    }

    try {
      const res = await createBid({ product: productId, bidAmount }).unwrap();
      if (res.success) {
        message.success("Offer submitted successfully!");
        setBidAmount(null);
        setOpen(false);
      }
    } catch (error: any) {
      message.error(error?.message || "Failed to submit offer.");
      setBidAmount(null);
    }
  };

  return (
    <section className="py-4">
      <h2 className="mb-4 text-xl italic text-[#000] font-bold">Submit an Offer</h2>
      <Input
        type="number"
        value={bidAmount ?? ""}
        onChange={(e) => setBidAmount(Number(e.target.value) || null)}
        placeholder={`Minimum offer: $${requiredBidAmount}`}
        disabled={isLoading}
        className="mb-4 !py-3 placeholder:text-md text-lg font-bold placeholder:font-normal"
      />
      <div className="mt-3 flex w-full justify-end">
        <Button
          type="primary"
          className="!w-full !py-5"
          onClick={handleMakeBid}
          loading={isLoading}
          disabled={isLoading || !bidAmount || bidAmount <= requiredBidAmount}
        >
          {isLoading ? "" : "Submit Offer"}
        </Button>
      </div>
    </section>
  );
};

export default MakeBids;
