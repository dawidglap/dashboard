import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

// ✅ Esterno: Genera label statiche per timeframe
const generateTimeLabels = (timeframe) => {
  const labels = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (timeframe === "yearly") {
    for (let y = year - 2; y <= year; y++) {
      labels.push(y.toString());
    }
  } else if (timeframe === "monthly") {
    for (let m = 0; m < 12; m++) {
      const d = new Date(year, m);
      labels.push(d.toLocaleString("de-DE", { month: "short" }));
    }
  } else if (timeframe === "weekly") {
    for (let w = 1; w <= 52; w++) {
      labels.push(`${year}-W${w}`);
    }
  } else if (timeframe === "daily") {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      labels.push(date.toISOString().split("T")[0]);
    }
  }

  return labels;
};

// ✅ Esterno: Aggrega earnings per timeframe
const aggregateByTimeframe = (dailyData, timeframe) => {
  const result = {};

  for (const dateStr in dailyData) {
    const date = new Date(dateStr);
    if (isNaN(date)) continue;

    let key;
    if (timeframe === "daily") {
      key = dateStr;
    } else if (timeframe === "weekly") {
      const week = Math.ceil(date.getDate() / 7);
      key = `${date.getFullYear()}-W${week}`;
    } else if (timeframe === "monthly") {
      key = date.toLocaleString("de-DE", { month: "short" });
    } else {
      key = date.getFullYear().toString();
    }

    result[key] = (result[key] || 0) + dailyData[dateStr];
  }

  return result;
};

const useFetchEarnings = (timeframe = "monthly") => {
  const [chartData, setChartData] = useState([]);
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [lastMonthUmsatz, setLastMonthUmsatz] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarningsData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (!session || !session.user)
          throw new Error("User session not found.");

        const { role, email } = session.user;

        const response = await fetch(
          `/api/companies/all?role=${role}&email=${email}`
        );
        if (!response.ok) throw new Error("Error fetching companies data.");
        const data = await response.json();
        const companies = data?.data || [];

        let total = 0;
        let dailyEarnings = {};

        companies.forEach((company) => {
          if (!company.created_at) return;
          const date = new Date(company.created_at);
          if (isNaN(date)) return;

          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081
              : company.plan === "PRO"
              ? 899 * 12 * 1.081
              : company.plan === "BUSINESS" && company.plan_price
              ? parseFloat(company.plan_price)
              : 0;

          total += earnings;

          const dateStr = date.toISOString().split("T")[0];
          dailyEarnings[dateStr] = (dailyEarnings[dateStr] || 0) + earnings;
        });

        const aggregated = aggregateByTimeframe(dailyEarnings, timeframe);
        const labels = generateTimeLabels(timeframe);

        const filledData = labels.map((label) => ({
          period: label,
          earnings: aggregated[label] || 0,
        }));

        // Calcolo del mese precedente (solo per confronto)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthKey = lastMonth.toLocaleString("de-DE", {
          month: "short",
        });
        const lastMonthValue = aggregated[lastMonthKey] || 0;

        setChartData(filledData);
        setBruttoUmsatz(total);
        setLastMonthUmsatz(lastMonthValue);
      } catch (err) {
        console.error("❌ Error in useFetchEarnings:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [timeframe]);

  return { chartData, bruttoUmsatz, lastMonthUmsatz, loading, error };
};

export default useFetchEarnings;
