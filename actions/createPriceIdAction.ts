"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function createPriceIdAction(data: { amount: number }) {
  const price = await stripe.prices.create({
    currency: "inr",
    unit_amount: data.amount * 100,
    recurring: {
      interval: "year",
    },
    product_data: {
      name: "Premium Plan",
    },
  });

  return {
    success: true,
    id: price?.id as string,
  };
}
