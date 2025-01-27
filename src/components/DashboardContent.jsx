"use client";

import { useState, useEffect } from "react";
import FirmenWidget from "./DashboardWidgets/FirmenWidget";
import UmsatzWidget from "./DashboardWidgets/UmsatzWidget";
import DemoCallsWidget from "./DashboardWidgets/DemoCallsWidget";
import TeamWidget from "./DashboardWidgets/TeamWidget";
import TasksWidget from "./DashboardWidgets/TasksWidget";
import SupportWidget from "./DashboardWidgets/SupportWidget";
import ProfileWidget from "./DashboardWidgets/ProfileWidget";

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
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-600">
            {time.toLocaleTimeString("de-DE")}
          </p>
          <p className="text-sm text-gray-500">
            {time.toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        <FirmenWidget />
        <UmsatzWidget />
        <DemoCallsWidget />
        <TeamWidget />
        <TasksWidget />
        <SupportWidget />
        <ProfileWidget />
      </div>
    </div>
  );
};

export default DashboardContent;
