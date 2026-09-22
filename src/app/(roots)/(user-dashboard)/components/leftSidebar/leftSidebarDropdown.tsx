import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { RiArrowDownSLine } from "react-icons/ri";

interface IChildrenMenu {
  icon?: React.ReactNode;
  label: string;
  route: string;
}

interface IMenuItem {
  icon: React.ReactNode;
  label: string;
  children: IChildrenMenu[];
  isSidebarOpen: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onItemClick?: () => void; // 👈 Add this
}

const LeftSidebarDropdown: React.FC<IMenuItem> = ({
  icon,
  label,
  children,
  isSidebarOpen,
  isOpen,
  onToggle,
  onItemClick, // 👈 Accept onItemClick
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="transition-all duration-300 ease-in-out w-full">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-slate-700 transition-colors duration-300 hover:bg-slate-100 hover:text-[#003399]"
      >
        <div className="flex items-center gap-2">
          {icon && (
            <span className={`${!isSidebarOpen ? "text-[22px]" : ""}`}>
              {icon}
            </span>
          )}
          <span className={`${!isSidebarOpen ? "hidden" : "text-sm text-nowrap font-semibold"}`}>
            {label}
          </span>
        </div>
        <span className={`${!isSidebarOpen ? "hidden" : "text-md transition-transform duration-500"} ${isOpen ? "rotate-180" : ""}`}>
          <RiArrowDownSLine />
        </span>
      </button>

      {/* Smooth Dropdown Transition */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        {isSidebarOpen && (
          <div className="ml-4 mt-2 space-y-1 border-l border-slate-200 pl-2">
            {children.map((menu, index) => (
              <Link
                key={index}
                className="flex items-center text-nowrap text-xs gap-3 rounded-md px-3 py-2 text-slate-500 transition-colors duration-300 hover:bg-slate-100 hover:text-[#003399]"
                href={menu.route}
                onClick={() => {
                  if (onItemClick) {
                    onItemClick(); // 👈 Close sidebar on mobile
                  }
                }}
              >
                <span className="text-md">
                  {menu.icon || <MdKeyboardArrowRight />}
                </span>
                <span className={`${!isSidebarOpen ? "hidden" : "text-xs text-nowrap"}`}>
                  {menu.label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebarDropdown;
