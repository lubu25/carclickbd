"use client";
import React, { useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import { RxCross2 } from "react-icons/rx";

const NavSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

    const handleMobileSearchClose = () => {
        setIsMobileSearchVisible(false);
        setSearchTerm("");
    };

    return (
        <div className="relative">
            {/* Desktop Search Bar */}
            <div className="hidden lg:block">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>

            {/* Mobile Search Button */}
            <div className="lg:hidden">
                {!isMobileSearchVisible && (
                    <button
                        className="text-xl font-bold"
                        onClick={() => setIsMobileSearchVisible(true)}
                    >
                        <HiOutlineMagnifyingGlass />
                    </button>
                )}
            </div>

            {/* Mobile Search Input */}
            {isMobileSearchVisible && (
                <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-1 p-4 bg-white h-11">
                    <SearchBar
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                    <button
                        className="text-xl font-bold"
                        onClick={handleMobileSearchClose}
                    >
                        <RxCross2 />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavSearchBar;