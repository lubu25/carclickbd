"use client";
import ModalWrapper from "@/shared/modal/ModalWrapper";
import ValidUserCheckAndRedirect from "@/shared/wrapper/ValidUserCheckAndRedirect";
import { Button, Card } from "antd";
import moment from "moment";
import { useState } from "react";
import MakeBids from "./MakeBids";
import { BidInfoCardProps } from "@/types/products.types";


export default function BidInfoCard({
  productId,
  seller,
  highestBid,
  endBid,
  minBid
}: BidInfoCardProps) {
  const currentBid =
    highestBid === 0
      ? minBid
      : (highestBid);
  const endingTime = moment(endBid).format(
    "ddd, MMM D h:mm A"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="border-2">
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Current Offer</div>
              <div className="text-4xl md:text-4xl flex flex-wrap lg:text-6xl font-bold">
                $
                {currentBid > 999999
                  ? `${Number(currentBid.toString().slice(0, 6)).toLocaleString()}...`
                  : currentBid?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Seller</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{seller?.name}</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Listing Date</div>
              <div className="font-medium">{endingTime}</div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Inquiries</div>
                <div className="font-medium text-xl">{highestBid}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* _________Offer Modal_____________ */}
      <ModalWrapper isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <MakeBids
          {...{ productId }}
          setOpen={setIsModalOpen}
          bidInfo={ {  highestBid,
            minBid } }
          
        />
      </ModalWrapper>
    </Card>
  );
}
