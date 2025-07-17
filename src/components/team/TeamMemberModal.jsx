"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import TeamMemberProfile from "./TeamMemberProfile";

const TeamMemberModal = ({ userId, onClose }) => {
  if (!userId) return null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
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
      className={`
        fixed top-0 h-full z-50
        w-full xl:w-[calc(100%-16rem)]
        bg-white dark:bg-gray-900 shadow-lg
        md:left-64 md:right-0
        left-0 right-0
      `}
    >
      {/* 🔹 Bottone ESC visibile solo da xl */}
      <button
        onClick={onClose}
        className="hidden xl:flex absolute top-12 right-12 bg-indigo-50 shadow-lg p-2 rounded-full px-4 items-center space-x-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
      >
        <span className="font-bold">Klicken oder</span>{" "}
        <kbd className="kbd kbd-sm bg-gradient-to-r from-indigo-300 to-purple-300">
          Esc
        </kbd>
        <span className="font-bold">zum Schließen.</span>
      </button>

      {/* 👤 Profilo utente */}
      <div className="p-6 overflow-auto h-full ">
        <TeamMemberProfile userId={userId} />
      </div>
      {/* 🔙 Bottone di chiusura visibile solo su mobile/tablet */}
      <button
        onClick={onClose}
        className="xl:hidden absolute top-4 right-4 bg-indigo-100 text-indigo-700 dark:bg-gray-800 dark:text-white rounded-full px-4 py-1 text-sm shadow-md hover:bg-indigo-200 dark:hover:bg-gray-700 transition"
      >
        ← Zurück
      </button>

    </motion.div>

  );
};

export default TeamMemberModal;
