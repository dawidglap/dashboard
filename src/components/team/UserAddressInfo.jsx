import React from "react";

const UserAddressInfo = ({ newUser, handleChange }) => {
  // ✅ Format phone number live as user types
  const formatPhoneNumber = (value) => {
    // Remove non-numeric characters
    const digits = value.replace(/\D/g, "");

    // Apply formatting: 3-3-2-2
    const parts = [];
    if (digits.length > 0) parts.push(digits.substring(0, 3));
    if (digits.length > 3) parts.push(digits.substring(3, 6));
    if (digits.length > 6) parts.push(digits.substring(6, 8));
    if (digits.length > 8) parts.push(digits.substring(8, 10));

    return parts.join(" ");
  };

  // ✅ Handle phone input change with formatting
  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    handleChange({ target: { name: "phone_number", value: formattedValue } });
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Phone Number */}
      <div className="col-span-4">
        <label className="text-sm font-medium">Mobile nr.</label>
        <input
          type="text"
          name="phone_number"
          value={newUser.phone_number}
          onChange={handlePhoneChange} // ✅ Custom handler for formatting
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Address Fields */}
      <div className="col-span-3">
        <label className="text-sm font-medium">Strasse</label>
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
        <label className="text-sm font-medium">Ort</label>
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
