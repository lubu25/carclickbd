"use client";
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex  items-center justify-center h-full z-50   ">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin duration-500 flex items-center justify-center border-t-primary rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-secandary text-2xl animate-spin duration-500 flex items-center justify-center border-t-secandary rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
