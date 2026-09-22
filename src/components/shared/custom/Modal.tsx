"use client";
import React, { ReactNode, useEffect } from "react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scroll when modal is open
    } else {
      document.body.style.overflow = "auto"; // Allow scroll when modal is closed
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300 z-[99999999999999]"
      aria-hidden="true"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 transition-transform transform-gpu duration-300">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <IoClose size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
