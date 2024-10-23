"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const stripePromise = loadStripe(
    "pk_test_51QD56O09tjoAAPeC5hwzj1oCoPZigFRzrvC3LNk5iHvonLDTjdsbGp28yoZPO7SP8lcMMD6VBtbcQXkpc2zxuZRc00rXVaxXzy"
);
import { Button } from "./ui/button";
import { membershipPlans } from "lib/utils";
import { CommonCard } from "./common/common-card";
import { JobIcon } from "./dash-components/job-icon";
import { updateProfileAction } from "actions/updateProfileAction";
import { createStripePaymentAction } from "actions/createStripePaymentAction";
import { createPriceIdAction } from "actions/createPriceIdAction";

export const Membership = ({ user }) => {
    const pathName = useSearchParams();

    async function handlePayment(getCurrentPlan) {
        const stripe = await stripePromise;
        const extractPriceId = await createPriceIdAction({
            amount: Number(getCurrentPlan?.price),
        });

        if (extractPriceId) {
            sessionStorage.setItem("currentPlan", JSON.stringify(getCurrentPlan));
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

    async function updateProfile() {
        const fetchCurrentPlanFromSessionStroage = JSON.parse(
            sessionStorage.getItem("currentPlan")
        );

        await updateProfileAction(
            {
                ...user,
                isPremiumUser: true,
                memberShipType: fetchCurrentPlanFromSessionStroage?.type,
                memberShipStartDate: new Date().toString(),
                memberShipEndDate: new Date(
                    new Date().getFullYear() +
                        fetchCurrentPlanFromSessionStroage?.type ===
                        "basic"
                        ? 1
                        : fetchCurrentPlanFromSessionStroage?.plan === "teams"
                            ? 2
                            : 5,
                    new Date().getMonth(),
                    new Date().getDay()
                ).toString(),
            },
            "/membership"
        );
    }

    useEffect(() => {
        if (pathName.get("status") === "success") updateProfile();
    }, [pathName]);





    return (<>
        <div className="mx-auto max-w-7xl">
            <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-24">
                <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
                    {user?.isPremiumUser
                        ? "You are a Premium User"
                        : "Choose Your Best Plan"}
                </h1>
                <div>
                    {user?.isPremiumUser ? (
                        <Button className="flex h-11 items-center justify-center px-5">
                            {
                                membershipPlans.find(
                                    (planItem) => planItem.type === user?.memberShipType
                                ).heading
                            }
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className="py-20 pb-24 pt-6">
                <div className="container mx-auto p-0 space-y-8">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
                        {membershipPlans.map((plan, index) => (
                            <CommonCard
                                key={index}
                                icon={
                                    <div className="flex justify-between">
                                        <div>
                                            <JobIcon />
                                        </div>
                                        <h1 className="font-bold text-2xl">{plan.heading}</h1>
                                    </div>
                                }
                                title={`$ ${plan.price} /yr`}
                                description={plan.type}
                                footerContent={
                                    user?.memberShipType === "enterprise" ||
                                    (user?.memberShipType === "basic" && index === 0) ||
                                    (user?.memberShipType === "teams" &&
                                        index >= 0 &&
                                        index < 2 ? null : (
                                        <Button
                                            onClick={() => handlePayment(plan)}
                                            className="disabled:opacity-65 dark:bg-[#fffa27] flex h-11 items-center justify-center px-5"
                                        >
                                            {user?.memberShipType === "basic" ||
                                                user?.memberShipType === "teams"
                                                ? "Update Plan"
                                                : "Get Premium"}
                                        </Button>
                                    ))
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>);
}