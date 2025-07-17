import React from "react";

const ProfileDetails = ({ user }) => {
  if (!user) return <div className="text-gray-500 text-sm sm:text-base">Kein Benutzer gefunden</div>;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Email */}
      <div>
        <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
          E-Mail
        </label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
          Rolle
        </label>
        <input
          type="text"
          value={
            user?.role
              ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
              : "Unbekannt"
          }
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
          Mobile nr.
        </label>
        <input
          type="text"
          value={user?.phone_number || ""}
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
        />
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
            Strasse
          </label>
          <input
            type="text"
            value={user?.user_street || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
            Nr.
          </label>
          <input
            type="text"
            value={user?.user_street_number || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
            Ort
          </label>
          <input
            type="text"
            value={user?.user_city || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
            PLZ
          </label>
          <input
            type="text"
            value={user?.user_postcode || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Subscription Expiration */}
      <div>
        <label className="block text-gray-700 text-xs sm:text-sm font-medium pb-1">
          Abo gültig bis
        </label>
        <input
          type="date"
          value={
            user?.subscription_expiration
              ? new Date(user.subscription_expiration).toISOString().split("T")[0]
              : ""
          }
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100 text-xs sm:text-sm"
        />
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
          Nur der Admin kann dieses Datum ändern.
        </p>
      </div>
    </div>
  );
};

export default ProfileDetails;
