// /api/users/[id]/markenbotschafter/route.js

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  const { id } = params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: "Invalid or missing user ID" },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();

    const users = await db
      .collection("users")
      .find({ role: "markenbotschafter", manager_id: new ObjectId(id) })
      .project({ _id: 1, name: 1, surname: 1, email: 1, birthday: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Markenbotschafter:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}