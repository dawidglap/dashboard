import React from "react";

// ✅ Define linear gradients for each role with animation
const ROLE_GRADIENTS = {
  admin: "bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500",
  manager: "bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500",
  markenbotschafter:
    "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
};

const ProfileAvatar = ({ user, isLoading }) => {
  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center">
        {/* Skeleton for avatar */}
        <div className="w-24 h-24 rounded-full skeleton"></div>
        <p className="mt-3 font-semibold text-gray-400 skeleton w-20 h-4"></p>
        <span className="text-gray-400 text-sm skeleton w-16 h-3"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center my-auto">
      {/* Profile Avatar with Animated Gradient */}
      <div
        className={`w-24 h-24 flex items-center justify-center text-white text-3xl font-bold rounded-full shadow-lg
          ${
            ROLE_GRADIENTS[user.role] ||
            "bg-gradient-to-br from-gray-500 to-gray-700"
          }
          bg-[length:200%_200%] animate-gradientMove
        `}
      >
        {user.name?.charAt(0) || "?"}
        {user.surname?.charAt(0) || "?"}
      </div>

      {/* Name */}
      <p className="mt-3 font-semibold text-gray-800">
        {user.name || "Unbekannt"} {user.surname || ""}
      </p>

      {/* Role */}
      <span className="text-gray-600 text-sm capitalize">
        {user.role || "Unbekannt"}
      </span>

      {/* Account Status Toggle (Only for Admins) */}
      {user.role === "admin" && (
        <div className="mt-4 flex items-center justify-between p-3 rounded-full px-4 bg-gray-100 shadow-inner">
          <span className="text-sm font-bold text-gray-700 me-3">
            Konto Status
          </span>
          <input
            type="checkbox"
            className={`toggle ${
              user.is_active ? "toggle-success" : "toggle-error"
            }`}
            checked={user.is_active ?? true} // ✅ Default to true if undefined
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
