import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ label, variant = "primary", disabled, loading = false, ...props }) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none flex items-center justify-center space-x-2";

  const variantStyles = {
    primary: disabled || loading
      ? "bg-primary text-white cursor-not-allowed"
      : "bg-primary text-white hover:bg-secondary",
    secondary: disabled || loading
      ? "bg-gray-300 text-white cursor-not-allowed"
      : "bg-gray-600 text-white hover:bg-gray-700",
    outline: disabled || loading
      ? "border border-blue-300 text-blue-300 cursor-not-allowed"
      : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${props.className}`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
};

export default CustomButton;
