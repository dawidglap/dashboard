import React from "react";

const ProfileDetails = ({ user }) => {
  if (!user) return <div className="text-gray-500">Kein Benutzer gefunden</div>;

  return (
    <div className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-gray-700 text-sm font-medium pb-1">
          E-Mail
        </label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-gray-700 text-sm font-medium">Rolle</label>
        <input
          type="text"
          value={user?.role || "Unbekannt"}
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-gray-700 text-sm font-medium">
          Mobile nr.
        </label>
        <input
          type="text"
          value={user?.phone_number || ""}
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100"
        />
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            Strasse
          </label>
          <input
            type="text"
            value={user?.user_street || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">Nr.</label>
          <input
            type="text"
            value={user?.user_street_number || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium">Ort</label>
          <input
            type="text"
            value={user?.user_city || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium">PLZ</label>
          <input
            type="text"
            value={user?.user_postcode || ""}
            disabled
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
        </div>
      </div>

      {/* Subscription Expiration */}
      <div>
        <label className="block text-gray-700 text-sm font-medium">
          Abo gültig bis
        </label>
        <input
          type="date"
          value={
            user?.subscription_expiration
              ? new Date(user.subscription_expiration)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          disabled
          className="input input-bordered rounded-full w-full bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Nur der Admin kann dieses Datum ändern.
        </p>
      </div>
    </div>
  );
};

export default ProfileDetails;
