import React from "react";

const ProfileForm = ({ formData, handleChange, isEditing, user }) => {
  // Convert date format to YYYY-MM-DD for display in input fields
  const formatDateForDisplay = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 ">
      {/* Left Side: Contact Information */}
      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-medium pb-1">
            📧 E-Mail
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`input input-bordered rounded-full rounded-full w-full ${
              isEditing ? "" : "bg-white"
            }`}
          />
        </div>

        {/* Password Info */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            🔑 Passwort
          </label>
          <p className="text-gray-500 text-xs italic">
            ❗ Kontaktieren Sie den Admin, um Ihr Passwort zurückzusetzen.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            📞 Telefon
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            disabled={!isEditing}
            className={`input input-bordered rounded-full w-full ${
              isEditing ? "" : "bg-gray-100"
            }`}
          />
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              🏠 Straße
            </label>
            <input
              type="text"
              name="user_street"
              value={formData.user_street}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input input-bordered rounded-full w-full ${
                isEditing ? "" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              🏢 Nr.
            </label>
            <input
              type="text"
              name="user_street_number"
              value={formData.user_street_number}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input input-bordered rounded-full w-full ${
                isEditing ? "" : "bg-gray-100"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              🏙 Stadt
            </label>
            <input
              type="text"
              name="user_city"
              value={formData.user_city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input input-bordered rounded-full w-full ${
                isEditing ? "" : "bg-gray-100"
              }`}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              📮 PLZ
            </label>
            <input
              type="text"
              name="user_postcode"
              value={formData.user_postcode}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input input-bordered rounded-full w-full ${
                isEditing ? "" : "bg-gray-100"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Right Side: Subscription Info */}
      <div className="space-y-6">
        {/* Subscription Expiration (Read-Only for Regular Users) */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            📆 Abo gültig bis
          </label>
          <input
            type="date"
            name="subscription_expiration"
            value={formatDateForDisplay(formData.subscription_expiration)}
            disabled // ❌ Always disabled for all users here
            className="input input-bordered rounded-full w-full bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nur der Admin kann dieses Datum ändern.
          </p>
        </div>

        {/* Account Status Toggle (Only for Admins) */}
        {user?.role === "admin" && (
          <div className="mt-4">
            <label className="label cursor-pointer">
              <span className="text-gray-700 text-sm font-medium">
                🟢 Konto aktiv
              </span>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  handleChange({
                    target: { name: "is_active", value: e.target.checked },
                  })
                }
                disabled={!isEditing}
                className="toggle ml-2"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
