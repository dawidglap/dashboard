"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FirmenWidget from "./DashboardWidgets/FirmenWidget";
import UmsatzWidget from "./DashboardWidgets/UmsatzWidget";
import ProvisionenWidget from "./DashboardWidgets/ProvisionenWidget";
import DemoCallsWidget from "./DashboardWidgets/DemoCallsWidget";
import TeamWidget from "./DashboardWidgets/TeamWidget";
import TasksWidget from "./DashboardWidgets/TasksWidget";

const DashboardContent = ({ user }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-screen p-6 flex-1  bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl "
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {time.toLocaleTimeString("de-DE")}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {time.toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* 🚀 Bento Grid Layout: Improved Sizing & Balance */}
      <motion.div
        className="grid grid-cols-12 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }, // Delays each widget animation
          },
        }}
      >
        {/* Umsatz - Large Widget */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 md:col-span-6 xl:col-span-5"
        >
          <UmsatzWidget />
        </motion.div>

        {/* Provisionen - Large Widget */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 md:col-span-6 xl:col-span-4"
        >
          <ProvisionenWidget />
        </motion.div>

        {/* Firmen - Medium Widget */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 md:col-span-3"
        >
          <FirmenWidget />
        </motion.div>

        {/* Demo Calls - Medium Widget */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 md:col-span-3"
        >
          <DemoCallsWidget />
        </motion.div>

        {/* Team - Small Widget */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 md:col-span-3"
        >
          <TeamWidget />
        </motion.div>

        {/* Tasks - Small Widget */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 md:col-span-6"
        >
          <TasksWidget />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
