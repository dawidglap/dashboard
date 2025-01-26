import { NextResponse } from "next/server";
import Stripe from "stripe";
import clientPromise from "@/lib/mongodb";

// Configura Stripe con la tua chiave segreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    // Verifica l'autenticità del webhook
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Errore di validazione Webhook:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Processa l'evento `payment_intent.succeeded`
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      const client = await clientPromise;
      const db = client.db("dashboard");

      // Determina il piano in base all'importo
      let plan = "";
      if (paymentIntent.amount_received === 79900) {
        plan = "BASIC";
      } else if (paymentIntent.amount_received === 89900) {
        plan = "PRO";
      } else if (paymentIntent.amount_received > 100000) {
        plan = "BUSINESS";
      }

      // Crea un record nella collezione `companies`
      await db.collection("companies").insertOne({
        company_id: paymentIntent.id,
        company_name: "",
        plan,
        company_owner: "",
        created_at: new Date(),
      });

      console.log("Nuova azienda creata:", paymentIntent.id);
    } catch (err) {
      console.error("Errore durante la creazione del record:", err.message);
      return NextResponse.json({ error: "Database Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
