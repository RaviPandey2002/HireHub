"use server";

import { auth } from "auth";
import { membershipPlans } from "lib/utils";
import { env } from "lib/env";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY || "");

export async function createPriceIdAction(data: { amount?: number; planType?: string }) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorised" };
  }

  // Validate against known membership plans
  const matchedPlan = membershipPlans.find(
    (p) => p.type === data.planType || p.price === data.amount
  );

  if (!matchedPlan) {
    return { error: "Invalid plan" };
  }

  const price = await stripe.prices.create({
    currency: "inr",
    unit_amount: matchedPlan.price * 100,
    recurring: {
      interval: "year",
    },
    product_data: {
      name: `${matchedPlan.heading} (${matchedPlan.type.toUpperCase()})`,
    },
  });

  return {
    success: true,
    id: price?.id as string,
  };
}
