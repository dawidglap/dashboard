import Link from "next/link";

const SidebarItem = ({ title, href, icon, disabled, onClick }) => {
  return (
    <li>
      {disabled ? (
        <div className="tooltip tooltip-top" data-tip="Nur Admin">
          <button className="flex items-center px-4 py-2 w-full rounded-full transition-all text-sm text-gray-400 cursor-not-allowed">
            <span className="text-lg">{icon}</span>
            <span className="ml-4">{title}</span>
          </button>
        </div>
      ) : (
        <Link
          href={href}
          onClick={onClick}
          className="flex items-center px-4 py-2 rounded-full transition-all text-sm hover:bg-indigo-50 dark:hover:bg-gray-800"
        >
          <span className="text-lg">{icon}</span>
          <span className="ml-4">{title}</span>
        </Link>
      )}
    </li>
  );
};

export default SidebarItem;
