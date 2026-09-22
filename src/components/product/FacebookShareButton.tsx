"use client";

import { FacebookOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function FacebookShareButton() {
  const shareOnFacebook = () => {
    const shareUrl = new URL(window.location.href);
    // Facebook may keep the first scraped preview for a URL. A stable preview
    // version bypasses the older cached page that had no product image.
    shareUrl.searchParams.set("fb_preview", "2");
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl.toString(),
    )}`;

    window.open(
      facebookShareUrl,
      "facebook-share",
      "noopener,noreferrer,width=700,height=700",
    );
  };

  return (
    <Button
      type="primary"
      icon={<FacebookOutlined />}
      onClick={shareOnFacebook}
      aria-label="Share this car on Facebook"
      className="border-none bg-[#1877f2] font-semibold hover:bg-[#166fe5]"
    >
      Share on Facebook
    </Button>
  );
}
