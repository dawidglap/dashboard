"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa";

const FirmenWidget = () => {
  const [companyCount, setCompanyCount] = useState(null);
  const [newCompaniesCount, setNewCompaniesCount] = useState(0);
  const [topPlan, setTopPlan] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();
        const companies = data?.data || [];
        setCompanyCount(companies.length);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const newCompaniesThisMonth = companies.filter((company) => {
          const companyDate = new Date(company.created_at);
          return (
            companyDate.getMonth() === currentMonth &&
            companyDate.getFullYear() === currentYear
          );
        }).length;

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

        setNewCompaniesCount(newCompaniesThisMonth);
        setTopPlan(mostSoldPlan);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 col-span-4 row-span-2">
      <Link href="/dashboard/firmen" className="flex items-start space-x-4">
        <FaBuilding className="text-blue-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Firmen</h2>
          <p className="text-2xl font-extrabold">
            {companyCount !== null ? (
              companyCount
            ) : (
              <span className="skeleton h-8 w-24 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>
          <p className="text-sm text-gray-600 pt-6">
            {newCompaniesCount !== null ? (
              `Neue Firmen: ${newCompaniesCount}`
            ) : (
              <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            {topPlan ? (
              `Beliebtester Plan: ${topPlan}`
            ) : (
              <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default FirmenWidget;
