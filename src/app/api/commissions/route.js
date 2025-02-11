import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();

    // 🔹 Get the user from `/api/users/me`
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://business.webomo.ch";
    const sessionRes = await fetch(`${baseUrl}/api/users/me`, {
      headers: req.headers,
    });

    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = await sessionRes.json();
    const user = sessionData.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Fetch all companies
    const companies = await db.collection("companies").find().toArray();
    let commissions = [];

    for (const company of companies) {
      const managerId = company.manager_id.toString();
      const markenbotschafterId = company.markenbotschafter_id.toString();
      const userId = user._id.toString();

      // ✅ Fetch manager details
      const manager = await db
        .collection("users")
        .findOne(
          { _id: new ObjectId(managerId) },
          { projection: { name: 1, surname: 1 } }
        );

      // ✅ Fetch markenbotschafter details
      const markenbotschafter = await db
        .collection("users")
        .findOne(
          { _id: new ObjectId(markenbotschafterId) },
          { projection: { name: 1, surname: 1 } }
        );

      // ✅ Extract Startdatum (Company Creation Date)
      const startDate = company.created_at
        ? new Date(company.created_at).toLocaleDateString("de-DE")
        : "Kein Datum";

      // ✅ Calculate Zahlungsdatum (Payment Date: 25th of the next month)
      let zahlungsdatum = "Invalid Date";
      if (company.created_at) {
        const createdAt = new Date(company.created_at);
        zahlungsdatum = new Date(
          createdAt.getFullYear(),
          createdAt.getMonth() + 1,
          25
        ).toLocaleDateString("de-DE");
      }

      // ✅ Commission logic: Admin sees everything, others see only theirs
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
