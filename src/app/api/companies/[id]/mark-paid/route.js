import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid company ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const result = await db.collection("companies").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status_provisionen: true } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Fehler beim Aktualisieren:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
