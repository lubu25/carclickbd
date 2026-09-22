"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import { Input } from "antd";
import { Carousel } from 'antd';
import { motion } from 'framer-motion';
import { FaStar } from "react-icons/fa";


const NewsletterSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoplay, setAutoplay] = useState(true); // Add autoplay state

    const testimonials = [
        {
            name: "Ann K.",
            date: "Nov 2023",
            comment:
                "Sold my 99 30th Anniversary Trans Am for top dollar. They are helpful and quick to respond.",
        },
        {
            name: "John D.",
            date: "Dec 2023",
            comment:
                "Great experience buying a car through carclickbd. The process was smooth and transparent.",
        },
        {
            name: "Sarah L.",
            date: "Jan 2024",
            comment:
                "I love the variety of unique cars on this platform. It's a great place for car enthusiasts.",
        },
        {
            name: "Michael B.",
            date: "Feb 2024",
            comment: "The customer service is excellent. They helped me with all my questions.",
        },
        {
            name: "Jessica R.",
            date: "Mar 2024",
            comment: "I highly recommend carclickbd to anyone looking to buy or sell a car.",
        }
    ];

    useEffect(() => {
        if (autoplay) { // Only set interval if autoplay is true
            intervalRef.current = setInterval(() => {
                setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [testimonials.length, autoplay]); // Add autoplay to dependency array

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current: number) => {
          setCurrentSlide(current);
        },
        autoplay: autoplay, // Use the autoplay state here
        currentSlide,
    };

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state
  

    const handleSubscribe = () => {
      // Basic email validation
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(email)) {
        message.error("Please enter a valid email address.");
        return;
      }
  
      setLoading(true); // Start loading
      // Simulate subscription process (replace with your actual API call)
      setTimeout(() => {
        setLoading(false); // Stop loading
        message.success("Thank you for subscribing!");
        setEmail(""); // Clear email after successful subscription
      }, 2000); // Simulate a 2-second delay
    };

  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-50 text-white lg:py-16 py-6 rounded-lg shadow-lg mx-auto container px-4 my-2">
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">

        <div className="space-y-8">
          <h2 className="text-xl font-bold text-gray-500 mb-6">Why carclickbd?</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-green-600">24,500+</span>
              <span className="text-gray-500">Listings published</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-green-600">$550M+</span>
              <span className="text-gray-500">Value of cars sold</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-green-600">83%+</span>
              <span className="text-gray-500">Sell-through rate</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-green-600">685k+</span>
              <span className="text-gray-500">Registered members</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews (Slider) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-500 mb-6">Our customers love us!</h2>
           <Carousel {...settings}  >
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4">
                        <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.3 }}
                         className="bg-gray-800/50 rounded-lg p-6 shadow-lg backdrop-blur-md"
                        >
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-gray-200">
                                    <span className="font-semibold">{testimonial.name}</span>
                                    <span className="text-gray-200 text-xs">{testimonial.date}</span>
                                </div>
                                <p className="text-gray-200 mt-2 italic">
                                    &ldquo;{testimonial.comment}&rdquo;
                                </p>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </Carousel>
        </div>

        {/* Daily Email Signup */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-500 mb-6">Get the Daily Email</h2>
           <Input
                     placeholder="Enter your email"
                     className="mt-4"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
                   <Button
                     type="primary"
                     className="mt-3 w-full"
                     onClick={handleSubscribe}
                     loading={loading} // Bind loading state
                   >
                     {loading ? "Subscribing..." : "Subscribe"}
                   </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
