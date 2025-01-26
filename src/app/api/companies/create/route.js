import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard"); // Ensure this matches your database name

    const { company_id, amount } = await req.json();

    // Determine the plan based on the amount
    let plan = "";
    if (amount === 799) {
      plan = "BASIC";
    } else if (amount === 899) {
      plan = "PRO";
    } else if (amount > 1000) {
      plan = "BUSINESS";
    }

    // Insert a new company record into the database
    const result = await db.collection("companies").insertOne({
      company_id,
      company_name: "", // Empty for now
      plan,
      company_owner: "", // Empty for now
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
