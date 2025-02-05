"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const usersPerPage = 8;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const displayedUsers = users.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-x-auto rounded-xl bg-base-100  p-4"
    >
      <table className="table table-xs w-full rounded-lg border-b border-gray-200 dark:border-gray-700">
        <thead>
          <tr className=" dark:bg-indigo-800 text-base-content text-sm">
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
              <td className="py-4 px-4 font-semibold">{user.name || "N/A"}</td>

              {/* ✅ Clickable Email */}
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

              {/* ✅ Actions */}
              <td className="py-4 px-4 flex justify-center space-x-2">
                <button
                  onClick={() => onEdit(user)}
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

      {/* ✅ Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-sm rounded-full btn-neutral transition-all"
        >
          ← Zurück
        </button>

        <span className="text-gray-700 text-sm">
          Seite {page}
          {/* von {totalPages} */}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="btn btn-sm rounded-full btn-neutral transition-all"
        >
          Weiter →
        </button>
      </div>
    </motion.div>
  );
};

export default UserTable;
