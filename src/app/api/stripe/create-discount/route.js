import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    // 🔍 Parsing del body JSON
    const body = await req.json();
    console.log("📨 Ricevuto body:", body);

    const { name, surname } = body;

    if (!name || !surname) {
      return NextResponse.json(
        { success: false, message: "Missing name or surname" },
        { status: 400 }
      );
    }

    // 🔡 Generazione codice base
    const baseCode = `${name.slice(0, 3)}${surname.slice(0, 3)}`.toUpperCase();
    let finalCode = baseCode;
    let counter = 1;

    // 🔁 Controllo codici già esistenti
    const existingCodes = await stripe.promotionCodes.list({ limit: 100 });
    const codeExists = (code) =>
      existingCodes.data.some((promo) => promo.code === code);

    while (codeExists(finalCode)) {
      finalCode = `${baseCode}${counter}`;
      counter++;
    }

    // 🎟️ Creazione del coupon Stripe
    const coupon = await stripe.coupons.create({
      percent_off: 10, // Modifica qui lo sconto se vuoi
      duration: "forever",
    });

    // 💬 Creazione del codice promozionale leggibile
    const promotionCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: finalCode,
    });

    console.log("✅ Codice sconto creato:", finalCode);

    return NextResponse.json({ success: true, code: finalCode });
  } catch (error) {
    console.error("❌ Errore Stripe:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
