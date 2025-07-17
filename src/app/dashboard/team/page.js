"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import UserTable from "../../../components/team/UserTable";
import UserFormModal from "../../../components/team/UserFormModal";
import DeleteConfirmationModal from "../../../components/team/DeleteConfirmationModal";
import ToastNotification from "../../../components/team/ToastNotification";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";
import TeamMemberProfileCompact from "@/components/team/TeamMemberProfileCompact";
import TeamHeader from "@/components/Team/TeamHeader";



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

  const { data: session, status } = useSession();
const user = session?.user;

const [fullUser, setFullUser] = useState(null);

useEffect(() => {
  if (user?.role === "manager" || user?.role === "markenbotschafter") {
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => setFullUser(data.user));
  }
}, [user]);
if ((user?.role === "manager" || user?.role === "markenbotschafter") && fullUser) {
  return user?.role === "manager" ? (
    <TeamMemberProfileCompact userId={fullUser._id} />
  ) : (
    <TeamMemberProfile userId={fullUser._id} />
  );
  
}



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
    <div className="px-4 md:px-12">
      {/* Mobile Skeleton Cards */}
      <div className="block md:hidden space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-2 animate-pulse"
          >
            <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm mt-4">
        <table className="table table-xs w-full">
          <thead>
            <tr className="text-sm text-base-content dark:text-white border-b border-indigo-300">
              <th className="py-3 px-4 text-left">
                Name <span className="loading loading-spinner loading-xs ms-2" />
              </th>
              <th className="py-3 px-4 text-left">E-Mail</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Rolle</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">Geburtstag</th>
              <th className="py-3 px-4 text-center">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, index) => (
              <tr key={index} className="animate-pulse border-b border-gray-200">
                {[...Array(5)].map((_, i) => (
                  <td key={i} className="py-4 px-4">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
   <TeamHeader
  userRole={user?.role}
  onAdd={() => {
    setShowModal(true);
    setIsEditing(false);
    setCurrentUser(null);
  }}
/>


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
