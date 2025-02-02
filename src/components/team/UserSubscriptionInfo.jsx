import React from "react";

const UserSubscriptionInfo = ({ newUser, handleChange }) => {
  return (
    <div>
      {/* Subscription Expiration */}
      <div>
        <label className="text-sm font-medium">📆 Abo gültig bis</label>
        <input
          type="date"
          name="subscription_expiration"
          value={newUser.subscription_expiration}
          onChange={handleChange}
          className="input input-sm input-bordered w-full"
        />
      </div>

      {/* Account Status (Auto-updated based on expiration) */}
      <label className="flex items-center cursor-pointer mt-2">
        <span className="text-sm mr-2">
          {newUser.is_active ? "🟢 Konto aktiv" : "🔴 Konto inaktiv"}
        </span>
        <input
          type="checkbox"
          checked={newUser.is_active}
          className="toggle"
          disabled
        />
      </label>
    </div>
  );
};

export default UserSubscriptionInfo;
