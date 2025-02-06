import React from "react";

const ROLE_COLORS = {
  admin: "bg-red-500",
  manager: "bg-blue-500",
  markenbotschafter: "bg-green-500",
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
    <div className="flex flex-col items-center my-auto ">
      {/* Profile Avatar */}
      <div
        className={`w-24 h-24 flex items-center justify-center text-white text-3xl font-bold rounded-full ${
          ROLE_COLORS[user.role] || "bg-gray-500"
        }`}
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
        <div className="mt-4">
          <label className="label cursor-pointer">
            <span className="text-gray-700 text-sm font-medium mr-2">
              🟢 Konto aktiv
            </span>
            <input
              type="checkbox"
              className="toggle"
              checked={user.is_active ?? true} // Default to true if undefined
              readOnly
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
