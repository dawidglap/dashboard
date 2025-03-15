import React from "react";

const UserBasicInfo = ({ newUser, handleChange }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {/* Email */}
      <div className="col-span-4">
        <label className="text-sm font-medium">E-Mail</label>
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
          disabled={!!newUser._id} // ✅ Disable if editing an existing user
        />
      </div>

      {/* Password (Always visible for admin to reset) */}
      <div className="col-span-4">
        <label className="text-sm font-medium">Passwort</label>
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
          placeholder="Neues Passwort eingeben (optional)"
        />
        <p className="text-xs text-gray-500 italic mt-1">
          Leer lassen, um das aktuelle Passwort beizubehalten.
        </p>
      </div>

      {/* Name & Surname */}
      <div className="col-span-2">
        <label className="text-sm font-medium">Vorname</label>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>
      <div className="col-span-2">
        <label className="text-sm font-medium">Nachname</label>
        <input
          type="text"
          name="surname"
          value={newUser.surname}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Birthday */}
      <div className="col-span-2">
        <label className="text-sm font-medium">Geburtstag</label>
        <input
          type="date"
          name="birthday"
          value={newUser.birthday}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>

      {/* Role Selection */}
      <div className="col-span-2">
        <label className="text-sm font-medium">Rolle</label>
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
          className="select select-sm select-bordered w-full rounded-full"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="markenbotschafter">Markenbotschafter</option>
          <option value="kunde">Kunde</option>
        </select>
      </div>
    </div>
  );
};

export default UserBasicInfo;
