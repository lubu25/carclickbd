"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import LayoutChanger from "./LayoutChanger";
import { RxCross2 } from "react-icons/rx";
import { toggleLayoutSidebar } from "@/Redux/Slices/dashboardLayout/layoutSlice";

const RightSidebar = () => {
  const isSidebarOpen = useAppSelector(
    (state) => state.layoutReducer.isOpenLayoutSidbar,
  );
  const dispatch = useAppDispatch();

  //resolved hydration error
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div
      className={`${
        isSidebarOpen ? "right-0" : " -right-[30rem]  pointer-events-none  "
      } lg:w-[23rem] w-[15rem] !transition-all !ease-in-out  !duration-300 h-full  absolute  top-0   z-[9999999999]  darkmode text-[1rem]    bg-white overflow-hidden `}
    >
      {/* when Open sitebar then overlay will be visible hole page */}
      <div
        className={`${
          isSidebarOpen
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-opacity ease-in-out duration-300 fixed inset-0 bg-black`}
        onClick={() => dispatch(toggleLayoutSidebar(false))}
        // Close sidebar when clicking on the overlay
      ></div>

      {/* Sidebar */}
      <div
        className={` lg:w-[23rem] w-[15rem]   h-full darkmode text-[1rem] absolute top-0 bg-white overflow-hidden   `}
      >
        {/* Sidebar header  */}
        <header className="bg-brandcolor flex items-center justify-between py-3 px-4">
          <h2 className="font-bold   text-lg">Layout Customizer</h2>
          <button
            onClick={() => dispatch(toggleLayoutSidebar(false))}
            className="text-xl "
          >
            <RxCross2 />
          </button>
        </header>
        {/* Sidebar content here */}

        {/* layout Section  */}
        <LayoutChanger />
        {/* Color Scheme  */}
        {/* <ColorScheme /> */}
      </div>
    </div>
  );
};

export default RightSidebar;
