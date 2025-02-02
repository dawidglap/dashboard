import React from "react";

const UserAddressInfo = ({ newUser, handleChange }) => {
  return (
    <div>
      {/* Phone Number */}
      <div>
        <label className="text-sm font-medium">📞 Telefon</label>
        <input
          type="text"
          name="phone_number"
          value={newUser.phone_number}
          onChange={handleChange}
          className="input input-sm input-bordered w-full"
        />
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">🏠 Straße</label>
          <input
            type="text"
            name="user_street"
            value={newUser.user_street}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">🏢 Nr.</label>
          <input
            type="text"
            name="user_street_number"
            value={newUser.user_street_number}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">🏙 Stadt</label>
          <input
            type="text"
            name="user_city"
            value={newUser.user_city}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">📮 PLZ</label>
          <input
            type="text"
            name="user_postcode"
            value={newUser.user_postcode}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default UserAddressInfo;
