import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const user = await db.collection("users").findOne(
      { email: session.user.email },
      {
        projection: {
          password: 0, // Exclude password from response
        },
      }
    );

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      surname,
      email,
      phone_number,
      user_street,
      user_postcode,
      user_street_number,
      user_city,
      subscription_expiration,
    } = body;

    // Prevent role and is_active from being changed by the user
    const updateData = {
      ...(name && { name }),
      ...(surname && { surname }),
      ...(email && { email }),
      ...(phone_number && { phone_number }),
      ...(user_street && { user_street }),
      ...(user_postcode && { user_postcode }),
      ...(user_street_number && { user_street_number }),
      ...(user_city && { user_city }),
      ...(subscription_expiration && { subscription_expiration }),
    };

    // Ensure there's something to update
    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No fields provided to update",
        }),
        { status: 400 }
      );
    }

    const result = await db
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: updateData });

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Profile updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
