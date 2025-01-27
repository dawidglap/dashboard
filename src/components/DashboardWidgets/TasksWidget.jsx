"use client";

import Link from "next/link";
import { FaTasks } from "react-icons/fa";

const TasksWidget = () => {
  return (
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-yellow-50 to-yellow-100 col-span-2">
      <Link href="/dashboard/aufgaben" className="flex items-start space-x-4">
        <FaTasks className="text-yellow-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Aufgaben</h2>
          <p className="skeleton h-6 w-10 bg-gray-300 rounded animate-pulse"></p>
        </div>
      </Link>
    </div>
  );
};

export default TasksWidget;
