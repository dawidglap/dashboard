"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MemberCompanies = ({ companies, userId }) => {
  const [assignedBotschafters, setAssignedBotschafters] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndBotschafters = async () => {
      try {
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();
        const role = userData?.user?.role;
        setUserRole(role);

        if (role === "manager") {
          const botschafterRes = await fetch(`/api/users/${userId}/markenbotschafter`);
          const botschafterData = await botschafterRes.json();
          setAssignedBotschafters(botschafterData.users || []);
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der Daten:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBotschafters();
  }, [userId]);

  // 🔐 Funzione per obfuscazione email
  // 🔐 Offusca sia il nome che il dominio
  const obfuscateEmail = (email) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;

    // Mask name: mostra prima e ultima lettera
    const visibleName = name.length > 2
      ? name[0] + "*".repeat(name.length - 2) + name[name.length - 1]
      : name[0] + "*";

    // Mask domain: mostra prima e ultima lettera prima del punto (es. gmail), lascia il TLD visibile
    const [domainName, tld] = domain.split(".");
    const visibleDomain = domainName.length > 2
      ? domainName[0] + "*".repeat(domainName.length - 2) + domainName[domainName.length - 1]
      : domainName[0] + "*";

    return `${visibleName}@${visibleDomain}.${tld}`;
  };



  if (loading) {
    return (
      <div className="text-center text-sm py-4 text-gray-500">
        Lade Daten...
      </div>
    );
  }

  // 🧠 Wenn Manager, zeige Markenbotschafter
  if (userRole === "manager") {
    return (
      <div className="overflow-x-auto">
        <table className="table w-full table-xs rounded-lg">
          <thead>
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
              <th className="py-3 px-4 text-left">Markenbotschafter ({assignedBotschafters.length})</th>
              <th className="py-3 px-4 text-left">E-Mail</th>

              <th className="py-3 px-4 text-left">Affiliate Link</th>
              <th className="py-3 px-4 text-left">Erstellt am</th>
            </tr>
          </thead>

          <tbody>
            {assignedBotschafters.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-3 text-gray-500">
                  Keine Markenbotschafter zugewiesen.
                </td>
              </tr>
            ) : (
              assignedBotschafters.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
                >
                  {/* Name */}
                  <td className="py-4 px-4 font-medium">
                    {user.name} {user.surname}
                  </td>

                  {/* E-Mail */}
                  {/* E-Mail */}
                  <td className="py-4 px-4 text-sm">
                    {user.email ? (
                      <span className="text-gray-600">
                        {obfuscateEmail(user.email)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>





                  {/* Affiliate Link (troncato, non cliccabile) */}
                  <td className="py-4 px-4 text-xs text-gray-500">
                    <div
                      className="tooltip"
                      data-tip={`https://business.webomo.ch/ref=${user._id}`.slice(0, 40) + "..."}
                    >
                      <p className="truncate max-w-[180px] cursor-default">
                        {`https://business.webomo.ch/ref=${user._id}`.slice(0, 25)}...
                      </p>
                    </div>
                  </td>

                  {/* Erstellungsdatum */}
                  <td className="py-4 px-4 text-sm">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("de-DE")
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    );
  }

  // 👤 Für alle anderen Rollen: keine Anzeige
  return (
    <div className="text-center py-6 text-gray-500 italic">
      Keine Daten anzuzeigen für diese Rolle.
    </div>
  );

};

export default MemberCompanies;
