"use client";
import { Button } from "antd";
import { useState } from "react";
import {
  CopyOutlined,
  FacebookOutlined,
  TwitterOutlined,
  RedditOutlined,
  MailOutlined,
} from "@ant-design/icons";

interface ShareContentProps {
  url: string;
}

export default function ShareContent({ url }: ShareContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}`,
    email: `mailto:?body=${encodeURIComponent(url)}`,
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold mb-2  text-center">
        Share this car
      </h2>

      <Button
        icon={<CopyOutlined />}
        className="w-full h-10 flex items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
        onClick={handleCopyLink}
      >
        {copied ? "Copied!" : "Copy Link"}
      </Button>

      <Button
        icon={<FacebookOutlined />}
        className="w-full h-10 flex items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
        onClick={() => window.open(shareUrls.facebook, "_blank")}
      >
        Facebook
      </Button>

      <Button
        icon={<TwitterOutlined />}
        className="w-full h-10 flex items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
        onClick={() => window.open(shareUrls.twitter, "_blank")}
      >
        Twitter
      </Button>

      <Button
        icon={<RedditOutlined />}
        className="w-full h-10 flex items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
        onClick={() => window.open(shareUrls.reddit, "_blank")}
      >
        Reddit
      </Button>

      <Button
        icon={<MailOutlined />}
        className="w-full h-10 flex items-center justify-center bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
        onClick={() => window.open(shareUrls.email, "_blank")}
      >
        Email
      </Button>
    </div>
  );
}
