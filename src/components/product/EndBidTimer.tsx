"use client";

import useBiddingTimer from "@/hooks/useBiddingTimer";
import { CgTimer } from "react-icons/cg";

const EndBidTimer = ({ product }: { product: any }) => {
  const { timeRemaining, isCritical, daysLeft } = useBiddingTimer(
    product?.endBid,
  );

  return (
    <>
      <div className="flex justify-end pr-3 pb-3 items-center gap-1">
        <CgTimer className={`size-4 mr-1`} />
        {daysLeft && <p>{daysLeft}</p>}
        {timeRemaining && (
          <p
            className="font-normal"
            style={{ color: isCritical ? "red" : "black" }}
          >
            {timeRemaining}
          </p>
        )}
      </div>
    </>
  );
};

export default EndBidTimer;
