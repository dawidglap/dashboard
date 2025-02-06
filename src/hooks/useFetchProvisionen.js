// import { useState, useEffect } from "react";

// const useFetchProvisionen = (timeframe = "monthly") => {
//   const [chartData, setChartData] = useState([]);
//   const [bruttoProvisionen, setBruttoProvisionen] = useState(0);
//   const [commissionsList, setCommissionsList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProvisionenData = async () => {
//       try {
//         // ✅ Fetch companies data
//         const companiesResponse = await fetch("/api/companies/all"); // ✅ Fetch all companies
//         if (!companiesResponse.ok)
//           throw new Error("Error fetching companies data.");
//         const companiesData = await companiesResponse.json();

//         console.log("📌 Total Companies Fetched:", companiesData.data.length);
//         console.log("📌 Companies Data:", companiesData.data);

//         // ✅ Fetch users data (to check roles)
//         const usersResponse = await fetch("/api/users"); // ✅ Ensure the correct fetch URL
//         if (!usersResponse.ok) throw new Error("Error fetching users data.");
//         const usersData = await usersResponse.json();

//         // ✅ Use `usersData.users` instead of `usersData.data`
//         if (!usersData?.users || !Array.isArray(usersData.users)) {
//           throw new Error("Users data is invalid.");
//         }

//         // ✅ Fix: Create a correct mapping of users
//         const usersMap = {};
//         usersData.users.forEach((user) => {
//           usersMap[user._id] = { name: user.name, role: user.role };
//         });

//         let totalCommissions = 0;
//         let commissionsByDate = {};
//         let commissionsDetails = [];

//         companiesData.data.forEach((company) => {
//           const date = new Date(company.created_at);
//           let formattedDate;

//           if (timeframe === "daily") {
//             formattedDate = date.toISOString().split("T")[0];
//           } else if (timeframe === "weekly") {
//             const year = date.getFullYear();
//             const week = Math.ceil(date.getDate() / 7);
//             formattedDate = `${year}-W${week}`;
//           } else if (timeframe === "monthly") {
//             formattedDate = `${date.toLocaleString("default", {
//               month: "short",
//             })} '${date.getFullYear().toString().slice(-2)}`;
//           } else {
//             formattedDate = date.getFullYear().toString();
//           }

//           const manager = usersMap[company.manager_id] || {
//             name: "Unbekannt",
//             role: "unknown",
//           };
//           const markenbotschafter = usersMap[company.markenbotschafter_id] || {
//             name: "Unbekannt",
//             role: "unknown",
//           };

//           let managerCommission = manager.role === "admin" ? 0 : 1000;
//           let markenbotschafterCommission =
//             markenbotschafter.role === "admin" ? 0 : 1000;
//           let companyCommission =
//             managerCommission + markenbotschafterCommission;

//           totalCommissions += companyCommission;
//           commissionsByDate[formattedDate] =
//             (commissionsByDate[formattedDate] || 0) + companyCommission;

//           // ✅ Store each commission entry
//           if (managerCommission > 0) {
//             commissionsDetails.push({
//               userName: manager.name,
//               companyName: company.company_name,
//               amount: managerCommission,
//               paymentDate: new Date(
//                 date.getFullYear(),
//                 date.getMonth() + 2,
//                 25
//               ),
//             });
//           }

//           if (markenbotschafterCommission > 0) {
//             commissionsDetails.push({
//               userName: markenbotschafter.name,
//               companyName: company.company_name,
//               amount: markenbotschafterCommission,
//               paymentDate: new Date(
//                 date.getFullYear(),
//                 date.getMonth() + 2,
//                 25
//               ),
//             });
//           }
//         });

//         // ✅ Convert into chart data format
//         const formattedChartData = Object.keys(commissionsByDate).map(
//           (key) => ({
//             period: key,
//             earnings: commissionsByDate[key],
//           })
//         );

//         formattedChartData.sort(
//           (a, b) => new Date(a.period) - new Date(b.period)
//         );

//         setChartData(formattedChartData);
//         setBruttoProvisionen(totalCommissions);
//         setCommissionsList(commissionsDetails);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProvisionenData();
//   }, [timeframe]);

//   return {
//     chartData,
//     bruttoProvisionen,
//     commissions: commissionsList,
//     loading,
//     error,
//   };
// };

// export default useFetchProvisionen;

import { useState, useEffect } from "react";

const useFetchProvisionen = (timeframe = "monthly") => {
  const [chartData, setChartData] = useState([]);
  const [bruttoProvisionen, setBruttoProvisionen] = useState(0);
  const [commissionsList, setCommissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateFakeData = () => {
      let fakeData = [];
      let commissionsByDate = {};
      let commissionsDetails = [];
      let totalCommissions = 0;

      let currentDate = new Date();

      // Simulating 365 days of commission data
      for (let i = 0; i < 365; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        let formattedDate = date.toISOString().split("T")[0];

        // Simulate fake companies with managers and markenbotschafters
        let fakeCompanies = Array.from({ length: 2 }, (_, index) => ({
          company_name: `Company ${i + index}`,
          manager: {
            name: `Manager ${i + index}`,
            role: i % 3 === 0 ? "admin" : "manager", // Every 3rd one is an admin
          },
          markenbotschafter: {
            name: `Markenbotschafter ${i + index}`,
            role: i % 4 === 0 ? "admin" : "markenbotschafter", // Every 4th one is an admin
          },
        }));

        fakeCompanies.forEach((company) => {
          let managerCommission = company.manager.role === "admin" ? 0 : 1000;
          let markenbotschafterCommission =
            company.markenbotschafter.role === "admin" ? 0 : 1000;

          let companyCommission =
            managerCommission + markenbotschafterCommission;
          totalCommissions += companyCommission;

          commissionsByDate[formattedDate] =
            (commissionsByDate[formattedDate] || 0) + companyCommission;

          // Store commission details
          if (managerCommission > 0) {
            commissionsDetails.push({
              userName: company.manager.name,
              companyName: company.company_name,
              amount: managerCommission,
              paymentDate: new Date(
                date.getFullYear(),
                date.getMonth() + 2,
                25
              ),
            });
          }

          if (markenbotschafterCommission > 0) {
            commissionsDetails.push({
              userName: company.markenbotschafter.name,
              companyName: company.company_name,
              amount: markenbotschafterCommission,
              paymentDate: new Date(
                date.getFullYear(),
                date.getMonth() + 2,
                25
              ),
            });
          }
        });
      }

      // Convert into chart data format
      const formattedChartData = Object.keys(commissionsByDate).map((key) => ({
        period: key,
        earnings: commissionsByDate[key],
      }));

      formattedChartData.sort(
        (a, b) => new Date(a.period) - new Date(b.period)
      );

      setChartData(formattedChartData);
      setBruttoProvisionen(totalCommissions);
      setCommissionsList(commissionsDetails);
      setLoading(false);
    };

    generateFakeData();
  }, [timeframe]);

  return {
    chartData,
    bruttoProvisionen,
    commissions: commissionsList,
    loading,
    error,
  };
};

export default useFetchProvisionen;
