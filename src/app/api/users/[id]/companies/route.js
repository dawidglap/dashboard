import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Fetch all companies where the user is a Manager or Markenbotschafter
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // ✅ Fetch companies where the user is assigned
    const companies = await db
      .collection("companies")
      .find({
        $or: [
          { manager_id: new ObjectId(id) },
          { markenbotschafter_id: new ObjectId(id) },
        ],
      })
      .toArray();

    return NextResponse.json({ success: true, companies }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching companies for user:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
