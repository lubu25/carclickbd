/* eslint-disable react/no-children-prop */
"use client";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { HiArrowLongLeft } from "react-icons/hi2";
import { IDNavMenuItem } from "@/Interface/content";
import getProfileUrl from "@/content/getProfileUrl";
import { setLogOut } from "@/Redux/Slices/authSlice";
import { sidebarToggle } from "@/Redux/Slices/dashboardLayout/layoutSlice";
import { useRouter } from "next/navigation";
import { TbLogout } from "react-icons/tb";
import LeftSidebarDropdown from "./leftSidebarDropdown";
import CustomAvatar from "@/components/shared/avatar";
import { getTokenInfo } from "@/service/auth.service";


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

  const tokenInfo = getTokenInfo();

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
    } !transition-all !ease-in-out !duration-300 h-full absolute md:sticky top-0 left-0 z-[9999999999] text-[1rem] text-[white]
    ${
      tokenInfo?.role === "super-admin"
    ? "bg-gray-950"
    : tokenInfo?.role === "admin"
    ? "bg-gray-700"
    : tokenInfo?.role === "super"
    ? "bg-cyan-800"
    : tokenInfo?.role === "agent"
    ? "bg-teal-700"
    : tokenInfo?.role === "sub-agent"
    ? "bg-blue-800"
    : tokenInfo?.role === "customer"
    ? "bg-blue-100"
    : tokenInfo?.role === "seller"
    ? "bg-gradient-to-b from-slate-950 via-[#071d49] to-[#003399]"
    : "bg-gray-200"
 
    }`}
  >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center flex-col  justify-center gap-2   w-full">
        {isSidebarOpen && tokenInfo?.role === "seller" && (
          <div className="mt-5 w-full px-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f0b90b]">
              CarClickBD
            </p>
            <h2 className="mt-1 text-lg font-black text-white">
              Seller Panel
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-300">
              Manage listings, leads, and sales.
            </p>
          </div>
        )}
        <div>
        
          {tokenInfo?.role === "seller" && (
            <Link href={getProfileUrl(tokenInfo)}>
              <CustomAvatar
                className={` ${isSidebarOpen ? "h-16 w-16" : "h-8 w-8"}  flex items-center justify-center mt-5 text-3xl bg-white `}
              />
            </Link>
          )}
        </div>
        <button
          className="  text-3xl top-4 lg:hidden p-5"
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

      <div className="no-scrollbar flex flex-col overflow-y-auto h-[calc(100vh-30px)] duration-300 ease-linear">
        <section className="mt-2   px-4 py-4 lg:mt-9 lg:px-6">
          <nav className="space-y-4">
            {menuGroups?.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.children ? (
                  <LeftSidebarDropdown
                    isSidebarOpen={isSidebarOpen}
                    children={group.children as []}
                    icon={group.icon}
                    label={group.label}
                    isOpen={activeDropdown === group.label}
                    onToggle={() => handleDropdownToggle(group.label)}
                    onItemClick={() => {
                      if (window.innerWidth < 768) {
                        dispatch(sidebarToggle());
                      }
                    }}
                  />
                ) : (
                  <Link
                    className="flex items-center text-sm text-nowrap gap-2 px-3 py-1.5 rounded-md hover:bg-green-600 hover:text-white transition-colors duration-300"
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
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <span className={`${!isSidebarOpen ? "text-[22px]" : ""}`}>
                  <TbLogout className="text-red-200" />
                </span>
                <span
                  className={`${!isSidebarOpen ? "hidden" : "text-sm text-nowrap text-red-200 font-bold"}`}
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
