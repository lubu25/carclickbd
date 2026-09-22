"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { EffectFade, Autoplay } from "swiper/modules";
import products from "../../../../../product.json";
import SlideContent from "./SlideContent";

const SwiperNavButtons = dynamic(
  () => import("./SwiperBtn").then((mod) => mod.SwiperNavButtons),
  { ssr: false },
);

const HomeSwiper = () => {
  return (
    <div className="md:mt-3 relative">
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        modules={[EffectFade, Autoplay]}
        className="mySwiper"
      >
        {products.map((product: any) => (
          <SwiperSlide key={product?._id}>
            <SlideContent product={product} />
          </SwiperSlide>
        ))}
        <SwiperNavButtons />
      </Swiper>
    </div>
  );
};

export default HomeSwiper;
