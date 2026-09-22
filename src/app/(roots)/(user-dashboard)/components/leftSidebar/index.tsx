"use client";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { HiArrowLongLeft } from "react-icons/hi2";
import { IDNavMenuItem } from "@/Interface/content";
import { setLogOut } from "@/Redux/Slices/authSlice";
import { sidebarToggle } from "@/Redux/Slices/dashboardLayout/layoutSlice";
import { useRouter } from "next/navigation";
import { TbLogout } from "react-icons/tb";
import LeftSidebarDropdown from "./leftSidebarDropdown";


interface ISidebarProps {
  menuGroups: IDNavMenuItem[];
}

const LeftSidebar: React.FC<ISidebarProps> = ({ menuGroups = [] }) => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  };
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(
    (state) => state.layoutReducer.isOpenSideBar
  );
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  const handleLogOut = () => {
    dispatch(setLogOut());
    router.push("/");
  };

  return (
    <aside
      className={`${
        isSidebarOpen
          ? "w-[14rem]"
          : "md:w-[5rem] opacity-0 pointer-events-none md:pointer-events-auto md:opacity-100"
      } !transition-all !ease-in-out !duration-300 h-full absolute md:sticky top-0 left-0 z-[9999999999] overflow-hidden text-[1rem] text-white
   border-r border-slate-200 bg-white shadow-[18px_0_45px_rgba(15,23,42,0.08)]`}
    >
      <div className="relative flex w-full flex-col items-center justify-center gap-2 border-b border-slate-100 px-4 py-5">
        {isSidebarOpen && (
          <div className="w-full">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f0b90b]">
              CarClickBD
            </p>
            <h2 className="mt-1 text-lg font-black text-slate-950">
              Buyer Panel
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Manage inquiries, saved cars, and orders.
            </p>
          </div>
        )}
        <button
          className="text-3xl top-4 lg:hidden p-3 text-slate-700"
          onClick={() => dispatch(sidebarToggle())}
        >
          {isSidebarOpen ? (
            <span>
              <HiArrowLongLeft />
            </span>
          ) : (
            <span className="md:block hidden">
              <CgMenuLeft />
            </span>
          )}
        </button>
      </div>

      <div className="relative no-scrollbar flex h-[calc(100vh-120px)] flex-col overflow-y-auto duration-300 ease-linear">
        <section className="px-3 py-4 lg:px-4">
          <nav className="space-y-2">
            {menuGroups?.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.children ? (
                  <LeftSidebarDropdown
                    isSidebarOpen={isSidebarOpen}
                    icon={group.icon}
                    label={group.label}
                    isOpen={activeDropdown === group.label}
                    onToggle={() => handleDropdownToggle(group.label)}
                    onItemClick={() => {
                      if (window.innerWidth < 768) {
                        dispatch(sidebarToggle());
                      }
                    }}
                  >
                    {group.children}
                  </LeftSidebarDropdown>
                ) : (
                  <Link
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-nowrap text-slate-700 transition-colors duration-300 hover:bg-slate-100 hover:text-[#003399]"
                    href={group.route || "/"}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        dispatch(sidebarToggle());
                      }
                    }}
                  >
                    <span className={`${!isSidebarOpen && "text-xl"}`}>
                      {group.icon && group.icon}
                    </span>
                    <span className={`${!isSidebarOpen && "hidden"}`}>
                      {group.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}

            <button
              onClick={handleLogOut}
              className="mt-4 flex w-full items-center justify-between rounded-md border border-red-100 px-3 py-2.5 text-red-600 transition hover:bg-red-50"
            >
              <div className="flex items-center gap-2">
                <span className={`${!isSidebarOpen ? "text-[22px]" : ""}`}>
                  <TbLogout className="text-red-600" />
                </span>
                <span
                  className={`${!isSidebarOpen ? "hidden" : "text-sm text-nowrap font-bold text-red-600"}`}
                >
                  Logout
                </span>
              </div>
            </button>
          </nav>
        </section>
      </div>
    </aside>
  );
};

export default LeftSidebar;
