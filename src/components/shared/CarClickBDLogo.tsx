"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";

type CarClickBDLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function CarClickBDLogo({
  className = "h-[58px] w-[185px]",
  priority = false,
}: CarClickBDLogoProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`}>
      <Image
        src={logo}
        alt="CarClickBD"
        fill
        priority={priority}
        sizes="220px"
        className="object-contain"
      />
    </div>
  );
}
