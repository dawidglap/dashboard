import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid or missing User ID" },
        { status: 400 }
      );
    }

    // ✅ Fetch user details from the `users` collection
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
          referralId: 1, // ✅ Include referralId in projection
        },
      }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Generate the referral link
    const referralId = user.referralId || id; // Use referralId if exists, fallback to userId
    const referralLink = `https://business.webomo.ch/ref/${referralId}`;

    return NextResponse.json(
      {
        success: true,
        user: {
          ...user,
          referralLink, // ✅ Add referral link to response
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
