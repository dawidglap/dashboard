import React from "react";

const UserSubscriptionInfo = ({ newUser, handleChange }) => {
  return (
    <div className=" grid grid-cols-4 md:grid-cols-4 xl:grid-cols-6 gap-4">
      <div className="col-span-4 md:col-span-1 xl:col-span-6 flex flex-col space-y-3 mt-3">
        {/* Subscription Expiration */}
        <div>
          <label className="text-sm font-medium">Abo gültig bis</label>
          <input
            type="date"
            name="subscription_expiration"
            value={newUser.subscription_expiration}
            onChange={handleChange}
            className="input input-sm input-bordered w-full rounded-full"
          />
        </div>

        {/* Account Status Toggle */}
        <label className="flex items-center  justify-end gap-2 p-0 rounded-full">
          <span className="text-sm font-medium">Konto Status</span>
          <input
            type="checkbox"
            checked={newUser.is_active}
            className={`toggle ${newUser.is_active
              ? "toggle-success cursor-not-allowed"
              : "toggle-error cursor-not-allowed"
              }`}
          />
        </label>
      </div>
    </div>
  );
};

export default UserSubscriptionInfo;
