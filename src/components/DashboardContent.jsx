"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FirmenWidget from "./DashboardWidgets/FirmenWidget";
import UmsatzWidget from "./DashboardWidgets/UmsatzWidget";
import ProvisionenWidget from "./DashboardWidgets/ProvisionenWidget";
import DemoCallsWidget from "./DashboardWidgets/DemoCallsWidget";
import TeamWidget from "./DashboardWidgets/TeamWidget";
import TasksWidget from "./DashboardWidgets/TasksWidget";

const DashboardContent = ({ user, companies, commissions }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isMarkenbotschafter = user?.role === "markenbotschafter";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen p-6 flex-1 bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl"
    >
      {/* Header Section */}
      <div className="mb-8 pt-0 md:pt-0 flex flex-col md:flex-row justify-between items-center md:items-center gap-2 md:gap-0">
        {/* Titolo Mobile */}
        <h1 className="w-full text-center md:hidden text-xl font-extrabold text-gray-900 dark:text-white">
          Webomo Business
        </h1>

        {/* Titolo Desktop */}
        <h1 className="hidden md:block text-3xl font-extrabold text-gray-900 dark:text-white">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>

        {/* Ora + Data solo su desktop */}
        <div className="hidden md:block text-right">
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




      {/* 🚀 Bento Grid Layout */}
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
        {/* Umsatz (Always Visible) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 lg:col-span-6 xl:col-span-5"
        >
          <UmsatzWidget />
        </motion.div>

        {/* Provisionen (Always Visible) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 lg:col-span-6 xl:col-span-4"
        >
          <ProvisionenWidget commissions={commissions} />
        </motion.div>

        {/* Firmen (Filtered for Managers/Markenbotschafters) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 lg:col-span-7 xl:col-span-3"
        >
          <FirmenWidget companies={companies} />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3  lg:hidden"
        >
          <TeamWidget />
        </motion.div>

        {/* Demo Calls (Only for Admins) */}
        {isAdmin && (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="col-span-12 sm:col-span-12 lg:col-span-5 xl:col-span-4"
          >
            <DemoCallsWidget />
          </motion.div>
        )}

        {/* Team (Handled later) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3 sm:hidden md:hidden lg:block"
        >
          <TeamWidget />
        </motion.div>

        {/* Tasks (Always Visible) */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="col-span-12 md:col-span-12 lg:col-span-8 xl:col-span-5"
        >
          <TasksWidget />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
