"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

interface LineItem {
  price: string;
  quantity: number;
}

export async function createStripePaymentAction(data: { lineItems: LineItem[] }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: data.lineItems,
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/membership?status=success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/membership?status=cancel`,
  });

  return {
    success: true,
    id: session?.id as string,
  };
}
