"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getSession } from "next-auth/react";
import UserFormModal from "./UserFormModal";
import TeamMemberModal from "./TeamMemberModal";
import { FaSyncAlt } from "react-icons/fa"; // ✅ Add this at the top with other imports

const UserTable = ({ onDelete }) => {
  const [users, setUsers] = useState([]); // ✅ Store fetched users
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState(""); // ✅ Filter state
  const containerRef = useRef(null);
  const [roleFilter, setRoleFilter] = useState(""); // ✅ Nuovo stato per filtrare per ruolo

  const fetchedIds = useRef(new Set()); // ✅ Prevent duplicate entries
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.users); // ✅ Overwrite users list to refresh
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Initial Users
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Infinite Scroll: Fetch More Users
  const fetchMoreUsers = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(`/api/users`);
      const data = await res.json();

      if (data.users && Array.isArray(data.users)) {
        setUsers((prevUsers) => {
          const newUsers = data.users.filter(
            (user) => !prevUsers.some((u) => u._id === user._id)
          );
          return [...prevUsers, ...newUsers];
        });
      } else {
        console.error("❌ API returned unexpected format:", data);
      }
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

  // ✅ Apply Filtering on Already Loaded Data (No API call needed for now)
  const filteredUsers = users.filter((user) => {
    const matchesName = filter
      ? `${user.name} ${user.surname}`.toLowerCase().includes(filter.toLowerCase())
      : true;


    const matchesRole = roleFilter ? user.role === roleFilter : true;

    return matchesName && matchesRole;
  });

  return (
    <>
      {/* ✅ Filter Dropdown & Total Count */}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {/* 🔹 Dropdown for user names */}
          <select
            className="px-4 my-2 ms-1 w-72 select select-sm select-bordered rounded-full bg-indigo-100 text-smf"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Mitglieder</option>
            {[...new Set(users.map((u) => `${u.name} ${u.surname}`))].map((fullName, i) => (
              <option key={i} value={fullName}>
                {fullName}
              </option>
            ))}
          </select>

          {/* 🔹 Reset button with FaSyncAlt icon */}
          <button
            onClick={() => {
              setFilter("");
              setRoleFilter("");
            }}
            className="btn btn-outline btn-sm rounded-full flex items-center justify-center w-16 px-4 h-8"
            title="Filter zurücksetzen"
          >
            <FaSyncAlt className="w-4 h-4" />
          </button>
        </div>

        {/* 🔹 Role filter buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setRoleFilter("")}
            className={`p-2 px-4 text-sm rounded-full border ${roleFilter === ""
              ? "bg-indigo-600 text-white"
              : "bg-indigo-50 text-gray-700"
              }`}
          >
            Alle Mitglieder: <span className="font-bold">{users.length}</span>
          </button>
          <button
            onClick={() => setRoleFilter("manager")}
            className={`p-2 px-4 text-sm rounded-full border ${roleFilter === "manager"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-50 text-gray-700"
              }`}
          >
            Business Partners:{" "}
            <span className="font-bold">
              {users.filter((user) => user.role === "manager").length}
            </span>
          </button>
          <button
            onClick={() => setRoleFilter("markenbotschafter")}
            className={`p-2 px-4 text-sm rounded-full border ${roleFilter === "markenbotschafter"
              ? "bg-indigo-600 text-white"
              : "bg-indigo-50 text-gray-700"
              }`}
          >
            Markenbotschafter:{" "}
            <span className="font-bold">
              {users.filter((user) => user.role === "markenbotschafter").length}
            </span>
          </button>
        </div>
      </div>

      {/* ✅ Scrollable Table with Fixed Header */}
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
              <th className="py-3 px-4 text-left">Vor- und Nachname</th>
              <th className="py-3 px-4 text-left">E-Mail</th>
              <th className="py-3 px-4 text-left">Geburtstag</th>
              <th className="py-3 px-4 text-left">Rolle</th>
              <th className="py-3 px-4 text-center">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr
                key={`${user._id}-${index}`} // ✅ Unique key fix
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm"
              >
                <td
                  className="py-4 px-4 font-semibold text-indigo-600 hover:underline cursor-pointer"
                  onClick={() => setSelectedTeamMember(user._id)}
                >
                  {user.name || "N/A"}
                  <span> </span>
                  {user.surname || "N/A"}
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
            onSave={fetchUsers} // ✅ Just pass fetchUsers
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
