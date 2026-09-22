"use client";

import { ChangeEvent, KeyboardEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const SearchBar = ({ searchTerm, setSearchTerm }: SearchBarProps) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleReset = () => {
        setSearchTerm("");
        inputRef.current?.focus();
    };

    const handleSearch = () => {
        const trimmed = searchTerm.trim();
        if (trimmed) {
            router.push(`/search?title=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="text-sm 2xl:text-md flex hover:shadow-md items-center gap-1 2xl:gap-3 w-[90vw] lg:w-[400px] 2xl:w-[500px] h-[2.5rem] md:h-[3.3rem] py-3 px-3 bg-gray-50 rounded text-gray-950 m-2"
        >
            <button
                type="button"
                className="text-xl 2xl:text-2xl"
                onClick={handleSearch} // এখানে onClick হ্যান্ডলার যোগ করা হয়েছে
            >
                <HiOutlineMagnifyingGlass />
            </button>

            <input
                ref={inputRef}
                className="outline-none border-none bg-inherit w-full h-full text-inherit text-black"
                type="text"
                placeholder="Search for cars (e.g., BMW, Audi, Ford)"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
            />

            {searchTerm && (
                <button
                    type="button"
                    className="bg-white rounded-full p-1"
                    onClick={handleReset}
                >
                    <RxCross2 />
                </button>
            )}
        </div>
    );
};

export default SearchBar;