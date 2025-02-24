"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Updated import
import { ContainerScroll } from "../../components/ui/container-scroll-animation";

export default function Hero() {
  const router = useRouter(); // Initialize the router

  const handleKnowMoreClick = () => {
    router.push("/knowmore"); // Navigate to /knowmore
  };

  return (
    <section className="bg-gray-50 flex items-center flex-col">
      {/* SCROLL ANIMATION CONTAINER */}
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <h1 className="text-4xl font-semibold text-black dark:text-white mb-6 text-center">
              Manage your Money with AI-Driven Personal <br />
              <span className="text-4xl md:text-[6rem] text-emerald-700 font-bold mt-1 mb-3 leading-none">
                Finance Advisor
              </span>
            </h1>
          }
        >
          {/* IMAGE INSIDE SCROLL ANIMATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/dashboard.png"
              alt="hero"
              height={720}
              width={1400}
              className="mx-auto rounded-2xl object-cover h-full object-left-top mt-8"
              draggable={false}
            />
          </motion.div>
        </ContainerScroll>
      </div>

      {/* NEW SECTION - PARTNER WITH US */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="w-full bg-teal-100 py-16 px-8 mt-12  rounded-lg"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Partner with Us</h2>
          <p className="text-gray-700">HOW THIS WORKS?</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
          {[
            "Enhance your data insights with real-world usage patterns.",
            "Discover emerging trends with data-driven analysis.",
            "Optimize targeting for greater impact and precision.",
          ].map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md w-80 text-center"
            >
              <p className="text-gray-800">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-800 transition"
            onClick={handleKnowMoreClick} // Add onClick handler
          >
            Know More
          </motion.button>
        </div>
      </motion.section>
    </section>
  );
}