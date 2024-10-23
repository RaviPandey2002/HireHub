"use server"

import { db } from "lib/db";
const stripe = require('stripe')("sk_test_51QD56O09tjoAAPeCrS1UoMaCjgSgjPb1x4Pw9zItGo9RYP67ZzN5cQEFNDyMScvOyv1oghi1Ub4A6IoN9dQVgbcz00hyvZlxVp")


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
