import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch a single company by its _id
export async function GET(req, context) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = context.params;

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

export async function PUT(req, context) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = context.params;
    const updates = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Ungültige Firmen-ID" },
        { status: 400 }
      );
    }

    // Convert manager and markenbotschafter IDs to ObjectId if provided
    if (updates.manager_id)
      updates.manager_id = new ObjectId(updates.manager_id);
    if (updates.markenbotschafter_id)
      updates.markenbotschafter_id = new ObjectId(updates.markenbotschafter_id);

    // Validate Manager & Markenbotschafter before saving
    if (updates.manager_id) {
      const manager = await db.collection("users").findOne({
        _id: updates.manager_id,
        role: { $in: ["manager", "admin"] },
      });
      if (!manager)
        return NextResponse.json(
          { success: false, error: "Ungültige Manager-ID" },
          { status: 400 }
        );
    }

    if (updates.markenbotschafter_id) {
      const markenbotschafter = await db.collection("users").findOne({
        _id: updates.markenbotschafter_id,
        role: { $in: ["markenbotschafter", "admin"] },
      });
      if (!markenbotschafter)
        return NextResponse.json(
          { success: false, error: "Ungültige Markenbotschafter-ID" },
          { status: 400 }
        );
    }

    // Auto-adjust plan price if changed
    if (!updates.plan_price) {
      updates.plan_price =
        updates.plan === "BASIC"
          ? 799 * 12 * 1.081
          : updates.plan === "PRO"
          ? 899 * 12 * 1.081
          : null;
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
export async function DELETE(req, context) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = context.params;

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
