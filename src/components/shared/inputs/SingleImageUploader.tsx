"use client";
import cn from "@/lib/cn";
import Image from "next/image";
import React, { SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
interface PictureUploaderProps {
  onFileChange?: (file: File | null) => void;
  setImageFile?: React.Dispatch<SetStateAction<File | any>>;
  defaultImgUrl?: string;
  isForProfile?: boolean;
  className?: string;
  setUrl?: React.Dispatch<SetStateAction<string | null>>; // Adjusted this line
}

const SingleImageUploader: React.FC<PictureUploaderProps> = ({
  onFileChange,
  setImageFile,
  defaultImgUrl,
  isForProfile = false,
  setUrl,
  className,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dropAreaRef = useRef<HTMLDivElement | null>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Please select an image.");
      return false;
    }
    return true;
  };

  const handleFile = async (file: File) => {
    if (validateFile(file)) {
      setImageFile && setImageFile(file);

      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        // setUrl(result);
      };
      reader.readAsDataURL(file);

      if (onFileChange) {
        onFileChange(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg">
      {isForProfile ? (
        <div
          ref={dropAreaRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
          className={cn(
            "w-32 h-32 border-2 border-dashed border-gray-300   bg-gray-50  rounded-full mb-4 flex items-center justify-center text-gray-500 cursor-pointer relative  ",
            className,
            {
              " border-4 border-blue-500 bg-blue-100": isDragging,
            },
          )}
        >
          <span className="absolute bottom-2 right-2 z-10 h-8 w-8 rounded-full bg-white flex items-center justify-center text-lg  ">
            <FaCamera />
          </span>
          {preview ? (
            <Image
              width={128}
              height={128}
              src={preview}
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover"
            />
          ) : defaultImgUrl ? (
            <Image
              width={128}
              height={128}
              src={defaultImgUrl}
              alt="Default Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div
              className={`text-center text-sm p-3  ${
                isDragging ? "text-white" : "text-gray-500 "
              }`}
            >
              Drag & drop or select a picture
            </div>
          )}
        </div>
      ) : (
        <div
          ref={dropAreaRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById("fileInput")?.click()}
          className={cn(
            "w-full h-full border-2 border-dashed border-gray-300   bg-gray-50  rounded-lg mb-4 flex items-center justify-center  cursor-pointer relative",
            className,
            {
              " border-4 border-blue-500 bg-blue-100": isDragging,
            },
          )}
        >
          {preview ? (
            <Image
              width={500}
              height={500}
              src={preview}
              alt="Profile Preview"
              className="w-full h-full   object-cover overflow-hidden"
            />
          ) : defaultImgUrl ? (
            <Image
              width={500}
              height={500}
              src={defaultImgUrl}
              alt="Default Profile"
              className="w-full h-full   object-cover  overflow-hidden"
            />
          ) : (
            <div
              className={`text-center font-bold  flex flex-col items-center justify-center  p-3 ${
                isDragging ? "text-primary" : "   "
              }`}
            >
              <span className="text-3xl md:text-5xl">
                <FaCloudArrowUp />
              </span>
              <span className="text-sm md:text-md">
                {" "}
                Drag & drop or select a picture
              </span>
            </div>
          )}
        </div>
      )}
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SingleImageUploader;
