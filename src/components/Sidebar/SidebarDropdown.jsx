import { useState, useEffect } from "react";
import Link from "next/link";
import { FaMoneyBillWave } from "react-icons/fa";

const SidebarDropdown = () => {
  const [open, setOpen] = useState(false);
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

  const isRestricted =
    user && (user.role === "manager" || user.role === "markenbotschafter");

  return (
    <li>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
      >
        <div className="flex items-center">
          <FaMoneyBillWave className="text-lg" />
          <span className="ml-4">Provisionen</span>
        </div>
      </button>

      {open && (
        <ul className="ml-8 mt-2 space-y-1">
          {/* Übersicht - Disabled for Manager & Markenbotschafter */}
          <li>
            {isRestricted ? (
              <div className="tooltip tooltip-top" data-tip="Nur Admin">
                <button className="block px-4 py-2 rounded-full transition-all text-sm text-gray-400 cursor-not-allowed">
                  Übersicht
                </button>
              </div>
            ) : (
              <Link
                href="/dashboard/provisionen"
                className="block px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
              >
                Übersicht
              </Link>
            )}
          </li>

          {/* Details - Always Accessible */}
          <li>
            <Link
              href="/dashboard/provisionen/details"
              className="block px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
            >
              Details
            </Link>
          </li>
        </ul>
      )}
    </li>
  );
};

export default SidebarDropdown;
