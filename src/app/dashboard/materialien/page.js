"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoDownload } from "react-icons/go"; // Import the GoDownload icon
import materials from "@/data/materials.json";
import Image from "next/image";

export default function Materialien() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(materials); // Load materials from JSON
  }, []);

  return (
    <div className="px-4 md:px-12">
      {/* Title with motion effect */}
      <motion.h1
        className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Materialien <span className="font-normal text-xl">(Downloads)</span>
      </motion.h1>

      {/* Grid Container for Airbnb-style Layout */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
          },
        }}
      >
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="relative group bg-white shadow-lg rounded-lg overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Thumbnail with Hover Animation */}
            <div className="relative">
              <div className="relative">
                {/* Image */}
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={270}
                  height={480}
                  className="w-full h-[480px] object-cover transition-transform duration-300"
                />

                {/* Black overlay on hover */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                {/* Download Button (Centered) */}
                <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.a
                    href={item.downloadUrl}
                    download
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                    whileTap={{ scale: 0.9 }}
                  >
                    <GoDownload className="text-white text-2xl" />
                  </motion.a>
                </motion.div>
              </div>

              {/* Download Button (Centered) */}
              <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.a
                  href={item.downloadUrl}
                  download
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                  whileTap={{ scale: 0.9 }}
                >
                  <GoDownload className="text-white text-2xl" />
                </motion.a>
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-500 text-sm">{item.week}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
