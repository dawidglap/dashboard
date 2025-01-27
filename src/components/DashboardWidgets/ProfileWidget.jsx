"use client";

import Link from "next/link";
import { FaUser } from "react-icons/fa";

const ProfileWidget = () => {
  return (
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-pink-50 to-pink-100 col-span-2">
      <Link href="/dashboard/profile" className="flex items-start space-x-4">
        <FaUser className="text-pink-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Profile</h2>
          <p className="skeleton h-6 w-10 bg-gray-300 rounded animate-pulse"></p>
        </div>
      </Link>
    </div>
  );
};

export default ProfileWidget;
