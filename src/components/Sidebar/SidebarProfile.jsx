import Link from "next/link";

const SidebarProfile = ({ user, loading }) => {
  const ROLE_COLORS = {
    admin: "bg-red-500",
    manager: "bg-blue-500",
    markenbotschafter: "bg-green-500",
  };

  return (
    <div className="mt-auto flex flex-col items-center">
      <Link
        href="/dashboard/profil"
        className="flex flex-col items-center group mb-4"
      >
        {loading ? (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
            <p className="mt-2 w-20 h-4 bg-gray-300 animate-pulse"></p>
            <span className="w-16 h-3 bg-gray-300 animate-pulse mt-1"></span>
          </>
        ) : (
          <>
            <div
              className={`w-12 h-12 flex items-center justify-center text-white text-lg font-bold rounded-full ${
                ROLE_COLORS[user?.role] || "bg-gray-500"
              }`}
            >
              {user?.name?.charAt(0) || "?"}
              {user?.surname?.charAt(0) || "?"}
            </div>
            <p className="mt-2 font-semibold text-base-content group-hover:underline">
              {user?.name || "Unbekannt"} {user?.surname || ""}
            </p>
            <span className="text-gray-600 text-sm dark:text-gray-400">
              {user?.role || "Unbekannt"}
            </span>
          </>
        )}
      </Link>
    </div>
  );
};

export default SidebarProfile;
