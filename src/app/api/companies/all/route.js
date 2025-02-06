import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    // ✅ Fetch all companies without pagination
    const companies = await db.collection("companies").find({}).toArray();

    return NextResponse.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error(
      "Error fetching all companies for commissions:",
      error.message
    );
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
