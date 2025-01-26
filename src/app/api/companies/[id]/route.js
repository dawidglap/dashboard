import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch a single company by its _id
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { id } = params; // Extract `_id` from the request URL

    // Fetch the company by `_id`
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

    const { id } = params; // Extract `_id` from the request URL
    const updates = await req.json(); // Parse the request body for updates

    // Update the company with the provided data
    const result = await db
      .collection("companies")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company updated successfully",
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

    // Delete the company with the provided `_id`
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
