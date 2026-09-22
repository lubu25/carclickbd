"use client";
import React from "react";
import { Modal } from "antd";

interface ModalWrapperProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  setIsOpen,
  children,
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onCancel={handleClose} footer={null}>
      {children}
    </Modal>
  );
};

export default ModalWrapper;
