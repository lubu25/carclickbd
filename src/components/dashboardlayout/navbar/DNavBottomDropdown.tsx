import { IDNavMenuItem, INavChildrenItem } from "@/Interface/content";
import Link from "next/link";
import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";

const DNavBottomDropdown: React.FC<IDNavMenuItem> = ({
  icon,
  label,
  children,
}) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="relative " onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1"
        onMouseEnter={() => setOpen(true)}
      >
        <span className="flex items-center gap-1">
          {icon && icon}
          {label}
        </span>
        <span
          className={`  ${
            isOpen && "rotate-180 transition-transform duration-500 "
          } text-md`}
        >
          <RiArrowDownSLine />
        </span>
      </button>
      <div
        className={`absolute left-0 bg-white py-2 rounded-lg shadow-lg  max-w-[30rem]   transform transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 z-999999"
            : "translate-y-4 opacity-0 pointer-events-none"
        } dark:bg-gray-800 dark:text-white overflow-hidden flex flex-col  `}
      >
        {children?.map((menu: INavChildrenItem, index: number) => (
          <Link
            key={index}
            href={menu.route}
            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-nowrap flex items-center"
          >
            <span className={`text-md `}>
              {menu.icon ? menu.icon : <MdKeyboardArrowRight />}
            </span>
            <span>{menu.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DNavBottomDropdown;
