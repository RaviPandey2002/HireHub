"use server";

import { auth } from "auth";
import { env } from "lib/env";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY || "");

interface LineItem {
  price: string;
  quantity: number;
}

export async function createStripePaymentAction(data: {
  lineItems: LineItem[];
  planType?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id) {
      return { error: "Unauthorised" };
    }

    if (!env.STRIPE_SECRET_KEY) {
      return { error: "Stripe payments are not configured." };
    }

    const appUrl =
      env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: data.lineItems,
      mode: "subscription",
      client_reference_id: session.user.id,
      customer_email: session.user.email ?? undefined,
      metadata: {
        userId: session.user.id,
        planType: data.planType ?? "basic",
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planType: data.planType ?? "basic",
        },
      },
      success_url: `${appUrl}/membership?status=success`,
      cancel_url: `${appUrl}/membership?status=cancel`,
    });

    return {
      success: true,
      id: checkoutSession?.id as string,
    };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return { error: "Failed to initialize payment session. Please try again." };
  }
}
