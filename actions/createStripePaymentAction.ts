"use server"

const stripe = require('stripe')("sk_test_51QD56O09tjoAAPeCrS1UoMaCjgSgjPb1x4Pw9zItGo9RYP67ZzN5cQEFNDyMScvOyv1oghi1Ub4A6IoN9dQVgbcz00hyvZlxVp")

export async function createStripePaymentAction(data) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: data?.lineItems,
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/membership` + "?status=success",
      cancel_url: `${process.env.NEXTAUTH_URL}/membership` + "?status=cancel",
    });
  
    return {
      success: true,
      id: session?.id,
    };
  }

