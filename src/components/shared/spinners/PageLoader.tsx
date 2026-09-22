import React from "react";
import LoadingSpinner from "./loadingSpinner";
import cn from "@/lib/cn";

const PageLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-full h-screen flex items-center justify-center",
        className,
      )}
    >
      <LoadingSpinner />
    </div>
  );
};

export default PageLoader;
