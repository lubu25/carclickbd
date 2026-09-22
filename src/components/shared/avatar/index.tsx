"use client";
import cn from "@/lib/cn";
import Image from "next/image";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { getMediaUrl } from "@/utils/media";

const Avatar: React.FC<{ src?: string; className?: string }> = ({
  src,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-slate-100 text-2xl text-slate-500",
        className,
      )}
    >
      {src ? (
        <Image
          className="w-full h-full rounded-full object-cover"
          src={getMediaUrl(src)}
          width={400}
          height={400}
          alt="user profile avatar"
        />
      ) : (
        <FaUserCircle aria-label="default user avatar" />
      )}
    </div>
  );
};

export default Avatar;
