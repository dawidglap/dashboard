"use client";

const UserCardSkeleton = () => {
    return (
        <div className="space-y-4 xl:hidden">
            {/* 🔹 Titolo come in TeamHeader */}
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-center lg:text-left font-extrabold text-base-content dark:text-white">
                Teamübersicht
            </h1>

            {/* 🔹 Card scheletro 1 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-48" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-40" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24" />
                </div>
            </div>

            {/* 🔹 Card scheletro 2 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 space-y-3 animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-48" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-40" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24" />
                </div>
            </div>
        </div>
    );
};

export default UserCardSkeleton;
