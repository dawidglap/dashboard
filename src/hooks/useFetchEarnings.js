// import { useState, useEffect } from "react";

// const useFetchEarnings = (timeframe = "monthly") => {
//   const [chartData, setChartData] = useState([]);
//   const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
//   const [lastMonthUmsatz, setLastMonthUmsatz] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEarningsData = async () => {
//       try {
//         const response = await fetch("/api/companies");
//         if (!response.ok) throw new Error("Error fetching companies data.");
//         const data = await response.json();

//         let totalEarnings = 0;
//         let lastMonthEarnings = 0;
//         let earningsByDate = {};

//         // Process and group data based on timeframe
//         data.data.forEach((company) => {
//           const date = new Date(company.created_at);
//           const formattedDate =
//             timeframe === "daily"
//               ? date.toISOString().split("T")[0] // YYYY-MM-DD
//               : timeframe === "weekly"
//               ? `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}` // YYYY-WXX
//               : timeframe === "monthly"
//               ? `${date.toLocaleString("default", { month: "short" })} '${date
//                   .getFullYear()
//                   .toString()
//                   .slice(-2)}`
//               : date.getFullYear().toString(); // Yearly

//           const earnings =
//             company.plan === "BASIC"
//               ? 799 * 12 * 1.081
//               : company.plan === "PRO"
//               ? 899 * 12 * 1.081
//               : company.plan === "BUSINESS" && company.plan_price
//               ? parseFloat(company.plan_price)
//               : 0;

//           totalEarnings += earnings;
//           earningsByDate[formattedDate] =
//             (earningsByDate[formattedDate] || 0) + earnings;
//         });

//         // Convert to chart format
//         const formattedChartData = Object.keys(earningsByDate).map((key) => ({
//           period: key,
//           earnings: earningsByDate[key],
//         }));

//         // Calculate last month earnings for growth calculation
//         const lastMonth = new Date();
//         lastMonth.setMonth(lastMonth.getMonth() - 1);
//         const lastMonthKey = `${lastMonth.toLocaleString("default", {
//           month: "short",
//         })} '${lastMonth.getFullYear().toString().slice(-2)}`;
//         lastMonthEarnings = earningsByDate[lastMonthKey] || 0;

//         setChartData(formattedChartData);
//         setBruttoUmsatz(totalEarnings);
//         setLastMonthUmsatz(lastMonthEarnings);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEarningsData();
//   }, [timeframe]);

//   return { chartData, bruttoUmsatz, lastMonthUmsatz, loading, error };
// };

// export default useFetchEarnings;

import { useState, useEffect } from "react";

const useFetchEarnings = (timeframe = "monthly") => {
  const [chartData, setChartData] = useState([]);
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [lastMonthUmsatz, setLastMonthUmsatz] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Generate fake data
    const generateFakeData = () => {
      let fakeData = [];
      let totalEarnings = 0;
      let lastMonthEarnings = 0;
      let currentDate = new Date();
      let lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      if (timeframe === "daily") {
        // Generate daily earnings for the last 30 days
        for (let i = 0; i < 30; i++) {
          let date = new Date();
          date.setDate(date.getDate() - i);
          let earnings = Math.floor(Math.random() * 5000) + 2000; // Random earnings between 2,000 and 5,000
          fakeData.push({ period: date.toISOString().split("T")[0], earnings });
          totalEarnings += earnings;
          if (date.getMonth() === lastMonth.getMonth())
            lastMonthEarnings += earnings;
        }
      } else if (timeframe === "weekly") {
        // Generate weekly earnings for the last 12 weeks
        for (let i = 0; i < 12; i++) {
          let week = `Week ${i + 1}`;
          let earnings = Math.floor(Math.random() * 20000) + 5000;
          fakeData.push({ period: week, earnings });
          totalEarnings += earnings;
          if (i === 10 || i === 11) lastMonthEarnings += earnings; // Approximate last month's earnings
        }
      } else if (timeframe === "monthly") {
        // Generate monthly earnings for the last 12 months
        for (let i = 0; i < 12; i++) {
          let date = new Date();
          date.setMonth(date.getMonth() - i);
          let earnings = Math.floor(Math.random() * 30000) + 10000;
          fakeData.push({
            period: `${date.toLocaleString("default", {
              month: "short",
            })} '${date.getFullYear().toString().slice(-2)}`,
            earnings,
          });
          totalEarnings += earnings;
          if (date.getMonth() === lastMonth.getMonth())
            lastMonthEarnings += earnings;
        }
      } else {
        // Generate yearly earnings for the last 5 years
        for (let i = 0; i < 5; i++) {
          let year = currentDate.getFullYear() - i;
          let earnings = Math.floor(Math.random() * 500000) + 100000;
          fakeData.push({ period: year.toString(), earnings });
          totalEarnings += earnings;
          if (year === lastMonth.getFullYear()) lastMonthEarnings += earnings;
        }
      }

      // Reverse data so it's in chronological order
      fakeData.reverse();

      setChartData(fakeData);
      setBruttoUmsatz(totalEarnings);
      setLastMonthUmsatz(lastMonthEarnings);
      setLoading(false);
    };

    generateFakeData();
  }, [timeframe]);

  return { chartData, bruttoUmsatz, lastMonthUmsatz, loading, error };
};

export default useFetchEarnings;
