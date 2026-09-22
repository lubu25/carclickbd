"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setToLocalStorage } from "@/utils/local-storage";
import { IoCheckmarkCircle } from "react-icons/io5";
import { setLayoutState } from "@/Redux/Slices/dashboardLayout/layoutSlice";

const LayoutChanger = () => {
  const layoutState = useAppSelector(
    (state) => state.layoutReducer.layoutState,
  );
  const dispatch = useAppDispatch();

  const handleChangeLayout = (state: boolean) => {
    setToLocalStorage("layoutState", state);
    dispatch(setLayoutState(state));
  };
  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-left lg:px-7">
        <h2 className=" font-semibold text-sm">LAYOUT</h2>
        <h4 className="text-gray-500  tracking-tighter text-sm">
          Choose your layout
        </h4>
      </div>

      <section className="flex items-center justify-center flex-wrap gap-5 mt-3  ">
        {/* Vertical */}
        <button onClick={() => handleChangeLayout(false)}>
          <div
            className={`border ${
              !layoutState ? "border-primary" : "border-gray-400"
            } w-32 h-20   rounded grid grid-cols-12 overflow-hidden relative`}
          >
            {!layoutState && (
              <span className="text-2xl text-primary  absolute right-2 top-1 ">
                <IoCheckmarkCircle />
              </span>
            )}
            <span className="col-span-4 bg-gray-100 darkmode overflow-hidden p-2 space-y-2">
              <span className="w-full h-2 mb-4  bg-gray-400 block"></span>
              <span className="w-full h-1.5 bg-gray-400 block"></span>
              <span className="w-full h-1.5 bg-gray-400 block"></span>
              <span className="w-full h-1.5   bg-gray-400 block"></span>
            </span>
            <span className="col-span-8  h-full flex flex-col justify-between   ">
              <span className="flex items-center gap-2 bg-gray-100 darkmode h-3 w-full px-2">
                <span className="w-full h-1    bg-gray-400 block "></span>
                <span className="w-full h-1    bg-gray-400 block    "></span>
                <span className="w-full h-1    bg-gray-400 block    "></span>
                <span className="w-full h-1    bg-gray-400 block    "></span>
              </span>
              <span className="mx-2 space-y-3">
                <span className="w-full h-1.5    bg-gray-300 block  "></span>
                <span className="w-full h-1.5    bg-gray-300 block  "></span>
              </span>
              <span className="flex items-center gap-2 bg-gray-100 darkmode w-full h-3"></span>
            </span>
          </div>
          <h2 className="text-gray-800 text-center text-sm mt-1">Vertical</h2>
        </button>

        {/* Horizontal  */}
        <button onClick={() => handleChangeLayout(true)}>
          <div
            className={`border ${
              layoutState ? "border-primary  " : "border-gray-400"
            } w-32 h-20   rounded   overflow-hidden relative`}
          >
            {layoutState && (
              <span className="text-2xl text-primary   absolute right-2 top-1 ">
                <IoCheckmarkCircle />
              </span>
            )}

            <span className="flex items-center gap-2   h-3 w-full px-2">
              <span className="w-full h-1  bg-gray-400 block"></span>
              <span className="w-full h-1  bg-gray-400 block"></span>
              <span className="w-full h-1   bg-gray-400 block"></span>
              <span className="w-full h-1   bg-gray-400 block "></span>
            </span>

            <span className="w-full h-2 mb-4   bg-gray-400 block px-2"></span>
            <span className="w-full h-1.5  bg-gray-300 block"></span>
            <span className="w-full h-1.5    bg-gray-300 block"></span>
            <span className="w-full h-1.5    bg-gray-300 block"></span>
            <span className="flex items-center gap-2 bg-gray-100 darkmode w-full h-3"></span>
          </div>
          <h2 className="text-gray-800 darkmode text-center text-sm mt-1">
            Horizontal
          </h2>
        </button>
      </section>
    </div>
  );
};

export default LayoutChanger;
