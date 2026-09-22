"use client";
import React, { useState } from "react";
import AuctionDropdown from "./AuctionDropdown";
import Link from "next/link";
import { Modal, Input, Button } from "antd";
import { FaCar } from "react-icons/fa"; // Car icon

import { message } from "antd";

interface NavMenuProps {
  isMobile?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ isMobile = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const showModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents page jump
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEmail(""); // Clear email on close
  };

  const handleSubscribe = () => {
    // Basic email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Start loading
    // Simulate subscription process (replace with your actual API call)
    setTimeout(() => {
      setLoading(false); // Stop loading
      message.success("Thank you for subscribing!");
      setIsModalOpen(false);
      setEmail(""); // Clear email after successful subscription
    }, 2000); // Simulate a 2-second delay
  };

  return (
    <>
      <div
        className={`${
          isMobile
            ? "flex flex-col items-start gap-2"
            : "hidden lg:flex items-center space-x-3 xl:space-x-6"
        }`}
      >
        <AuctionDropdown />
        <Link
          href="/sell-item"
          className={`text-sm tracking-tighter border border-primary px-3 py-2 rounded-full hover:bg-primary transition ${
            isMobile ? "text-left font-semibold" : ""
          }`}
        >
          Sell a Car
        </Link>
        <Link
          href="/contact"
          className={`text-sm md:text-md lg:text-[1rem] tracking-tighter text-gray-600 hover:text-black transition ${
            isMobile ? "font-semibold" : ""
          }`}
        >
          Contact
        </Link>
        <Link
          href="/help"
          className={`text-sm md:text-md lg:text-[1rem] tracking-tighter text-gray-600 hover:text-black transition ${
            isMobile ? "font-semibold" : ""
          }`}
        >
          About
        </Link>
        <a
          href="#"
          onClick={showModal}
          className={`text-sm md:text-md lg:text-[1rem] tracking-tighter text-gray-600 hover:text-black transition ${
            isMobile ? "font-semibold" : ""
          }`}
        >
          Daily Email
        </a>
      </div>

      <Modal
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <FaCar size={40} className="text-primary" />
          <h2 className="text-xl font-bold">Get the Daily Mail</h2>
          <p className="text-gray-600 text-sm">
            Get the latest dealer and private seller listings delivered right to
            your inbox, plus market updates and featured vehicle alerts.
          </p>
          <Input
            placeholder="Enter your email"
            className="mt-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="primary"
            className="mt-3 w-full"
            onClick={handleSubscribe}
            loading={loading} // Bind loading state
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default NavMenu;
