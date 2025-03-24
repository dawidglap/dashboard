import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const { company_id, status_provisionen } = await req.json();

    if (!company_id) {
      return NextResponse.json({ error: "Missing company ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("dashboard");

    const result = await db.collection("companies").updateOne(
      { _id: new ObjectId(company_id) },
      { $set: { status_provisionen: !!status_provisionen } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Company not updated" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
