import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import PaidStatusIcon from "./PaidStatusIcon";
import PaidCommissionModal from "./PaidCommissionModal";
import { Check, X } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { FiRefreshCw } from "react-icons/fi";



const ProvisionenBreakdown = ({ commissions = [] }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isManager = session?.user?.role === "manager";
  const managerName = `${session?.user?.name || "Manager"}`;
  const [filter, setFilter] = useState("");
  const [displayedCommissions, setDisplayedCommissions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 1020;
  const tableContainerRef = useRef(null);

  const groupedCommissions = [];

  const seen = new Set();

  for (const commission of commissions) {
    const {
      companyName,
      userName,
      amount,
      role,
      startDatum,
      userRole,
    } = commission;

    if (!seen.has(companyName)) {
      // Finde beide Commissionen für dieselbe Firma
      const managerCommission = commissions.find(
        (c) => c.companyName === companyName && c.role === "manager"
      );
      const mbCommission = commissions.find(
        (c) => c.companyName === companyName && c.role === "markenbotschafter"
      );

      // Fallbacks (Admin = 0 CHF)
      const managerAmount =
        managerCommission?.userRole === "admin" ? 0 : managerCommission?.amount || 0;
      const managerName = managerCommission?.userName || "Nicht zugewiesen";

      const mbAmount =
        mbCommission?.userRole === "admin" ? 0 : mbCommission?.amount || 0;
      const mbName = mbCommission?.userName || "Nicht zugewiesen";

      const start = managerCommission?.startDatum || mbCommission?.startDatum;

      const status = managerCommission?.status_provisionen || mbCommission?.status_provisionen || false;


      groupedCommissions.push({
        companyName,
        managerName,
        managerAmount,
        mbName,
        mbAmount,
        startDatum: start,
        statusProvisionen: status,
      });





      seen.add(companyName);
    }
  }
  const handleConfirmPaid = async () => {
    if (!selectedCompany?.companyName) return;

    try {
      const res = await fetch("/api/commissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: selectedCompany.companyName,
          status_provisionen: !selectedCompany.statusProvisionen, // toggle dinamico
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = displayedCommissions.map((item) =>
        item.companyName === selectedCompany.companyName
          ? { ...item, statusProvisionen: !item.statusProvisionen }
          : item
      );

      setDisplayedCommissions(updated);
      console.log("✅ Commissione aggiornata!");
    } catch (err) {
      console.error("❌ Errore:", err);
    } finally {
      setShowModal(false);
      setSelectedCompany(null);
    }
  };









  if (!commissions.length) {
    // ✅ Step 1: Gruppiere Provisionen pro Firma


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
      ? groupedCommissions.filter((c) => c.companyName.includes(filter))
      : groupedCommissions;

    setDisplayedCommissions(filtered.slice(0, perPage));
    setHasMore(filtered.length > perPage);
    setPage(1);
  }, [filter, commissions]);


  // ✅ Calculate total commissions based on current filter (but from all commissions)
  const totalCommissionsFiltered = commissions.reduce((sum, c) => sum + c.amount, 0);


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
        <div className="flex items-center space-x-2">
          <select
            className="w-52 p-2 px-4 rounded-full text-gray-700 text-sm border bg-indigo-50 focus:ring focus:ring-indigo-300"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="">Alle Firmen</option>
            {[...new Set(groupedCommissions.map((c) => c.companyName))].map((company, i) => (
              <option key={i} value={company}>
                {company}
              </option>
            ))}
          </select>

          {filter && (
            <button
              onClick={() => setFilter("")}
              className="px-4 h-10 w-16 border rounded-full btn-outline  transition"
              title="Filter zurücksetzen"
            >
              <FiRefreshCw className="mx-auto w-4 h-4 " />
            </button>
          )}
        </div>




        {/* 🔹 Total Commissions Amount (Static & Dynamic) */}
        {/* 👇 Breakdown der Provisionen */}
        {isManager && (
          <p className="text-right  p-2 px-4 text-sm rounded-full text-gray-700 border bg-indigo-50 focus:ring focus:ring-indigo-300">
            {managerName}:{" "}
            <span className="font-semibold text-green-600">
              {commissions
                .filter((c) => c.role === "manager")
                .reduce((sum, c) => sum + c.amount, 0)
                .toLocaleString("de-DE")}{" "}
              CHF
            </span>{" "}
            | Markenbotschafter:{" "}
            <span className="font-semibold text-green-600">
              {commissions
                .filter((c) => c.role === "markenbotschafter")
                .reduce((sum, c) => sum + c.amount, 0)
                .toLocaleString("de-DE")}{" "}
              CHF
            </span>
          </p>
        )}


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
              <th className="w-2/12 py-3 px-4 text-left text-xs">Kunden</th>
              <th className="w-2/12 py-3 px-4 text-left text-xs">Business Partner</th>
              <th className="w-2/12 py-3 px-4 text-left text-xs">Markenbotschafter</th>
              <th className="w-2/12 py-3 px-4 text-center text-xs">Provision</th>
              <th className="w-1/12 py-3 px-4 text-left text-xs">Startdatum</th>
              <th className="w-1/12 py-3 px-4  text-left text-xs">Zahlungsdatum</th>
              <th className="w-1/12 py-3 px-4 text-center text-xs">Bezahlt</th> {/* ✅ nuova colonna */}
            </tr>
          </thead>


          <tbody>
            {displayedCommissions.map((item, index) => {
              const createdAt = new Date(item.startDatum);
              const payDate = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 25);

              return (
                <tr
                  key={index}
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-4 px-4 font-medium">{item.companyName}</td>
                  <td className="py-4 px-4">{item.managerName}</td>
                  <td className="py-4 px-4">{item.mbName}</td>

                  <td className="py-6 px-4 text-green-500 font-semibold flex justify-center ">
                    <div className="min-w-20 ">{item.managerAmount.toLocaleString("de-DE")} CHF</div>
                    <div className="min-w-2 text-black">|</div>
                    <div className="min-w-20 ps-4">{item.mbAmount.toLocaleString("de-DE")} CHF</div>
                  </td>

                  <td className="py-4 px-4">{createdAt.toLocaleDateString("de-DE")}</td>
                  <td className="py-4 px-4">{payDate.toLocaleDateString("de-DE")}</td>

                  {/* ✅ Nuova colonna "Bezahlt" */}
                  <td className="py-4 px-4">
                    {isAdmin ? (
                      <PaidStatusIcon
                        status={item.statusProvisionen === true}
                        onClick={() => {
                          setSelectedCompany(item);
                          setShowModal(true);
                        }}
                      />
                    ) : (
                      <motion.div
                        className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${item.statusProvisionen ? "border-green-500" : "border-gray-400"
                          }`}
                        aria-label="Bezahlt Status (readonly)"
                      >
                        <motion.div
                          variants={{
                            unchecked: { rotate: 0, scale: 1 },
                            checked: { rotate: 360, scale: 1.2 },
                          }}
                          animate={item.statusProvisionen ? "checked" : "unchecked"}
                          transition={{ duration: 0.4 }}
                          className={`text-sm ${item.statusProvisionen ? "text-green-500" : "text-gray-500"}`}
                        >
                          {item.statusProvisionen ? <Check size={18} /> : <X size={18} />}
                        </motion.div>
                      </motion.div>
                    )}

                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
        {showModal && selectedCompany && (
          <PaidCommissionModal
            company={selectedCompany}
            onConfirm={handleConfirmPaid}
            onCancel={() => {
              setShowModal(false);
              setSelectedCompany(null);
            }}
          />
        )}

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
