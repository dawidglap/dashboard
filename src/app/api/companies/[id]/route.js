import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch a single company by its _id
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = params; // Extract `_id` from the request URL

    const company = await db.collection("companies").findOne({
      _id: new ObjectId(id),
    });

    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a company by its _id
export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = params;
    const updates = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Firmen-ID" },
        { status: 400 }
      );
    }

    // Convert manager and markenbotschafter IDs to ObjectId
    if (updates.manager_id)
      updates.manager_id = new ObjectId(updates.manager_id);
    if (updates.markenbotschafter_id)
      updates.markenbotschafter_id = new ObjectId(updates.markenbotschafter_id);

    // Ensure expiration_date is stored correctly
    if (updates.expiration_date) {
      updates.expiration_date = new Date(updates.expiration_date);
    }

    // Validate Manager exists
    const manager = await db.collection("users").findOne({
      _id: updates.manager_id,
      role: { $in: ["manager", "admin"] },
    });

    if (!manager) {
      return NextResponse.json(
        { success: false, error: "Manager-ID ist ungültig" },
        { status: 400 }
      );
    }

    // Validate Markenbotschafter exists
    const markenbotschafter = await db.collection("users").findOne({
      _id: updates.markenbotschafter_id,
      role: { $in: ["markenbotschafter", "admin"] },
    });

    if (!markenbotschafter) {
      return NextResponse.json(
        { success: false, error: "Markenbotschafter-ID ist ungültig" },
        { status: 400 }
      );
    }

    // Auto-adjust plan price if changed
    if (!updates.plan_price) {
      if (updates.plan === "BASIC") {
        updates.plan_price = 799 * 12 * 1.081;
      } else if (updates.plan === "PRO") {
        updates.plan_price = 899 * 12 * 1.081;
      }
    }

    const result = await db
      .collection("companies")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Firma nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Firma erfolgreich aktualisiert!",
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a company by its _id
export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = params; // Extract `_id` from the request URL

    const result = await db
      .collection("companies")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
