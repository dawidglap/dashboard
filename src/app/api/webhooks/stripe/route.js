import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Add this to your .env

  let event;

  try {
    const rawBody = await req.text(); // Stripe needs the raw body
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    // Extract relevant data
    const company_id = paymentIntent.id;
    const amount = paymentIntent.amount / 100; // Convert from cents to CHF

    // Determine the plan
    let plan = "";
    if (amount === 799) {
      plan = "BASIC";
    } else if (amount === 899) {
      plan = "PRO";
    } else if (amount > 1000) {
      plan = "BUSINESS";
    }

    // Connect to MongoDB and add the company
    try {
      const client = await clientPromise;
      const db = client.db("dashboard");

      await db.collection("companies").insertOne({
        company_id,
        company_name: "",
        plan,
        company_owner: "",
        created_at: new Date(),
      });

      console.log(`Company with ID ${company_id} added to the database.`);
    } catch (error) {
      console.error("Error adding company to database:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
