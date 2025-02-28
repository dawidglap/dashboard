import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb"; // 🔹 Ensure ObjectId is imported

export async function GET(request) {
  try {
    const session = await getServerSession({ req: request, ...authOptions });

    if (!session || !session.user) {
      console.error("❌ Session not found in API.");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { role, email } = session.user;
    console.log("API Request Received -> Role:", role, "Email:", email);

    const client = await clientPromise;
    const db = client.db("dashboard");

    let filter = {};

    if (role === "manager" || role === "markenbotschafter") {
      const user = await db.collection("users").findOne({ email });

      if (!user) {
        console.error("❌ User not found for email:", email);
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      console.log("User ID Retrieved:", user._id.toString());

      // 🔹 Ensure we filter using ObjectId
      filter = {
        $or: [
          { manager_id: new ObjectId(user._id) },
          { markenbotschafter_id: new ObjectId(user._id) },
        ],
      };
    }

    // Fetch companies based on role
    const companies = await db.collection("companies").find(filter).toArray();

    console.log("✅ Companies Retrieved:", companies.length); // Debugging

    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    console.error("❌ Error in API:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
