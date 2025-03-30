import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

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
    const rawUser = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    );

    if (!rawUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Se è un markenbotschafter e ha un manager, popola il campo
    let user = { ...rawUser };
    if (rawUser.role === "markenbotschafter" && rawUser.manager_id) {
      const manager = await db
        .collection("users")
        .findOne(
          { _id: new ObjectId(rawUser.manager_id) },
          { projection: { name: 1, surname: 1, email: 1 } }
        );
      if (manager) {
        user.manager = manager;
      }
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
