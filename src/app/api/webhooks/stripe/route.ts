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
    const customerEmail = session.customer_details?.email ?? session.customer_email;
    const userId = session.client_reference_id ?? session.metadata?.userId;

    if (!userId && !customerEmail) {
      return NextResponse.json({ error: "No user identification in session" }, { status: 400 });
    }

    // Determine membership plan type from metadata, or fallback to subscription price
    let memberShipType = session.metadata?.planType;

    if (!memberShipType && session.subscription) {
      try {
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const amount = subscription.items.data[0]?.price?.unit_amount;
        if (amount && amount >= 500000) memberShipType = "enterprise";
        else if (amount && amount >= 200000) memberShipType = "teams";
        else memberShipType = "basic";
      } catch (err) {
        console.error("Failed to retrieve subscription:", err);
      }
    }

    if (!memberShipType) {
      memberShipType = "basic";
    }

    const memberShipStartDate = new Date().toString();
    const yearsToAdd = memberShipType === "basic" ? 1 : memberShipType === "teams" ? 2 : 5;
    const memberShipEndDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + yearsToAdd)
    ).toString();

    const updateData = {
      isPremiumUser: true,
      memberShipType,
      memberShipStartDate,
      memberShipEndDate,
    };

    if (userId) {
      await db.user.update({
        where: { id: userId },
        data: updateData,
      });
    } else if (customerEmail) {
      await db.user.update({
        where: { email: customerEmail },
        data: updateData,
      });
    }
  }

  return NextResponse.json({ received: true });
}
