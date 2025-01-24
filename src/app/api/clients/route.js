import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("dashboard");

    const { name, email, phone } = await req.json();

    // Insert new client
    const result = await db.collection("clients").insertOne({
      name,
      email,
      phone,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}
