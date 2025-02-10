"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DesktopOnly = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280); // ✅ Adjust breakpoint as needed
    };

    checkScreenSize(); // ✅ Run once on mount
    window.addEventListener("resize", checkScreenSize); // ✅ Listen for resizes

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) return null; // ✅ Only render on small screens

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl text-white text-center px-8 z-[9999]"
    >
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
        Webomo Dashboard
      </h1>
      <p className="max-w-xl mt-4 text-lg text-gray-200 drop-shadow">
        Dieses Dashboard ist nur für{" "}
        <span className="font-bold">
          Desktop-Geräte oder den Vollbildmodus{" "}
        </span>
        optimiert. Bitte verwende einen Computer oder wechsle in den
        Vollbildmodus, um alle Funktionen zu nutzen.
      </p>

      <div className="mt-8">
        {/* <button
          className="px-6 py-3 text-lg font-bold text-white bg-indigo-500 rounded-full shadow-xl hover:bg-indigo-600 transition-all"
          onClick={() => window.location.reload()}
        >
          Erneut überprüfen 🔄
        </button> */}
      </div>
    </motion.div>
  );
};

export default DesktopOnly;
