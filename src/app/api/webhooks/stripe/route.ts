import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    if (!customerEmail) {
      return NextResponse.json({ error: "No customer email in session" }, { status: 400 });
    }

    // Retrieve the subscription to get the price metadata
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price?.id;

    // Map price amount back to plan type
    const amount = subscription.items.data[0]?.price?.unit_amount;
    let memberShipType = "basic";
    if (amount && amount >= 500000) memberShipType = "enterprise";
    else if (amount && amount >= 200000) memberShipType = "teams";

    const memberShipStartDate = new Date().toString();
    const yearsToAdd = memberShipType === "basic" ? 1 : memberShipType === "teams" ? 2 : 5;
    const memberShipEndDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + yearsToAdd)
    ).toString();

    await db.user.update({
      where: { email: customerEmail },
      data: {
        isPremiumUser: true,
        memberShipType,
        memberShipStartDate,
        memberShipEndDate,
      },
    });

    console.log(`Membership updated for ${customerEmail} → ${memberShipType}`);
  }

  return NextResponse.json({ received: true });
}
