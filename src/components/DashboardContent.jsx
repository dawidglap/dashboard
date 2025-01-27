"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBuilding,
  FaDollarSign,
  FaPhone,
  FaTasks,
  FaUser,
  FaLifeRing,
} from "react-icons/fa";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

const DashboardContent = ({ user }) => {
  const [time, setTime] = useState(new Date());
  const [demoCallsCount, setDemoCallsCount] = useState(null);
  const [companyCount, setCompanyCount] = useState(null);
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [nettoUmsatz, setNettoUmsatz] = useState(0);
  const [topPlan, setTopPlan] = useState(null);
  const [newCompaniesCount, setNewCompaniesCount] = useState(0);
  const [comparisonToLastMonth, setComparisonToLastMonth] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch the number of demo calls
  useEffect(() => {
    const fetchDemoCalls = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        const demoCalls = data?.data?.bookings || [];
        setDemoCallsCount(demoCalls.length);
      } catch (error) {
        console.error("Error fetching demo calls:", error);
        setDemoCallsCount(0);
      }
    };

    fetchDemoCalls();
  }, []);

  // Fetch the number of companies and Umsatz
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();

        const companies = data?.data || [];
        setCompanyCount(companies.length);

        let totalEarnings = 0;
        let totalNetEarnings = 0;
        let planCounts = { BASIC: 0, PRO: 0, BUSINESS: 0 };

        const tempChartData = companies.map((company) => {
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
              ? 700
              : company.plan === "PRO"
              ? 800
              : company.plan === "BUSINESS"
              ? 1000
              : 0;

          totalEarnings += earnings;
          totalNetEarnings += earnings - commission;

          if (company.plan) planCounts[company.plan]++;

          return {
            month: new Date(company.created_at).toLocaleString("de-DE", {
              month: "short",
            }),
            earnings,
          };
        });

        // Determine the most popular plan
        const mostSoldPlan = Object.entries(planCounts).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["None", 0]
        )[0];
        setTopPlan(mostSoldPlan);

        // Calculate new companies this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newCompaniesThisMonth = companies.filter((company) => {
          const companyDate = new Date(company.created_at);
          return (
            companyDate.getMonth() === currentMonth &&
            companyDate.getFullYear() === currentYear
          );
        }).length;
        setNewCompaniesCount(newCompaniesThisMonth);

        // Calculate comparison to last month
        const lastMonth = new Date(currentYear, currentMonth - 1);
        const earningsLastMonth = tempChartData
          .filter(
            (item) =>
              new Date(item.month).getMonth() === lastMonth.getMonth() &&
              new Date(item.month).getFullYear() === lastMonth.getFullYear()
          )
          .reduce((sum, item) => sum + item.earnings, 0);

        const comparison =
          earningsLastMonth > 0
            ? ((totalEarnings - earningsLastMonth) / earningsLastMonth) * 100
            : 0; // Avoid division by 0
        setComparisonToLastMonth(comparison.toFixed(2));

        setBruttoUmsatz(totalEarnings);
        setNettoUmsatz(totalNetEarnings);
        setChartData(tempChartData);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanyCount(0);
      }
    };

    fetchCompanies();
  }, []);

  const gridData = [
    {
      title: "Firmen",
      count:
        companyCount !== null ? (
          companyCount
        ) : (
          <div className="skeleton h-6 w-10 bg-gray-300"></div>
        ),
      description: `Neue Firmen: ${newCompaniesCount}`,
      additionalInfo: `Beliebtester Plan: ${topPlan}`,
      link: "/dashboard/firmen",
      icon: <FaBuilding className="text-blue-500 text-4xl" />,
      color: "bg-gradient-to-r from-blue-50 to-blue-100",
      width: "col-span-4 row-span-2", // Make Firmen larger
    },
    {
      title: "Umsatz",
      count: `CHF ${Math.round(bruttoUmsatz).toLocaleString("de-DE")}`,
      description: `Netto Umsatz: CHF ${Math.round(nettoUmsatz).toLocaleString(
        "de-DE"
      )}`,
      additionalInfo: `Vergleich: ${
        comparisonToLastMonth > 0
          ? `⬆ ${comparisonToLastMonth}%`
          : `⬇ ${Math.abs(comparisonToLastMonth)}%`
      }`,
      link: "/dashboard/earnings",
      chart: true, // Mark this as a chart item
      color: "bg-gradient-to-r from-green-50 to-green-100",
      width: "col-span-8 row-span-2", // Make Umsatz with chart larger
    },
    {
      title: "Demo Calls",
      count:
        demoCallsCount !== null ? (
          demoCallsCount
        ) : (
          <div className="skeleton h-6 w-10 bg-gray-300"></div>
        ),
      link: "/dashboard/demo-calls",
      icon: <FaPhone className="text-indigo-500 text-4xl" />,
      color: "bg-gradient-to-r from-indigo-50 to-indigo-100",
      width: "col-span-4", // Regular size
    },
    {
      title: "Team",
      count: <div className="skeleton h-6 w-10 bg-gray-300"></div>,
      link: "/dashboard/team",
      icon: <FaUser className="text-purple-500 text-4xl" />,
      color: "bg-gradient-to-r from-purple-50 to-purple-100",
      width: "col-span-2", // Smaller card
    },
    {
      title: "Aufgaben",
      count: <div className="skeleton h-6 w-10 bg-gray-300"></div>,
      link: "/dashboard/aufgaben",
      icon: <FaTasks className="text-yellow-500 text-4xl" />,
      color: "bg-gradient-to-r from-yellow-50 to-yellow-100",
      width: "col-span-2", // Smaller card
    },
    {
      title: "Support",
      count: <div className="skeleton h-6 w-10 bg-gray-300"></div>,
      link: "/dashboard/support",
      icon: <FaLifeRing className="text-gray-500 text-4xl" />,
      color: "bg-gradient-to-r from-gray-50 to-gray-100",
      width: "col-span-2", // Smaller card
    },
    {
      title: "Profile",
      count: <div className="skeleton h-6 w-10 bg-gray-300"></div>,
      link: "/dashboard/profile",
      icon: <FaUser className="text-pink-500 text-4xl" />,
      color: "bg-gradient-to-r from-pink-50 to-pink-100",
      width: "col-span-2", // Smaller card
    },
  ];

  return (
    <div className="p-6 flex-1">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-600">
            {time.toLocaleTimeString("de-DE")}
          </p>
          <p className="text-sm text-gray-500">
            {time.toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {gridData.map((item, index) => (
          <div
            key={index}
            className={`card p-4 rounded-lg shadow-lg ${
              item.color
            } hover:shadow-2xl transition duration-300 ${item.width || ""}`}
          >
            <Link href={item.link} className="flex items-top w-full space-x-4">
              {item.chart ? (
                <>
                  {/* Left: Title and Count */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-2xl font-extrabold">{item.count}</p>
                    <p className="text-sm text-gray-600 pt-6">
                      {item.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.additionalInfo}
                    </p>
                  </div>

                  {/* Right: Chart */}
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={150}>
                      <AreaChart data={chartData}>
                        <Area
                          type="monotone"
                          dataKey="earnings"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fill="url(#colorEarnings)"
                        />
                        <defs>
                          <linearGradient
                            id="colorEarnings"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <>
                  {item.icon}
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h2>
                    <p className="text-2xl font-extrabold">{item.count}</p>
                    {item.description && (
                      <p className="text-sm text-gray-600 pt-6">
                        {item.description}
                      </p>
                    )}
                    {item.additionalInfo && (
                      <p className="text-sm text-gray-600">
                        {item.additionalInfo}
                      </p>
                    )}
                  </div>
                </>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
