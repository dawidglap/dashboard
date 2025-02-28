import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    // ✅ Fetch session directly (instead of fetching `/api/users/me`)
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Get user data from database based on session email
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch all companies
    const companies = await db.collection("companies").find().toArray();
    let commissions = [];

    for (const company of companies) {
      // ✅ Ensure `manager_id` and `markenbotschafter_id` exist before calling `.toString()`
      const managerId = company.manager_id?.toString();
      const markenbotschafterId = company.markenbotschafter_id?.toString();
      const userId = user._id.toString();

      // ✅ Fetch manager details
      const manager = managerId
        ? await db
            .collection("users")
            .findOne(
              { _id: new ObjectId(managerId) },
              { projection: { name: 1, surname: 1 } }
            )
        : null;

      // ✅ Fetch markenbotschafter details
      const markenbotschafter = markenbotschafterId
        ? await db
            .collection("users")
            .findOne(
              { _id: new ObjectId(markenbotschafterId) },
              { projection: { name: 1, surname: 1 } }
            )
        : null;

      // ✅ Extract Startdatum (Company Creation Date)
      const startDate = company.created_at
        ? new Date(company.created_at).toISOString().split("T")[0] // ✅ Always ensure correct ISO format (YYYY-MM-DD)
        : "Kein Datum";

      // ✅ Calculate Zahlungsdatum (Payment Date: 25th of the next month)
      let zahlungsdatum = "Invalid Date";
      if (company.created_at) {
        const createdAt = new Date(company.created_at);
        const paymentDate = new Date(
          createdAt.getFullYear(),
          createdAt.getMonth() + 1,
          25
        );
        zahlungsdatum = paymentDate.toISOString().split("T")[0]; // ✅ Convert to YYYY-MM-DD
      }

      // ✅ Commission logic: Admin sees everything, others see only their own
      if (user.role === "admin") {
        commissions.push(
          {
            userName: manager
              ? `${manager.name} ${manager.surname}`
              : "Unbekannt",
            companyName: company.company_name,
            amount: managerId === userId ? 0 : 1000,
            role: "manager",
            startDatum: startDate,
            zahlungsdatum: zahlungsdatum,
          },
          {
            userName: markenbotschafter
              ? `${markenbotschafter.name} ${markenbotschafter.surname}`
              : "Unbekannt",
            companyName: company.company_name,
            amount: markenbotschafterId === userId ? 0 : 1000,
            role: "markenbotschafter",
            startDatum: startDate,
            zahlungsdatum: zahlungsdatum,
          }
        );
      } else {
        if (managerId === userId) {
          commissions.push({
            userName: `${user.name} ${user.surname}`,
            companyName: company.company_name,
            amount: 1000,
            role: "manager",
            startDatum: startDate,
            zahlungsdatum: zahlungsdatum,
          });
        }
        if (markenbotschafterId === userId) {
          commissions.push({
            userName: `${user.name} ${user.surname}`,
            companyName: company.company_name,
            amount: 1000,
            role: "markenbotschafter",
            startDatum: startDate,
            zahlungsdatum: zahlungsdatum,
          });
        }
      }
    }

    return NextResponse.json({ success: true, commissions }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching commissions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
