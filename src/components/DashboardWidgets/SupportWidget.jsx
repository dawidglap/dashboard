"use client";

import Link from "next/link";
import { FaLifeRing } from "react-icons/fa";

const SupportWidget = () => {
  return (
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-gray-50 to-gray-100 col-span-2">
      <Link href="/dashboard/support" className="flex items-start space-x-4">
        <FaLifeRing className="text-gray-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Support</h2>
          <p className="skeleton h-6 w-10 bg-gray-300 rounded animate-pulse"></p>
        </div>
      </Link>
    </div>
  );
};

export default SupportWidget;
