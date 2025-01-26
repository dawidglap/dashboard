import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
      plan,
      company_owner,
      expiration_date,
      plan_price,
    } = await req.json();

    // Determine the default price if not provided manually
    let calculatedPlanPrice = plan_price;
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

    // Insert the new company record
    const result = await db.collection("companies").insertOne({
      company_id: company_id || null,
      company_name: company_name || "",
      plan: plan || "",
      company_owner: company_owner || "",
      expiration_date: determinedExpirationDate,
      plan_price: calculatedPlanPrice || null, // Include the plan_price
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
