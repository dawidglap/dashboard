"use client";

import { useState, useEffect } from "react";

const UserFormModal = ({ isOpen, onClose, onSave, user }) => {
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    birthday: "",
    role: "admin",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Update state when editing a user
  useEffect(() => {
    if (user) {
      setNewUser({
        email: user.email || "",
        password: "", // Password not shown for security reasons
        name: user.name || "",
        surname: user.surname || "",
        birthday: user.birthday || "",
        role: user.role || "admin",
      });
    } else {
      setNewUser({
        email: "",
        password: "",
        name: "",
        surname: "",
        birthday: "",
        role: "admin",
      });
    }
  }, [user]);

  // ✅ Calculate minimum birthday (must be at least 18 years old)
  const today = new Date();
  const minBirthday = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validate & save user
  // ✅ Validate & save user
  const handleSaveUser = async () => {
    setIsSaving(true);
    setError(null);

    // 🔹 Ensure all fields are filled
    if (
      !newUser.email ||
      !newUser.name ||
      !newUser.surname ||
      !newUser.birthday ||
      !newUser.role
    ) {
      setError("Bitte füllen Sie alle Felder aus.");
      setIsSaving(false);
      return;
    }

    // 🔹 Ensure user is at least 18 years old
    const selectedDate = new Date(newUser.birthday);
    if (selectedDate > new Date(minBirthday)) {
      setError("Der Benutzer muss mindestens 18 Jahre alt sein.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user?._id,
          ...newUser,
          password: newUser.password || undefined, // Password optional when editing
        }),
      });

      const data = await res.json();
      console.log("📥 API RESPONSE:", data); // 🟢 Debugging Log

      // ✅ Handle the `POST` request (returns the new user object)
      if (!user && data.success && data.data && data.data._id) {
        onSave(data.data); // Save the new user
      }

      // ✅ Handle the `PUT` request (only returns a success message)
      else if (user && data.success) {
        onSave({ ...newUser, _id: user._id }); // 🟢 Manually assign `_id` for updates
      } else {
        throw new Error(
          data.message || "Fehler: Benutzer-ID fehlt in der Antwort."
        );
      }

      onClose();
    } catch (error) {
      console.error("❌ Fehler:", error.message);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    isOpen && (
      <div className="modal modal-open">
        <div className="modal-box space-y-4 bg-indigo-100">
          <h3 className="text-lg font-semibold text-gray-700">
            {user ? "Benutzer bearbeiten" : "Neuen Benutzer hinzufügen"}
          </h3>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">📧 E-Mail</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
              disabled={!!user}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">🔑 Passwort</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
              placeholder={user ? "Leer lassen, um nicht zu ändern" : ""}
            />
          </div>

          {/* Name */}
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

          {/* Surname */}
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

          {/* Birthday */}
          <div>
            <label className="text-sm font-medium">📅 Geburtstag</label>
            <input
              type="date"
              name="birthday"
              value={newUser.birthday}
              onChange={handleChange}
              max={minBirthday} // ✅ Only past dates, user must be 18+
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

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Modal Actions */}
          <div className="modal-action flex justify-between">
            <button
              onClick={onClose}
              className="btn btn-sm bg-red-400 hover:bg-red-500"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSaveUser}
              className="btn btn-sm bg-green-500 hover:bg-green-600"
              disabled={isSaving}
            >
              {isSaving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserFormModal;
