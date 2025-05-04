import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const referrals = await db.collection("referral_clicks").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $project: {
          _id: 1,
          timestamp: 1,
          userId: 1,
          ip: 1,
          userAgent: 1,
          "user.email": 1,
          "user.name": 1,
          "user.surname": 1,
        },
      },
    ]).toArray();

    return NextResponse.json({ referrals });
  } catch (error) {
    console.error("❌ Errore nel recupero referral:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
