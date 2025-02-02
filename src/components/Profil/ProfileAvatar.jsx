import React from "react";

const ROLE_COLORS = {
  admin: "bg-red-500",
  manager: "bg-blue-500",
  markenbotschafter: "bg-green-500",
};

const ProfileAvatar = ({ user }) => {
  if (!user) {
    return (
      <div className="w-1/3 flex flex-col items-center">
        {/* Placeholder while loading */}
        <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse"></div>
        <p className="mt-3 font-semibold text-gray-400">Lädt...</p>
        <span className="text-gray-400 text-sm">---</span>
      </div>
    );
  }

  return (
    <div className="w-1/3 flex flex-col items-center">
      <div
        className={`w-24 h-24 flex items-center justify-center text-white text-3xl font-bold rounded-full ${
          ROLE_COLORS[user.role] || "bg-gray-500"
        }`}
      >
        {user.name?.charAt(0) || "?"}
        {user.surname?.charAt(0) || "?"}
      </div>
      <p className="mt-3 font-semibold">
        {user.name || "Unbekannt"} {user.surname || ""}
      </p>
      <span className="text-gray-600 text-sm capitalize">
        {user.role || "Unbekannt"}
      </span>

      {/* Account Status Toggle (Only for Admin) */}
      {user.role === "admin" && (
        <div className="mt-4">
          <label className="label cursor-pointer">
            <span className="mr-2">🟢 Konto aktiv</span>
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
