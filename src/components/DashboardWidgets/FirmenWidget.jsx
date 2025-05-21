"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FirmenWidget = () => {
  const [companyCount, setCompanyCount] = useState(null);
  const [newCompaniesCount, setNewCompaniesCount] = useState(null);
  const [topPlan, setTopPlan] = useState(null);
  const [bruttoUmsatz, setBruttoUmsatz] = useState(null);
  const [nettoUmsatz, setNettoUmsatz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies/all"); // ✅ Fetch all companies
        const data = await response.json();
        const companies = data?.data || [];

        setCompanyCount(companies.length);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // ✅ Count new companies this month
        const newCompaniesThisMonth = companies.filter((company) => {
          const companyDate = new Date(company.created_at);
          return (
            companyDate.getMonth() === currentMonth &&
            companyDate.getFullYear() === currentYear
          );
        }).length;

        // ✅ Find the most popular plan
        const planCounts = companies.reduce(
          (acc, company) => {
            acc[company.plan] = (acc[company.plan] || 0) + 1;
            return acc;
          },
          { BASIC: 0, PRO: 0, BUSINESS: 0 }
        );

        const mostSoldPlan = Object.entries(planCounts).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["None", 0]
        )[0];

        // ✅ Calculate Brutto & Netto Umsatz
        let totalEarnings = 0;
        let totalNetEarnings = 0;

        companies.forEach((company) => {
          const earnings =
            company.plan === "BASIC"
              ? 299 * 12 * 1.081
              : company.plan === "PRO"
                ? 399 * 12 * 1.081
                : company.plan === "BUSINESS" && company.plan_price
                  ? parseFloat(company.plan_price)
                  : 0;

          const commission =
            company.plan === "BASIC"
              ? 1000
              : company.plan === "PRO"
                ? 1000
                : company.plan === "BUSINESS"
                  ? 1000
                  : 0;

          totalEarnings += earnings;
          totalNetEarnings += earnings - commission;
        });

        setNewCompaniesCount(newCompaniesThisMonth);
        setTopPlan(mostSoldPlan !== "None" ? mostSoldPlan : "Keiner");
        setBruttoUmsatz(totalEarnings);
        setNettoUmsatz(totalNetEarnings);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="relative bg-gradient-to-r border-white border-2 from-indigo-600 to-purple-500 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold">Kunden</h2>
        <p className="text-4xl font-extrabold mt-1">
          {loading ? (
            <span className="skeleton h-8 w-24 bg-gray-300 rounded"></span>
          ) : (
            companyCount
          )}
        </p>
      </div>

      {/* ✅ Updated Revenue Calculation */}
      <div className="mt-4 space-y-2 text-sm opacity-90">
        <p>
          {loading ? (
            <span className="skeleton h-6 w-32 bg-gray-300 rounded"></span>
          ) : (
            `Neue Kunden: ${newCompaniesCount}`
          )}
        </p>
        <p>
          {loading ? (
            <span className="skeleton h-6 w-32 bg-gray-300 rounded"></span>
          ) : (
            `Beliebtester Paket: ${topPlan}`
          )}
        </p>
        <p>
          {loading ? (
            <span className="skeleton h-6 w-32 bg-gray-300 rounded"></span>
          ) : (
            `Gesamtumsatz: CHF ${Math.round(bruttoUmsatz).toLocaleString(
              "de-DE"
            )}`
          )}
        </p>
        <p>
          {loading ? (
            <span className="skeleton h-6 w-32 bg-gray-300 rounded"></span>
          ) : (
            `Netto Umsatz: CHF ${Math.round(nettoUmsatz).toLocaleString(
              "de-DE"
            )}`
          )}
        </p>
      </div>

      {/* ✅ CTA Button (Optional) */}
      <Link
        href="/dashboard/firmen"
        className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-full text-center font-semibold hover:bg-gray-200 transition"
      >
        Mehr Details →
      </Link>
    </div>
  );
};

export default FirmenWidget;
