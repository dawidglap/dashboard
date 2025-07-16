"use client";

import Link from "next/link";

const SidebarProfile = ({ user, loading, onClose }) => {
  const ROLE_GRADIENTS = {
    admin: "bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500",
    manager: "bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500",
    markenbotschafter:
      "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
  };

  return (
    <div className="mt-auto flex flex-col items-center">
      <Link
        href="/dashboard/profil"
        onClick={onClose}
        className="flex flex-col items-center group mb-4"
      >
        {loading ? (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
            <p className="mt-2 w-20 h-4 bg-gray-300 animate-pulse"></p>
            <span className="w-16 h-3 bg-gray-300 animate-pulse mt-1"></span>
          </>
        ) : (
          <>
            {/* Avatar with animated background */}
            <div
              className={`w-12 h-12 flex items-center justify-center text-white text-lg font-bold rounded-full overflow-hidden relative 
                ${ROLE_GRADIENTS[user?.role] ||
                "bg-gradient-to-r from-gray-500 to-gray-700"
                }
                animate-gradient-move
              `}
            >
              {user?.name?.charAt(0) || "?"}
              {user?.surname?.charAt(0) || "?"}
            </div>

            {/* Name */}
            <p className="mt-2 font-semibold text-base-content group-hover:underline">
              {user?.name || "Unbekannt"} {user?.surname || ""}
            </p>

            {/* Role */}
            <span className="text-gray-600 text-sm dark:text-gray-400">
              {user?.role || "Unbekannt"}
            </span>
          </>
        )}
      </Link>
    </div>
  );
};

export default SidebarProfile;
