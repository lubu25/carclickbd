"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const AuctionDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-black transition px-3 py-2"
      >
        Cars
        <ChevronDown
          size={16}
          className={`ml-1 transform transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 mt-2 w-48 bg-white shadow-md rounded-md border z-50 transition-all duration-500 ease-out transform ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <Link href="/cars" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          All Cars
        </Link>
        <Link href="/cars?condition=new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          New Cars
        </Link>
        <Link href="/cars?condition=reconditioned" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Reconditioned Cars
        </Link>
        <Link href="/cars?sellerType=private" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          Private Seller Cars
        </Link>
      </div>
    </div>
  );
};

export default AuctionDropdown;
