"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import TeamMemberProfile from "./TeamMemberProfile";

const TeamMemberModal = ({ userId, onClose }) => {
  if (!userId) return null; // Do not render if no user is selected

  // ✅ Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 right-0 w-[calc(100%-16rem)] h-full bg-white dark:bg-gray-900 shadow-lg z-50"
    >
      {/* Close Button (DaisyUI KBD) */}
      <button
        onClick={onClose}
        className="absolute top-12 bg-indigo-50 shadow-lg p-2 rounded-full px-4 right-12 flex items-center space-x-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
      >
        <span className="font-bold">Klicken oder </span>{" "}
        <kbd className="kbd kbd-sm bg-gradient-to-r from-indigo-300 to-purple-300">
          Esc
        </kbd>
        <span className="font-bold">zum Schlissen.</span>
      </button>

      {/* User Profile */}
      <div className="p-6 overflow-auto h-full">
        <TeamMemberProfile userId={userId} />
      </div>
    </motion.div>
  );
};

export default TeamMemberModal;
