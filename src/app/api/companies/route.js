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

    const { company_id, company_name, plan, company_owner, expiration_date } =
      await req.json();

    // Use the provided expiration_date or default to null (no fallback to "today + 1 year")
    const determinedExpirationDate = expiration_date
      ? new Date(expiration_date)
      : null;

    // Insert the new company record
    const result = await db.collection("companies").insertOne({
      company_id: company_id || null, // Nullable
      company_name: company_name || "", // Empty if not provided
      plan: plan || "", // Empty if not provided
      company_owner: company_owner || "", // Empty if not provided
      expiration_date: determinedExpirationDate, // Directly use the provided expiration_date
      created_at: new Date(), // Always use the current date
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
