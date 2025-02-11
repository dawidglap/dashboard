import { useState } from "react";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

const SidebarLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
    window.location.href = "/login"; // Ensures full reload after logout
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className="flex items-center w-full px-4 py-2 mt-4 rounded-full text-error hover:bg-error/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaSignOutAlt className="text-md" />
      <span className="ml-4 text-sm">
        {loggingOut ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
};

export default SidebarLogout;
