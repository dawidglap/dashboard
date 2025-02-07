"use client";

import { useState, useEffect } from "react";
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
    <div className="p-6 flex-1">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            {time.toLocaleTimeString("de-DE")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
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
      <div className="grid grid-cols-12 gap-6">
        {/* Umsatz - Large Widget */}
        <div className="col-span-12 md:col-span-6 xl:col-span-5">
          <UmsatzWidget />
        </div>

        {/* Provisionen - Large Widget */}
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <ProvisionenWidget />
        </div>

        {/* Firmen - Medium Widget */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <FirmenWidget />
        </div>

        {/* Demo Calls - Medium Widget */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <DemoCallsWidget />
        </div>

        {/* Team - Small Widget */}
        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <TeamWidget />
        </div>

        {/* Tasks - Small Widget */}
        <div
          className="col-span-12 sm:col-span-6 md:col-span-6
        "
        >
          <TasksWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
