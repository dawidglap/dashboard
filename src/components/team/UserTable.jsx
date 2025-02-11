"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import UserFormModal from "./UserFormModal"; // ✅ Import modal

const UserTable = ({ users, onDelete }) => {
  const [page, setPage] = useState(1);
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const usersPerPage = 8;

  // ✅ Fetch updated users after an edit
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUserList(data.users);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // ✅ Fetch users when the component mounts
  }, []);

  // ✅ Handle Edit Click (Opens Modal)
  const handleEdit = (user) => {
    console.log("🟢 Editing user:", user);
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const totalPages = Math.ceil(userList.length / usersPerPage);
  const displayedUsers = userList.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-x-auto"
      >
        <table className="table table-xs w-full border-b border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="dark:bg-indigo-800 text-base-content text-sm">
              <th className="py-3 px-4 text-left">Vorname</th>
              <th className="py-3 px-4 text-left">E-Mail</th>
              <th className="py-3 px-4 text-left">Geburtstag</th>
              <th className="py-3 px-4 text-left">Rolle</th>
              <th className="py-3 px-4 text-center">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm"
              >
                <td className="py-4 px-4 font-semibold text-indigo-600 hover:underline cursor-pointer">
                  {user.name || "N/A"}
                </td>
                <td className="py-4 px-4">
                  {user.email ? (
                    <a
                      href={`mailto:${user.email}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {user.email}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-4 px-4">{user.birthday || "N/A"}</td>
                <td className="py-4 px-4 uppercase text-xs font-medium text-gray-600 dark:text-gray-300">
                  {user.role}
                </td>
                <td className="py-4 px-4 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(user)} // ✅ Open Edit Modal
                    className="btn btn-xs btn-outline btn-neutral rounded-full"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="btn btn-xs btn-outline btn-error rounded-full"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn btn-sm rounded-full btn-neutral transition-all"
          >
            ← Zurück
          </button>

          <span className="text-gray-700 text-sm">Seite {page}</span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-sm rounded-full btn-neutral transition-all"
          >
            Weiter →
          </button>
        </div>
      </motion.div>

      {/* ✅ Fullscreen Modal for Editing User */}
      <AnimatePresence>
        {isEditModalOpen && (
          <UserFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedUser) => {
              console.log("✅ User saved:", updatedUser);
              fetchUsers(); // ✅ Refresh list after edit
              setIsEditModalOpen(false);
            }}
            user={selectedUser}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default UserTable;
