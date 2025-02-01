import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Handle GET requests: Fetch all companies
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    // Fetch all companies from the database
    const companies = await db.collection("companies").find({}).toArray();

    return NextResponse.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const {
      company_id,
      company_name,
      company_address,
      plan,
      company_owner,
      expiration_date,
      plan_price,
      manager_id,
      markenbotschafter_id,
    } = await req.json();

    // ✅ Validate required fields
    if (
      !company_name ||
      !company_address ||
      !plan ||
      !manager_id ||
      !markenbotschafter_id
    ) {
      return NextResponse.json(
        { success: false, error: "Alle Felder müssen ausgefüllt sein." },
        { status: 400 }
      );
    }

    // ✅ Convert IDs safely (Avoid error if invalid format)
    let managerObjectId, markenbotschafterObjectId;
    try {
      managerObjectId = new ObjectId(manager_id);
      markenbotschafterObjectId = new ObjectId(markenbotschafter_id);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Ungültige Benutzer-IDs." },
        { status: 400 }
      );
    }

    // ✅ Check if the manager exists in the users collection
    const manager = await db.collection("users").findOne({
      _id: managerObjectId,
      role: { $in: ["manager", "admin"] },
    });

    if (!manager) {
      return NextResponse.json(
        {
          success: false,
          error: "Manager-ID ist ungültig oder nicht gefunden.",
        },
        { status: 400 }
      );
    }

    // ✅ Check if the markenbotschafter exists in the users collection
    const markenbotschafter = await db.collection("users").findOne({
      _id: markenbotschafterObjectId,
      role: { $in: ["markenbotschafter", "admin"] },
    });

    if (!markenbotschafter) {
      return NextResponse.json(
        {
          success: false,
          error: "Markenbotschafter-ID ist ungültig oder nicht gefunden.",
        },
        { status: 400 }
      );
    }

    // ✅ Ensure `plan_price` is always valid
    let calculatedPlanPrice = parseFloat(plan_price) || null;
    if (!plan_price) {
      if (plan === "BASIC") {
        calculatedPlanPrice = 799 * 12 * 1.081; // Includes 8.1% tax
      } else if (plan === "PRO") {
        calculatedPlanPrice = 899 * 12 * 1.081; // Includes 8.1% tax
      }
    }

    const determinedExpirationDate = expiration_date
      ? new Date(expiration_date)
      : null;

    // ✅ Insert the new company record
    const result = await db.collection("companies").insertOne({
      company_id: company_id || null,
      company_name: company_name.trim(),
      company_address: company_address.trim(),
      plan: plan.trim(),
      company_owner: company_owner || "",
      expiration_date: determinedExpirationDate,
      plan_price: calculatedPlanPrice,
      manager_id: managerObjectId,
      markenbotschafter_id: markenbotschafterObjectId,
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Company added successfully",
      data: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding company:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
