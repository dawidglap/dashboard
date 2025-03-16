import { useState, useEffect, useRef } from "react";

const ProvisionenBreakdown = ({ commissions = [] }) => {
  const [filter, setFilter] = useState("");
  const [displayedCommissions, setDisplayedCommissions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const tableContainerRef = useRef(null);

  if (!commissions.length) {
    return (
      <div className="bg-base-100 p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-indigo-300 pb-2">
          Detaillierte Provisionsübersicht
        </h2>
        <p className="text-gray-500">Noch keine Provisionen verfügbar.</p>
      </div>
    );
  }

  // ✅ Calculate total commissions once from the FULL dataset
  const totalCommissionsAll = commissions.reduce((sum, c) => sum + c.amount, 0);

  // ✅ Apply user filter at the start
  useEffect(() => {
    const filtered = filter
      ? commissions.filter((c) => c.userName.includes(filter))
      : commissions;

    setDisplayedCommissions(filtered.slice(0, perPage));
    setHasMore(filtered.length > perPage);
    setPage(1);
  }, [filter, commissions]);

  // ✅ Calculate total commissions based on current filter (but from all commissions)
  const totalCommissionsFiltered = commissions
    .filter((c) => (filter ? c.userName.includes(filter) : true))
    .reduce((sum, c) => sum + c.amount, 0);

  // ✅ Load more commissions on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!tableContainerRef.current || loading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setLoading(true);
        setTimeout(() => {
          setDisplayedCommissions((prev) => [
            ...prev,
            ...commissions.slice(page * perPage, (page + 1) * perPage),
          ]);
          setHasMore(commissions.length > (page + 1) * perPage);
          setPage((prev) => prev + 1);
          setLoading(false);
        }, 500);
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, page, commissions]);

  return (
    <div className="bg-base-100 rounded-2xl w-full">
      {/* ✅ Header with filter & dynamic total commissions */}
      <div className="flex justify-between items-center mb-4">
        {/* 🔹 User Filter Dropdown */}
        <select
          className="p-2 px-4 rounded-full text-gray-700 text-sm border bg-indigo-50 focus:ring focus:ring-indigo-300"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Alle Benutzer</option>
          {[...new Set(commissions.map((c) => c.userName))].map((user, i) => (
            <option key={i} value={user}>
              {user}
            </option>
          ))}
        </select>

        {/* 🔹 Total Commissions Amount (Static & Dynamic) */}
        <p className="p-2 px-4 text-sm rounded-full text-gray-700 border bg-indigo-50 focus:ring focus:ring-indigo-300">
          Gesamtprovisionen:{" "}
          <span className="text-green-600 font-bold">
            {totalCommissionsFiltered.toLocaleString("de-DE")} CHF
          </span>
        </p>
      </div>

      {/* ✅ Scrollable Table with Sticky Header */}
      <div
        ref={tableContainerRef}
        className="overflow-x-auto max-h-[80vh] overflow-auto rounded-lg "
      >
        <table className="table table-xs w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50 shadow-sm">
            <tr className="text-sm text-base-content border-b border-indigo-300">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Rolle</th>
              <th className="py-3 px-4 text-left">Kunden</th>
              <th className="py-3 px-4 text-left">Provision</th>
              <th className="py-3 px-4 text-left">Startdatum</th>
              <th className="py-3 px-4 text-left">Zahlungsdatum</th>
            </tr>
          </thead>
          <tbody>
            {displayedCommissions.map((commission, index) => {
              const createdAt = new Date(commission.startDatum);
              const payDate = new Date(
                createdAt.getFullYear(),
                createdAt.getMonth() + 1, // ✅ Next month
                25
              );

              return (
                <tr
                  key={index}
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-4 px-4 font-medium">
                    {commission.userName}
                  </td>
                  <td className="py-4 px-4 capitalize">{commission.role}</td>
                  <td className="py-4 px-4">{commission.companyName}</td>
                  <td className="py-4 px-4 text-green-500 font-semibold">
                    CHF {commission.amount.toLocaleString("de-DE")}
                  </td>
                  <td className="py-4 px-4">
                    {createdAt.toLocaleDateString("de-DE")}
                  </td>
                  <td className="py-4 px-4">
                    {payDate.toLocaleDateString("de-DE")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ Show Loading Indicator when fetching more */}
      {loading && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default ProvisionenBreakdown;
