"use client";

import React from "react";
import { Carousel, Avatar } from "antd";
import { FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Testimonial Data
const testimonials = [
  {
    name: "John D.",
    avatar: "/avatars/john.jpg",
    date: "March 5, 2025",
    comment: "carclickbd made it super easy to win the exact car I was looking for.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    avatar: "/avatars/sarah.jpg",
    date: "April 12, 2025",
    comment: "The listing and inquiry process was smooth and fast. Highly recommended!",
    rating: 4,
  },
  {
    name: "Michael B.",
    avatar: "/avatars/michael.jpg",
    date: "May 8, 2025",
    comment: "Excellent customer service and a huge selection of vehicles!",
    rating: 5,
  },
  {
    name: "Amina K.",
    avatar: "/avatars/amina.jpg",
    date: "June 1, 2025",
    comment: "I sold my old car faster than I expected. Love the seller tools!",
    rating: 5,
  },
  {
    name: "David R.",
    avatar: "/avatars/david.jpg",
    date: "June 10, 2025",
    comment: "I’ve bought two cars from here. Both were in great condition.",
    rating: 4,
  },
  {
    name: "Lina H.",
    avatar: "/avatars/lina.jpg",
    date: "June 15, 2025",
    comment: "Trustworthy platform. Payments and communication were seamless.",
    rating: 5,
  },
];

// Helper: split into groups of 3 per slide
const chunkArray = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// Animation variant for cards
const animationVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.15,
    },
  }),
};

export default function CustomerReviewsPage() {
  const slides = chunkArray(testimonials, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Our Customers Love Us!</h2>
        <p className="text-gray-500 mt-2">Real reviews. Real people. Real success.</p>
      </div>

      <Carousel autoplay dots swipeToSlide draggable>
        {slides.map((group, index) => (
          <div key={index}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 py-4">
              <AnimatePresence>
                {group.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={animationVariant}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-white rounded-xl p-6 shadow-lg text-gray-800"
                  >
                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, idx) =>
                        idx < testimonial.rating ? (
                          <FaStar key={idx} className="text-yellow-400 w-4 h-4" />
                        ) : (
                          <FaRegStar key={idx} className="text-gray-300 w-4 h-4" />
                        )
                      )}
                    </div>

                    {/* Avatar, Name, Date */}
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar src={testimonial.avatar} size={40} />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.date}</p>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="italic text-gray-600 mt-2">
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
