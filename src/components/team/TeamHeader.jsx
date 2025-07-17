"use client";

import { FaPlus } from "react-icons/fa";

const TeamHeader = ({ onAdd, userRole }) => {
    return (
        <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4 mt-8 mb-6">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-center lg:text-left font-extrabold text-base-content dark:text-white">
                Teamübersicht
            </h1>

            {userRole === "admin" && (
                <button
                    onClick={onAdd}
                    className="btn btn-neutral px-4 hover:text-white btn-sm dark:text-white dark:hover:bg-slate-900 flex rounded-full items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaPlus />
                    <span>Neuer Benutzer</span>
                </button>
            )}
        </div>
    );
};

export default TeamHeader;
