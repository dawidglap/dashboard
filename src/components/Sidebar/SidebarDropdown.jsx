import { useState } from "react";
import Link from "next/link";
import { FaMoneyBillWave } from "react-icons/fa";

const SidebarDropdown = () => {
  const [open, setOpen] = useState(false);

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
          <li>
            <Link
              href="/dashboard/provisionen"
              className="block px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
            >
              Übersicht
            </Link>
          </li>
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
