import React from "react";

const UserBasicInfo = ({ newUser, handleChange }) => {
  return (
    <div>
      {/* Email */}
      <div>
        <label className="text-sm font-medium">📧 E-Mail</label>
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="input input-sm input-bordered w-full"
          disabled={!!newUser._id} // ✅ Disable if editing an existing user
        />
      </div>

      {/* Password (Always visible for admin to reset) */}
      <div>
        <label className="text-sm font-medium">🔑 Passwort</label>
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleChange}
          className="input input-sm input-bordered w-full"
          placeholder="Neues Passwort eingeben (optional)"
        />
        <p className="text-xs text-gray-500 italic mt-1">
          Leer lassen, um das aktuelle Passwort beizubehalten.
        </p>
      </div>

      {/* Name & Surname */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">👤 Name</label>
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">📝 Nachname</label>
          <input
            type="text"
            name="surname"
            value={newUser.surname}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>
      </div>

      {/* Birthday */}
      <div>
        <label className="text-sm font-medium">📅 Geburtstag</label>
        <input
          type="date"
          name="birthday"
          value={newUser.birthday}
          onChange={handleChange}
          className="input input-sm input-bordered w-full"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="text-sm font-medium">🎭 Rolle</label>
        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
          className="select select-sm select-bordered w-full"
        >
          <option value="admin">👑 Admin</option>
          <option value="manager">📋 Manager</option>
          <option value="markenbotschafter">🎤 Markenbotschafter</option>
          <option value="kunde">👥 Kunde</option>
        </select>
      </div>
    </div>
  );
};

export default UserBasicInfo;
