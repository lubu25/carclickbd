"use client";

import { useState } from "react";
import { Button } from "antd";
import { StarOutlined, StarFilled, ShareAltOutlined } from "@ant-design/icons";
import { useAddToWatchListMutation } from "@/Redux/features/watch-list/watchlistApi";
import ValidUserCheckAndRedirect from "@/shared/wrapper/ValidUserCheckAndRedirect";
import ShareProductButton from "./shareProductSection";

const WatchShare = ({
  isWatchlisted,
  productId,
}: {
  isWatchlisted: boolean;
  productId: string;
}) => {
  const [isListed, setIsListed] = useState(isWatchlisted);
  const [addToWatchList] = useAddToWatchListMutation();

  const toggleWatch = async () => {
    setIsListed(!isListed);

    try {
      await addToWatchList({ product: productId });
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <div className="flex gap-3">
      <ValidUserCheckAndRedirect onClick={toggleWatch}>
        <Button
          icon={
            isListed ? (
              <StarFilled style={{ color: "gold" }} />
            ) : (
              <StarOutlined />
            )
          }
          className="flex items-center bg-zinc-800 text-white border-none hover:bg-zinc-700"
        >
          Watch
        </Button>
      </ValidUserCheckAndRedirect>

      {/* ___________ share ___________ */}
      <ShareProductButton />
    </div>
  );
};

export default WatchShare;
