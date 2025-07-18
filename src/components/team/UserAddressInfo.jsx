import React from "react";

const UserAddressInfo = ({ newUser, handleChange }) => {
  // ✅ Format phone number live as user types
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "");
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
    <div className="grid grid-cols-4 md:grid-cols-2 xl:grid-cols-6 gap-4">
      {/* Phone Number */}
      <div className="col-span-4 md:col-span-2 xl:col-span-6">
        <label className="text-sm font-medium">Mobile nr.</label>
        <input
          type="text"
          name="phone_number"
          value={newUser.phone_number}
          onChange={handlePhoneChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Street */}
      <div className="col-span-4 md:col-span-1 xl:col-span-4">
        <label className="text-sm font-medium">Strasse</label>
        <input
          type="text"
          name="user_street"
          value={newUser.user_street}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Street Number */}
      <div className="col-span-2 md:col-span-1 xl:col-span-2">
        <label className="text-sm font-medium">Nr.</label>
        <input
          type="text"
          name="user_street_number"
          value={newUser.user_street_number}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* City */}
      <div className="col-span-2 md:col-span-1 xl:col-span-4 xl:mt-5">
        <label className="text-sm font-medium">Ort</label>
        <input
          type="text"
          name="user_city"
          value={newUser.user_city}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Postcode */}
      <div className="col-span-4 md:col-span-1 xl:col-span-2 xl:mt-5">
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
