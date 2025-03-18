"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import UserTable from "../../../components/team/UserTable";
import UserFormModal from "../../../components/team/UserFormModal";
import DeleteConfirmationModal from "../../../components/team/DeleteConfirmationModal";
import ToastNotification from "../../../components/team/ToastNotification";
import { motion } from "framer-motion";

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

      // ✅ Immediately update the state before setting `userToDelete` to null
      setUsers((prev) => {
        const updatedUsers = prev.filter(
          (user) => user._id !== userToDelete._id
        );
        console.log("✅ Updated Users:", updatedUsers); // Debugging
        return updatedUsers;
      });

      setToastMessage("Benutzer erfolgreich gelöscht.");
    } catch (error) {
      setToastMessage("Fehler beim Löschen: " + error.message);
    } finally {
      setUserToDelete(null); // ✅ Ensure modal closes after deletion
    }
  };

  const handleSaveUser = (newUser) => {
    if (!newUser || !newUser._id) {
      console.error("❌ Error: newUser is missing `_id`!", newUser);
      return;
    }

    if (isEditing) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === newUser._id ? { ...user, ...newUser } : user
        )
      );
      setToastMessage("Benutzer erfolgreich aktualisiert.");
    } else {
      setUsers((prev) => [...prev, newUser]); // ✅ Add new user with correct `_id`
      setToastMessage("Benutzer erfolgreich hinzugefügt.");
    }

    // ✅ Close the modal and reset editing state
    setShowModal(false);
    setIsEditing(false);
    setCurrentUser(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-base-100 px-4 md:px-12"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl mt-8 md:text-4xl font-extrabold text-base-content mb-6">
          Teamübersicht
        </h1>
        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            setCurrentUser(null);
          }}
          className="btn btn-neutral btn-sm rounded-full flex items-center space-x-2 transition-all px-4 hover:text-white"
        >
          <FaPlus />
          <span>Neuer Benutzer</span>
        </button>
      </div>

      {/* ✅ User Table */}
      <UserTable users={users} onEdit={handleEdit} onDelete={setUserToDelete} />

      {/* ✅ Delete Confirmation Modal */}
      {userToDelete && (
        <DeleteConfirmationModal
          user={userToDelete}
          onDelete={handleDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}

      {/* ✅ Toast Notification */}
      {toastMessage && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}

      {/* ✅ User Form Modal */}
      {showModal && (
        <UserFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
          user={currentUser}
        />
      )}
    </motion.div>
  );
};

export default Team;
