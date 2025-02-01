import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Handle GET requests: Fetch all companies
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    // Fetch all companies from the database
    const companies = await db.collection("companies").find({}).toArray();

    return NextResponse.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

const ADMIN_ID = "679396cd375db32de1bbfd01"; // Default Admin ID

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const {
      company_id,
      company_name,
      company_street,
      company_street_number,
      company_post_code,
      company_city,
      company_email,
      telephone,
      mobile,
      plan,
      company_owner,
      expiration_date,
      plan_price,
      manager_id = ADMIN_ID,
      markenbotschafter_id = ADMIN_ID,
    } = await req.json();

    // ✅ Validate required fields
    if (
      !company_name ||
      !company_street ||
      !company_post_code ||
      !company_city ||
      !plan
    ) {
      return NextResponse.json(
        { success: false, error: "Pflichtfelder fehlen." },
        { status: 400 }
      );
    }

    // ✅ Convert IDs safely
    let managerObjectId, markenbotschafterObjectId;
    try {
      managerObjectId = new ObjectId(manager_id);
      markenbotschafterObjectId = new ObjectId(markenbotschafter_id);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Ungültige Benutzer-IDs." },
        { status: 400 }
      );
    }

    // ✅ Validate Manager & Markenbotschafter
    const manager = await db
      .collection("users")
      .findOne({ _id: managerObjectId, role: { $in: ["manager", "admin"] } });
    const markenbotschafter = await db
      .collection("users")
      .findOne({
        _id: markenbotschafterObjectId,
        role: { $in: ["markenbotschafter", "admin"] },
      });

    if (!manager || !markenbotschafter) {
      return NextResponse.json(
        {
          success: false,
          error: "Manager oder Markenbotschafter nicht gefunden.",
        },
        { status: 400 }
      );
    }

    // ✅ Ensure `plan_price` is always valid
    let calculatedPlanPrice = parseFloat(plan_price) || null;
    if (!plan_price) {
      calculatedPlanPrice =
        plan === "BASIC"
          ? 799 * 12 * 1.081
          : plan === "PRO"
          ? 899 * 12 * 1.081
          : null;
    }

    const determinedExpirationDate = expiration_date
      ? new Date(expiration_date)
      : null;

    // ✅ Insert the new company record
    const result = await db.collection("companies").insertOne({
      company_id: company_id || null,
      company_name: company_name.trim(),
      company_street: company_street.trim(),
      company_street_number: company_street_number?.trim() || "",
      company_post_code: company_post_code.trim(),
      company_city: company_city.trim(),
      company_email: company_email?.trim() || "",
      telephone: telephone?.trim() || "",
      mobile: mobile?.trim() || "",
      plan: plan.trim(),
      company_owner: company_owner || "",
      expiration_date: determinedExpirationDate,
      plan_price: calculatedPlanPrice,
      manager_id: managerObjectId,
      markenbotschafter_id: markenbotschafterObjectId,
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
