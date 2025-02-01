"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import UserTable from "../../../components/team/UserTable";
import UserFormModal from "../../../components/team/UserFormModal";
import DeleteConfirmationModal from "../../../components/team/DeleteConfirmationModal";
import ToastNotification from "../../../components/team/ToastNotification";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Abrufen der Benutzerdaten.");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users?id=${userToDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Fehler beim Löschen des Benutzers.");
      setUsers((prev) => prev.filter((user) => user._id !== userToDelete._id));
      setToastMessage("Benutzer erfolgreich gelöscht.");
    } catch (error) {
      setToastMessage("Fehler beim Löschen: " + error.message);
    }
    setUserToDelete(null);
  };

  const handleSaveUser = (newUser) => {
    if (isEditing) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === newUser._id ? { ...user, ...newUser } : user
        )
      );
      setToastMessage("Benutzer erfolgreich aktualisiert.");
    } else {
      setUsers((prev) => [
        ...prev,
        { ...newUser, _id: newUser._id || "TEMP_ID" }, // Ensure `_id` exists
      ]);

      setToastMessage("Benutzer erfolgreich hinzugefügt.");
    }
    setShowModal(false);
    setIsEditing(false);
    setCurrentUser(null);
  };

  if (loading) return <p className="text-center text-lg">Lädt...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Teamübersicht</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setCurrentUser(null);
          }}
          className="btn btn-neutral btn-sm flex items-center space-x-2"
        >
          <FaPlus />
          <span>Neuer Benutzer</span>
        </button>
      </div>

      <UserTable users={users} onEdit={handleEdit} onDelete={setUserToDelete} />

      {userToDelete && (
        <DeleteConfirmationModal
          user={userToDelete}
          onDelete={handleDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}

      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}

      {showModal && (
        <UserFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          user={currentUser}
        />
      )}
    </div>
  );
};

export default Team;
