import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import PaidStatusIcon from "./PaidStatusIcon";
import PaidCommissionModal from "./PaidCommissionModal";
import { Check, X } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { FiRefreshCw } from "react-icons/fi";
import ProvisionenCard from "./ProvisionenCard";



const ProvisionenBreakdown = ({ commissions = [], selectedMB, setSelectedMB, onResetToCompanies }) => {

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isManager = session?.user?.role === "manager";
  const isMarkenbotschafter = session?.user?.role === "markenbotschafter";

  const managerName = `${session?.user?.name || "Deine Provisionen"}`;
  const [filter, setFilter] = useState("");
  const [displayedCommissions, setDisplayedCommissions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 1020;
  const tableContainerRef = useRef(null);

  // const [selectedMB, setSelectedMB] = useState("");
  const [markenbotschafterList, setMarkenbotschafterList] = useState([]);


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
        <h2 className="text-xl  font-bold mb-4 border-b-2 border-indigo-300 pb-2">
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

  useEffect(() => {
    const fetchMBList = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (data.success && Array.isArray(data.users)) {
          const allMBs = data.users.filter((u) => u.role === "markenbotschafter");

          const filteredMBs = isAdmin
            ? allMBs
            : isManager
              ? allMBs.filter((mb) => mb.manager_id === session?.user?._id)
              : [];

          setMarkenbotschafterList(filteredMBs);
        }
      } catch (error) {
        console.error("❌ Fehler beim Laden der Markenbotschafter:", error);
      }
    };

    fetchMBList();
  }, [session?.user?._id, isAdmin, isManager]);

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
  const kundenCount = displayedCommissions.length;


  return (
    <div className="bg-base-100 rounded-2xl w-full">
      {/* ✅ Header with filter & dynamic total commissions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
        {/* ✅ Select + Reset Button */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 items-center sm:items-center">
          <select
            className="w-full sm:w-52 px-4 select select-sm select-bordered rounded-full bg-indigo-100 text-sm text-center sm:text-left mx-auto sm:mx-0"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="">Kunden</option>
            {[...new Set(groupedCommissions.map((c) => c.companyName))].map((company, i) => (
              <option key={i} value={company}>
                {company}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilter("")}
            className="w-full sm:w-16 h-8 border rounded-full btn-outline transition text-sm flex justify-center items-center mx-auto sm:mx-0"
            title="Alle Filter zurücksetzen"
          >
            <span className="hidden sm:flex">
              <FiRefreshCw className="w-4 h-4" />
            </span>
            <span className="sm:hidden">Filter zurücksetzen</span>
          </button>
        </div>

        {/* ✅ Deine Provisionen */}
        <div className="p-2 px-4 text-sm rounded-full text-gray-700 border bg-indigo-50 focus:ring focus:ring-indigo-300 w-full sm:w-1/2 lg:w-auto text-center sm:text-left mx-auto sm:mx-0">
          {isMarkenbotschafter ? (
            <div>
              Deine Provisionen:{" "}
              <span className="font-semibold text-green-600">
                {commissions
                  .filter((c) => c.role === "markenbotschafter")
                  .reduce((sum, c) => sum + c.amount, 0)
                  .toLocaleString("de-DE")}{" "}
                CHF
              </span>
            </div>
          ) : isManager ? (
            <div>
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
            </div>
          ) : (
            <div>
              Gesamtprovisionen:{" "}
              <span className="text-green-600 font-bold">
                {totalCommissionsFiltered.toLocaleString("de-DE")} CHF
              </span>
            </div>
          )}
        </div>
      </div>




      {/* ✅ Scrollable Table with Sticky Header */}
      <div
        ref={tableContainerRef}
        className="hidden lg:block overflow-x-auto max-h-[80vh] overflow-auto rounded-lg "
      >
        <table className="table table-xs w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50 shadow-sm">
            <tr className="text-sm text-base-content border-b border-indigo-300">
              <th className="w-2/12 py-3 px-4 text-left text-xs">
                Kunden <span className="text-gray-400">({kundenCount})</span>
              </th>

              <th className="w-2/12 py-3 px-4 text-left text-xs">Business Partner</th>
              <th className="w-2/12 py-3 px-4 text-left text-xs">Markenbotschafter</th>
              <th className="w-2/12 py-3 px-4 text-center text-xs">Provision</th>
              <th className="w-1/12 py-3 px-4 text-left text-xs">Beginn</th>
              <th className="w-1/12 py-3 px-4  text-left text-xs">Zahl.-Dat.</th>
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

                  <td className="py-6 px-4 text-green-500 font-semibold flex justify-center">
                    {isMarkenbotschafter ? (
                      <div className="min-w-16">{item.mbAmount.toLocaleString("de-DE")} CHF</div>
                    ) : (
                      <>
                        <div className="min-w-20">{item.managerAmount.toLocaleString("de-DE")} CHF</div>
                        <div className="min-w-2 text-black">|</div>
                        <div className="min-w-20 ps-4">{item.mbAmount.toLocaleString("de-DE")} CHF</div>
                      </>
                    )}
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
      <div className="lg:hidden space-y-4">
        {displayedCommissions.map((item, index) => (
          <ProvisionenCard key={index} provision={item} />
        ))}
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
