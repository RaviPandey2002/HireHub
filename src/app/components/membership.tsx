"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
import { Sparkles, Users2, Building2, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { membershipPlans } from "lib/utils";
import { createStripePaymentAction } from "actions/createStripePaymentAction";
import { createPriceIdAction } from "actions/createPriceIdAction";

const planFeatures: Record<string, string[]> = {
    basic: [
        "Apply to unlimited jobs",
        "Profile visible to recruiters",
        "Resume hosting",
        "Email support",
    ],
    teams: [
        "Everything in Basic",
        "Post up to 10 jobs",
        "Applicant tracking dashboard",
        "Priority email support",
    ],
    enterprise: [
        "Everything in Teams",
        "Unlimited job postings",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
    ],
};

const planIcons = {
    basic: <Sparkles className="h-6 w-6" />,
    teams: <Users2 className="h-6 w-6" />,
    enterprise: <Building2 className="h-6 w-6" />,
};

export const Membership = ({ user }) => {

    async function handlePayment(getCurrentPlan) {
        const stripe = await stripePromise;
        const extractPriceId = await createPriceIdAction({
            amount: Number(getCurrentPlan?.price),
        });

        if (extractPriceId) {
            const result = await createStripePaymentAction({
                lineItems: [
                    {
                        price: extractPriceId?.id,
                        quantity: 1,
                    },
                ],
            });

            await stripe.redirectToCheckout({
                sessionId: result?.id,
            });
        }
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Page header */}
            <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-10">
                <div>
                    <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
                        {user?.isPremiumUser ? "Your Membership" : "Choose a Plan"}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {user?.isPremiumUser
                            ? "You&apos;re on a premium plan. Upgrade anytime to unlock more."
                            : "Unlock more job postings and features with a premium plan."}
                    </p>
                </div>
                {user?.isPremiumUser && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                        {membershipPlans.find((p) => p.type === user?.memberShipType)?.heading ?? "Premium"}
                    </Badge>
                )}
            </div>

            {/* Plan grid */}
            <div className="py-10 pb-24">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {membershipPlans.map((plan, index) => {
                        const { memberShipType } = user ?? {};
                        // A plan is "owned/superseded" if the user already has it or has a higher tier
                        const isOwned =
                            memberShipType === plan.type ||
                            (memberShipType === "enterprise" && (plan.type === "basic" || plan.type === "teams")) ||
                            (memberShipType === "teams" && plan.type === "basic");

                        const isPopular = plan.type === "teams";
                        const features = planFeatures[plan.type] ?? [];

                        return (
                            <div
                                key={plan.type}
                                className={`relative flex flex-col rounded-xl border p-6 transition-shadow ${
                                    isPopular
                                        ? "border-gray-900 dark:border-white shadow-lg"
                                        : "border-gray-200 dark:border-gray-700"
                                } bg-white dark:bg-gray-900`}
                            >
                                {/* Most Popular badge */}
                                {isPopular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-gray-900 dark:bg-white px-3 py-0.5 text-xs font-semibold text-white dark:text-gray-900">
                                        Most Popular
                                    </span>
                                )}

                                {/* Icon + heading */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                        {planIcons[plan.type]}
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {plan.heading}
                                    </h2>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                        ${plan.price}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/year</span>
                                </div>

                                {/* Feature list */}
                                <ul className="mb-8 flex-1 space-y-2.5">
                                    {features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900 dark:text-white" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                {!isOwned && (
                                    <Button
                                        onClick={() => handlePayment(plan)}
                                        variant={isPopular ? "default" : "outline"}
                                        className="w-full"
                                    >
                                        {memberShipType ? "Upgrade Plan" : "Get Started"}
                                    </Button>
                                )}
                                {isOwned && (
                                    <Button variant="secondary" className="w-full" disabled>
                                        Current Plan
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
