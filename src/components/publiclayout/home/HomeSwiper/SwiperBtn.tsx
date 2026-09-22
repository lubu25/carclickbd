"use client";
import React from "react";
import { useSwiper } from "swiper/react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

export const SwiperNavButtons = () => {
  const swiper = useSwiper();

  return (
    <div className="bg-transparent w-auto h-auto absolute  top-[85%] right-3 md:right-5 flex justify-center items-center md:space-x-2 space-x-1 z-10 ">
      <button
        className="p-1 md:p-2 rounded-full bg-white/30 backdrop-blur-md transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
        onClick={() => swiper.slidePrev()}
        aria-label="Previous Slide"
      >
        <AiOutlineLeft />
      </button>
      <button
        className="p-1 md:p-2 rounded-full bg-white/30 backdrop-blur-md transition-all duration-300 text-gray-700 hover:text-gray-900 hover:bg-white/50 hover:scale-105 active:scale-95 focus:outline-none shadow-lg"
        onClick={() => swiper.slideNext()}
        aria-label="Next Slide"
      >
        <AiOutlineRight />
      </button>
    </div>
  );
};
