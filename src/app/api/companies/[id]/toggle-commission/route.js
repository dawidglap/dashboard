// /api/companies/[id]/toggle-commission/route.js

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  const { id } = params;
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing company ID" },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();

    const company = await db.collection("companies").findOne({ _id: new ObjectId(id) });
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const newStatus = !company.status_provisionen;

    await db.collection("companies").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status_provisionen: newStatus } }
    );

    return NextResponse.json({ success: true, newStatus }, { status: 200 });
  } catch (error) {
    console.error("❌ Error toggling provision status:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
