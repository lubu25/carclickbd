"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  size = "lg",
  className = "",
  disabled = false,
  type = "button",
  variant = "primary",
}) => {
  // Base shared styles
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  // Sizes
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-5 text-lg",
  };

  // Variants
  const variantStyles =
    variant === "primary"
      ? // 🔵 Primary Button — Copart Blue
        "bg-[#111111] text-white hover:bg-[#e50914] focus:ring-[#e50914]"
      : // 🟡 Secondary Button — Copart Yellow
        "bg-[#e50914] text-white hover:bg-[#b80f17] focus:ring-[#e50914]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, sizeStyles[size], variantStyles, className)}
    >
      {children}
    </button>
  );
};

export default Button;
