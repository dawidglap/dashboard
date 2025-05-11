import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { name, surname } = await req.json();

    if (!name || !surname) {
      return NextResponse.json({ success: false, message: "Missing name or surname" }, { status: 400 });
    }

    const baseCode = `${name.slice(0, 3)}${surname.slice(0, 3)}`.toUpperCase();

    // Cerca codici che iniziano con baseCode
    const promotionCodes = await stripe.promotionCodes.list({ limit: 100 });

    const match = promotionCodes.data.find((code) =>
      code.code.startsWith(baseCode)
    );

    if (match) {
      return NextResponse.json({ success: true, code: match.code });
    } else {
      return NextResponse.json({ success: false, message: "No code found" });
    }
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
