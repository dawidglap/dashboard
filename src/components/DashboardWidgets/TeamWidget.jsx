"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";

const TeamWidget = () => {
  return (
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 col-span-2">
      <Link href="/dashboard/team" className="flex items-start space-x-4">
        <FaUser className="text-purple-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Team</h2>
          <p className="skeleton h-6 w-10 bg-gray-300 rounded animate-pulse"></p>
        </div>
      </Link>
    </div>
  );
};

export default TeamWidget;
