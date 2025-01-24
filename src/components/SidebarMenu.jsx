import React from "react";
import Link from "next/link";

const SidebarMenu = () => {
  return (
    <div className="w-64 h-screen bg-base-200 shadow-md">
      <ul className="menu p-4 space-y-4 text-lg">
        {/* Home */}
        <li>
          <Link href="/dashboard" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>
        </li>

        {/* Firmen */}
        <li>
          <Link href="/firmen" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m6 4H3m3-8h12m-4-4a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Firmen</span>
          </Link>
        </li>

        {/* Demo Calls */}
        <li>
          <Link href="/demo-calls" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M4 6h16M4 8h16M4 12h16M4 16h16"
              />
            </svg>
            <span>Demo Calls</span>
          </Link>
        </li>

        {/* Aufgaben */}
        <li>
          <Link href="/aufgaben" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
            <span>Aufgaben</span>
          </Link>
        </li>

        {/* Support */}
        <li>
          <Link href="/support" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 13a9 9 0 11-12 0m12 0a4.5 4.5 0 01-9 0m9 0a4.5 4.5 0 10-9 0M12 12V9m0 3v2"
              />
            </svg>
            <span>Support</span>
          </Link>
        </li>

        {/* Profil */}
        <li>
          <Link href="/profil" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A9 9 0 1018.88 6.197m-1.415 5.655a2.5 2.5 0 11-3.536 3.536"
              />
            </svg>
            <span>Profil</span>
          </Link>
        </li>

        {/* Logout */}
        <li>
          <Link href="/logout" className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405M15 17v5m0-5L9 7m0 5H4"
              />
            </svg>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
