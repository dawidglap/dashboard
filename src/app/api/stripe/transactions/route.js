import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key from your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    // Fetch the most recent payment intents from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 10, // Fetch the 10 most recent transactions
    });

    return NextResponse.json({
      success: true,
      data: paymentIntents.data.map((intent) => ({
        id: intent.id,
        amount: intent.amount / 100, // Convert from cents to currency
        currency: intent.currency,
        customer: intent.customer,
        description: intent.description,
        status: intent.status,
        created: new Date(intent.created * 1000).toISOString(), // Convert timestamp
      })),
    });
  } catch (error) {
    console.error("Error fetching transactions from Stripe:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
