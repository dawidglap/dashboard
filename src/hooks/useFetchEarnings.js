import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

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

        if (!session || !session.user) {
          throw new Error("User session not found.");
        }

        const role = session.user.role;
        const email = session.user.email; // Using email instead of userId

        console.log("Session Retrieved -> Role:", role, "Email:", email); // Debugging

        const response = await fetch(
          `/api/companies/all?role=${role}&email=${email}`
        );
        if (!response.ok) throw new Error("Error fetching companies data.");
        const data = await response.json();

        console.log("Fetched Companies:", data); // Debugging

        let totalEarnings = 0;
        let lastMonthEarnings = 0;
        let earningsByDate = {};

        // Process and group data based on timeframe
        data.data.forEach((company) => {
          const date = new Date(company.created_at);
          const formattedDate =
            timeframe === "daily"
              ? date.toISOString().split("T")[0] // YYYY-MM-DD
              : timeframe === "weekly"
              ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}` // YYYY-WXX
              : timeframe === "monthly"
              ? `${date.toLocaleString("default", { month: "short" })} '${date
                  .getFullYear()
                  .toString()
                  .slice(-2)}`
              : date.getFullYear().toString(); // Yearly

          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081
              : company.plan === "PRO"
              ? 899 * 12 * 1.081
              : company.plan === "BUSINESS" && company.plan_price
              ? parseFloat(company.plan_price)
              : 0;

          totalEarnings += earnings;
          earningsByDate[formattedDate] =
            (earningsByDate[formattedDate] || 0) + earnings;
        });

        const formattedChartData = Object.keys(earningsByDate).map((key) => ({
          period: key,
          earnings: earningsByDate[key],
        }));

        // Calculate last month earnings for growth calculation
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthKey = `${lastMonth.toLocaleString("default", {
          month: "short",
        })} '${lastMonth.getFullYear().toString().slice(-2)}`;
        lastMonthEarnings = earningsByDate[lastMonthKey] || 0;

        setChartData(formattedChartData);
        setBruttoUmsatz(totalEarnings);
        setLastMonthUmsatz(lastMonthEarnings);
      } catch (err) {
        console.error("Error in useFetchEarnings:", err);
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
