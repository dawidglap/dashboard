"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getSession } from "next-auth/react";
import UserFormModal from "./UserFormModal";
import TeamMemberModal from "./TeamMemberModal";

const UserTable = ({ onDelete }) => {
  const [users, setUsers] = useState([]); // ✅ Store fetched users
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef(null);
  const fetchedIds = useRef(new Set()); // ✅ Prevent duplicate entries

  // ✅ Fetch Initial Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.success) {
          const uniqueUsers = data.users.filter(
            (user) => !fetchedIds.current.has(user._id)
          );
          uniqueUsers.forEach((u) => fetchedIds.current.add(u._id));
          setUsers(uniqueUsers);
        }
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Infinite Scroll: Fetch More Users
  const fetchMoreUsers = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(`/api/users?cursor=${users.length}`);
      if (!res.ok) throw new Error("Fehler beim Abrufen weiterer Benutzer.");
      const data = await res.json();

      const newUsers = data.users.filter(
        (user) => !fetchedIds.current.has(user._id)
      );

      newUsers.forEach((u) => fetchedIds.current.add(u._id));
      setUsers((prev) => [...prev, ...newUsers]);
    } catch (err) {
      console.error("❌ Fehler beim Laden weiterer Benutzer:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ✅ Detect Scroll Position (Load More)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchMoreUsers();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [users]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-x-auto max-h-[90vh] overflow-auto rounded-lg"
        ref={containerRef}
      >
        <table className="table table-xs w-full border-b border-gray-200 dark:border-gray-700">
          <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50">
            <tr className="dark:bg-indigo-800 text-base-content text-sm">
              <th className="py-3 px-4 text-left">Vorname</th>
              <th className="py-3 px-4 text-left">E-Mail</th>
              <th className="py-3 px-4 text-left">Geburtstag</th>
              <th className="py-3 px-4 text-left">Rolle</th>
              <th className="py-3 px-4 text-center">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={`${user._id}-${index}`} // ✅ Unique key fix
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm"
              >
                <td
                  className="py-4 px-4 font-semibold text-indigo-600 hover:underline cursor-pointer"
                  onClick={() => setSelectedTeamMember(user._id)}
                >
                  {user.name || "N/A"}
                </td>

                <td className="py-4 px-4">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {user.email}
                  </a>
                </td>
                <td className="py-4 px-4">{user.birthday || "N/A"}</td>
                <td className="py-4 px-4 uppercase text-xs font-medium text-gray-600 dark:text-gray-300">
                  {user.role}
                </td>
                <td className="py-4 px-4 flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsEditModalOpen(true);
                    }}
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
      </motion.div>

      {loadingMore && (
        <p className="text-center text-gray-500 text-xs mt-4">
          Lade weitere...
        </p>
      )}

      {/* ✅ Fullscreen Modal for Editing User */}
      <AnimatePresence>
        {isEditModalOpen && (
          <UserFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={() => {
              fetchUsers();
              setIsEditModalOpen(false);
            }}
            user={selectedUser}
          />
        )}
      </AnimatePresence>

      {selectedTeamMember && (
        <TeamMemberModal
          userId={selectedTeamMember}
          onClose={() => setSelectedTeamMember(null)}
        />
      )}
    </>
  );
};

export default UserTable;
