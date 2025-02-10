"use client";

import { useState, useEffect } from "react";

const DesktopOnly = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // ✅ Change breakpoint if needed
    };

    checkScreenSize(); // ✅ Run once on mount
    window.addEventListener("resize", checkScreenSize); // ✅ Listen for resizes

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isMobile) return null; // ✅ Only show if screen is too small

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center text-white text-center px-6 z-[9999] backdrop-blur-lg">
      <h1 className="text-3xl font-bold">
        🚀 Webomo Dashboard ist nur auf dem Desktop verfügbar
      </h1>
      <p className="mt-4 text-lg">
        Bitte besuche das Dashboard von einem Computer aus, um auf alle
        Funktionen zugreifen zu können.
      </p>
    </div>
  );
};

export default DesktopOnly;
