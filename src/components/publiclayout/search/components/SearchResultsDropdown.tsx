"use client";

import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import useOutsideClick from "@/hooks/useOutsideClick"; // Import the hook

interface Product {
  title: string;
}

interface SearchResultsDropdownProps {
  products: Product[];
  hasSearchTerm: boolean;
  setHasSearchTerm: (value: string) => void;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({
  products,
  hasSearchTerm,
  setHasSearchTerm,
}) => {
  const router = useRouter();
  const dropdownRef = useOutsideClick(() => setHasSearchTerm(""));

  const handleClick = (title: string) => {
    setHasSearchTerm(""); // Close dropdown
    const formattedTitle = encodeURIComponent(title).replace(/%20/g, "+");
    router.push(`/search?q=${formattedTitle}`);
  };

  const showAnimation = products && products.length > 0 && hasSearchTerm;

  return (
    <section
      ref={dropdownRef} // Attach ref to the dropdown
      className={`top-8 left-0 md:left-auto w-full md:w-[500px] fixed md:absolute md:top-8 z-50 mx-auto mt-4 p-4 bg-white rounded-lg shadow-md ${
        showAnimation
          ? "opacity-100 translate-y-0 block "
          : "opacity-0 -translate-y-4 hidden"
      } transition-all duration-300 ease-in-out`}
    >
      {products?.map((product, index) => (
        <div
          key={index}
          onClick={() => handleClick(product.title)}
          className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-300"
        >
          <FaSearch className="text-gray-400" />
          <p className="text-lg font-medium">{product.title}</p>
        </div>
      ))}
    </section>
  );
};

export default SearchResultsDropdown;
