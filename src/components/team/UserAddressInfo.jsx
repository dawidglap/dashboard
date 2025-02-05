import React from "react";

const UserAddressInfo = ({ newUser, handleChange }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Phone Number */}
      <div className="col-span-4">
        <label className="text-sm font-medium">Telefon</label>
        <input
          type="text"
          name="phone_number"
          value={newUser.phone_number}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Address Fields */}
      <div className="col-span-3">
        <label className="text-sm font-medium">Straße</label>
        <input
          type="text"
          name="user_street"
          value={newUser.user_street}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>
      <div className="col-span-1">
        <label className="text-sm font-medium">Nr.</label>
        <input
          type="text"
          name="user_street_number"
          value={newUser.user_street_number}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      <div className="col-span-3 mt-5">
        <label className="text-sm font-medium">Stadt</label>
        <input
          type="text"
          name="user_city"
          value={newUser.user_city}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>
      <div className="col-span-1 mt-5">
        <label className="text-sm font-medium">PLZ</label>
        <input
          type="text"
          name="user_postcode"
          value={newUser.user_postcode}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>
    </div>
  );
};

export default UserAddressInfo;
