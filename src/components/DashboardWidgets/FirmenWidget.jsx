"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FirmenWidget = () => {
  const [companyCount, setCompanyCount] = useState(null);
  const [newCompaniesCount, setNewCompaniesCount] = useState(0);
  const [topPlan, setTopPlan] = useState(null);
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [nettoUmsatz, setNettoUmsatz] = useState(0);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies");
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

        // ✅ Calculate Brutto & Netto Umsatz (SAME AS UmsatzWidget)
        let totalEarnings = 0;
        let totalNetEarnings = 0;

        companies.forEach((company) => {
          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081
              : company.plan === "PRO"
              ? 899 * 12 * 1.081
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
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold">Firmen</h2>
        <p className="text-3xl font-bold">
          {companyCount !== null ? (
            companyCount
          ) : (
            <span className="skeleton h-8 w-24 bg-gray-200 rounded animate-pulse"></span>
          )}
        </p>
      </div>

      {/* ✅ Updated Revenue Calculation */}
      <div className="mt-4 space-y-2 text-sm opacity-90">
        <p>
          {newCompaniesCount !== null ? (
            `Neue Firmen: ${newCompaniesCount}`
          ) : (
            <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
          )}
        </p>
        <p>
          {topPlan ? (
            `Beliebtester Plan: ${topPlan}`
          ) : (
            <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
          )}
        </p>
        <p>
          {bruttoUmsatz > 0 ? (
            `Gesamtumsatz: CHF ${Math.round(bruttoUmsatz).toLocaleString(
              "de-DE"
            )}`
          ) : (
            <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
          )}
        </p>
        <p>
          {nettoUmsatz > 0 ? (
            `Netto Umsatz: CHF ${Math.round(nettoUmsatz).toLocaleString(
              "de-DE"
            )}`
          ) : (
            <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
          )}
        </p>
      </div>

      {/* ✅ CTA Button (Optional) */}
      <Link
        href="/dashboard/firmen"
        className="mt-4 inline-block bg-white text-blue-600 px-4 py-2 rounded-full text-center font-semibold hover:bg-gray-200 transition"
      >
        Mehr Details →
      </Link>
    </div>
  );
};

export default FirmenWidget;
