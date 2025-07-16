import { useState, useEffect } from "react";
import Link from "next/link";
import { FaMoneyBillWave } from "react-icons/fa";

const SidebarDropdown = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Fehler beim Laden des Profils");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("❌ Fehler:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <li>
      {/* ✅ Provisionen main link */}
      <Link
        href="/dashboard/provisionen"
        onClick={onClose}
        className="flex items-center w-full px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
      >
        <FaMoneyBillWave className="text-lg" />
        <span className="ml-4">Provisionen</span>
      </Link>

      {/* ✅ Always visible Details */}
      <ul className="ml-8 mt-2 space-y-1">
        <li>
          <Link
            href="/dashboard/provisionen/details"
            onClick={onClose}
            className="block px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
          >
            Details
          </Link>
        </li>
      </ul>
    </li>
  );
};

export default SidebarDropdown;
