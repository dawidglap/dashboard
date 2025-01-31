"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null); // State for deletion confirmation
  const [toastMessage, setToastMessage] = useState(""); // For displaying toast messages
  const [editing, setEditing] = useState(null); // Track the user being edited
  const [formData, setFormData] = useState({}); // Track the form inputs for editing
  const [isEditing, setIsEditing] = useState(false); // Editing mode
  const [currentUser, setCurrentUser] = useState(null); // User being edited
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    birthday: "",
    role: "admin",
  }); // Data for the new user
  const [showModal, setShowModal] = useState(false); // Modal state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Abrufen der Benutzerdaten.");
        const data = await res.json();
        setUsers(data.users || []);
        console.log("🔍 USERS DATA LOADED:", data.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setIsEditing(true); // Enable editing mode
    setCurrentUser(user); // Set the user being edited
    setNewUser({
      email: user.email,
      password: "", // Leave password blank for editing
      name: user.name || "",
      surname: user.surname || "",
      birthday: user.birthday || "",
      role: user.role || "kunde",
    });
    setShowModal(true); // Open the modal
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
  };

  //   const handleSave = async (id) => {
  //     try {
  //       const res = await fetch("/api/users", {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ id, ...formData }),
  //       });

  //       if (!res.ok) throw new Error("Fehler beim Aktualisieren des Benutzers.");

  //       setUsers((prev) =>
  //         prev.map((user) => (user._id === id ? { ...user, ...formData } : user))
  //       );

  //       setEditing(null);
  //       setFormData({});
  //       setToastMessage("Benutzer erfolgreich aktualisiert.");
  //     } catch (error) {
  //       setToastMessage("Fehler beim Speichern: " + error.message);
  //     }
  //   };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`/api/users?id=${userToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Fehler beim Löschen des Benutzers.");

      setUsers((prev) => prev.filter((user) => user._id !== userToDelete._id));
      setUserToDelete(null); // Close the modal after deletion
      setToastMessage("Benutzer erfolgreich gelöscht.");
    } catch (error) {
      setToastMessage("Fehler beim Löschen: " + error.message);
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;

    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const handleNewUserSubmit = async () => {
  //     // Ensure all fields are filled, including password
  //     if (
  //       !newUser.email ||
  //       !newUser.password ||
  //       !newUser.name ||
  //       !newUser.surname ||
  //       !newUser.birthday ||
  //       !newUser.role
  //     ) {
  //       setToastMessage("Bitte füllen Sie alle Felder aus.");
  //       return;
  //     }

  //     try {
  //       const res = await fetch("/api/users", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newUser),
  //       });

  //       const data = await res.json();

  //       if (!res.ok) throw new Error(data.message || "Fehler beim Hinzufügen.");

  //       // Update the user list and reset the form
  //       setUsers((prev) => [...prev, { ...newUser, _id: data.data }]);
  //       setNewUser({
  //         email: "",
  //         password: "", // Reset password field
  //         name: "",
  //         surname: "",
  //         birthday: "",
  //         role: "admin",
  //       });
  //       setShowModal(false); // Close the modal
  //       setToastMessage("Benutzer erfolgreich hinzugefügt.");
  //     } catch (error) {
  //       console.error("API Error:", error.message);
  //       setToastMessage("Fehler beim Hinzufügen: " + error.message);
  //     }
  //   };

  const handleModalSubmit = async () => {
    if (isEditing) {
      // Editing an existing user
      try {
        const res = await fetch("/api/users", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: currentUser._id, ...newUser }),
        });

        if (!res.ok)
          throw new Error("Fehler beim Aktualisieren des Benutzers.");

        // Update the user list
        setUsers((prev) =>
          prev.map((user) =>
            user._id === currentUser._id ? { ...user, ...newUser } : user
          )
        );

        setToastMessage("Benutzer erfolgreich aktualisiert.");
      } catch (error) {
        setToastMessage("Fehler beim Speichern: " + error.message);
      }
    } else {
      // Adding a new user
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Fehler beim Hinzufügen.");

        // Add the new user to the list
        setUsers((prev) => [...prev, { ...newUser, _id: data.data }]);
        setToastMessage("Benutzer erfolgreich hinzugefügt.");
      } catch (error) {
        setToastMessage("Fehler beim Hinzufügen: " + error.message);
      }
    }

    // Reset the modal state
    setShowModal(false);
    setIsEditing(false);
    setCurrentUser(null);
    setNewUser({
      email: "",
      password: "",
      name: "",
      surname: "",
      birthday: "",
      role: "admin",
    });
  };

  if (loading)
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Team</h1>
        <div className="flex justify-center py-10">
          <progress className="progress w-56"></progress>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Team</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-warning btn-sm flex items-center space-x-2"
        >
          <FaPlus />
          <span>Neuer Benutzer</span>
        </button>
      </div>

      {userToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-500">
              Benutzer löschen: {userToDelete.name || "Unbenannt"}
            </h3>
            <p className="py-4">
              Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error">
                Löschen
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="btn btn-neutral"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setToastMessage("")}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">E-Mail</th>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Geburtstag</th>
              <th className="py-4 px-6">Rolle</th>
              <th className="py-4 px-6">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                <td className="py-4 px-6">{user.email ? user.email : "N/A"}</td>

                <td className="py-4 px-6">
                  {editing === user._id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleNewUserChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    user.name || "N/A"
                  )}
                </td>
                <td className="py-4 px-6">
                  {editing === user._id ? (
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday || ""}
                      onChange={handleNewUserChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    user.birthday || "N/A"
                  )}
                </td>
                <td className="py-4 px-6">
                  {editing === user._id ? (
                    <select
                      name="role"
                      value={formData.role || ""}
                      onChange={handleNewUserChange}
                      className="select select-bordered select-sm w-full"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="markenbotschafter">
                        Markenbotschafter
                      </option>
                      <option value="kunde">Kunde</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-4 px-6 space-x-2">
                  <button
                    onClick={() => handleEdit(user)} // Opens the modal for editing
                    className="btn btn-neutral btn-xs"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setUserToDelete(user)} // Opens the delete confirmation modal
                    className="btn btn-error btn-xs"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {isEditing ? "Benutzer bearbeiten" : "Neuen Benutzer hinzufügen"}
            </h3>
            <form>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">E-Mail</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="input input-bordered"
                  disabled={isEditing} // Disable email field when editing
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Passwort</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Nachname</span>
                </label>
                <input
                  type="text"
                  name="surname"
                  value={newUser.surname}
                  onChange={handleNewUserChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Geburtstag</span>
                </label>
                <input
                  type="date"
                  name="birthday"
                  value={newUser.birthday}
                  onChange={handleNewUserChange}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Rolle</span>
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleNewUserChange}
                  className="select select-bordered"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="markenbotschafter">Markenbotschafter</option>
                  <option value="kunde">Kunde</option>
                </select>
              </div>
            </form>
            <div className="modal-action">
              <button onClick={handleModalSubmit} className="btn btn-success">
                {isEditing ? "Speichern" : "Erstellen"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setCurrentUser(null);
                }}
                className="btn btn-error"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
