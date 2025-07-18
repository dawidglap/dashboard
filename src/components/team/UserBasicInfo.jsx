import React, { useEffect, useState } from "react";

const UserBasicInfo = ({ newUser, handleChange }) => {
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // ✅ Solo fetch se ruolo = markenbotschafter
    if (newUser.role === "markenbotschafter") {
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) {
            const filtered = data.users.filter(
              (u) => u.role === "manager" || u.role === "admin"
            );
            setManagers(filtered);
          }
        })
        .catch((err) => console.error("❌ Fehler beim Laden der Manager:", err));
    }
  }, [newUser.role]);

  return (
    <div className="grid grid-cols-4 md:grid-cols-2 xl:grid-cols-6 gap-4">
      {/* Email */}
      <div className="col-span-4 md:col-span-2 xl:col-span-6">
        <label className="text-sm font-medium">E-Mail</label>
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
          disabled={!!newUser._id}
        />
      </div>

      {/* Password */}
      <div className="col-span-4 md:col-span-2 xl:col-span-6">
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
      <div className="col-span-2 md:col-span-1 xl:col-span-3">
        <label className="text-sm font-medium">Vorname</label>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleChange}
          className="input input-sm input-bordered w-full rounded-full"
        />
      </div>
      <div className="col-span-2 md:col-span-1 xl:col-span-3">
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
      <div className="col-span-2 md:col-span-1 xl:col-span-3">
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
      <div className="col-span-2 md:col-span-1 xl:col-span-3">
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

      {/* Manager-Auswahl, nur wenn Rolle = markenbotschafter */}
      {newUser.role === "markenbotschafter" && (
        <div className="col-span-4 md:col-span-2 xl:col-span-6 mt-2">
          <label className="text-sm font-medium">Manager zuweisen</label>
          <select
            name="manager_id"
            value={newUser.manager_id || ""}
            onChange={handleChange}
            className="select select-sm select-bordered w-full rounded-full"
          >
            <option value="">-- Bitte wählen --</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.name} {manager.surname} ({manager.email})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>

  );
};

export default UserBasicInfo;
