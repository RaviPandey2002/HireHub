"use server"

import { db } from "lib/db";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


export async function createPriceIdAction(data) {
    const session = await stripe.prices.create({
        currency: "inr",
        unit_amount: data?.amount * 100,
        recurring: {
            interval: "year",
        },
        product_data: {
            name: "Premium Plan",
        },
    });

    return {
        success: true,
        id: session?.id
    }
}
