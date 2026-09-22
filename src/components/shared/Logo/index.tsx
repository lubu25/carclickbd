import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link href={"/"}>
      <div className="flex items-center justify-center p-4">
        <h1 className="text-3xl font-extrabold tracking-wide text-gray-400 uppercase">
          Big<span className="text-primary">Car</span>sales
        </h1>
      </div>
    </Link>
  );
};

export default Logo;
