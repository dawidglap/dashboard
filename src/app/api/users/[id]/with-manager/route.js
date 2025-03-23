import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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

    // Fetch base user data
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          _id: 1,
          name: 1,
          surname: 1,
          email: 1,
          phone_number: 1,
          user_street: 1,
          user_street_number: 1,
          user_postcode: 1,
          user_city: 1,
          subscription_expiration: 1,
          referralId: 1,
          role: 1,
          manager_id: 1,
          createdAt: 1,
        },
      }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Build referral link
    const referralId = user.referralId || id;
    const referralLink = `https://business.webomo.ch/ref/${referralId}`;

    let manager = null;

    // If user is a markenbotschafter, fetch manager details
    if (user.role === "markenbotschafter" && user.manager_id && ObjectId.isValid(user.manager_id)) {
      manager = await db.collection("users").findOne(
        { _id: new ObjectId(user.manager_id) },
        {
          projection: {
            _id: 1,
            name: 1,
            surname: 1,
            email: 1,
            phone_number: 1,
            role: 1,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        referralLink,
        ...(manager && { manager }), // Add manager only if available
      },
    });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen des Benutzers mit Manager:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
