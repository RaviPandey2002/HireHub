"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Sparkles,
  Users2,
  Building2,
  Check,
  Loader2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";
import { membershipPlans } from "lib/utils";
import { createStripePaymentAction } from "actions/createStripePaymentAction";
import { createPriceIdAction } from "actions/createPriceIdAction";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const planDescriptions: Record<string, { subtitle: string; features: string[] }> = {
  basic: {
    subtitle: "For active engineers applying to top tech companies",
    features: [
      "Apply to unlimited engineering positions",
      "Priority candidate profile visibility to recruiters",
      "Verified candidate profile badge",
      "Secure cloud resume hosting & previews",
      "Direct recruiter status notification emails",
    ],
  },
  teams: {
    subtitle: "For fast-growing startups and hiring squads",
    features: [
      "Everything in Professional, plus:",
      "Post up to 10 active engineering roles",
      "Full applicant tracking pipeline & review",
      "Direct candidate resume downloads & reviews",
      "Priority candidate recommendation matching",
      "Priority email & technical support",
    ],
  },
  enterprise: {
    subtitle: "For scaling tech enterprises with multi-role hiring needs",
    features: [
      "Everything in Teams Growth, plus:",
      "Post unlimited active job listings",
      "Unlimited candidate applications review",
      "Multi-seat recruiter collaboration",
      "Dedicated talent account manager",
      "Custom ATS integrations & export",
      "99.9% uptime SLA & 24/7 dedicated support",
    ],
  },
};

const planIcons = {
  basic: <Sparkles className="h-5 w-5 text-blue-500" />,
  teams: <Zap className="h-5 w-5 text-amber-500" />,
  enterprise: <Building2 className="h-5 w-5 text-purple-500" />,
};

const planDisplayNames: Record<string, string> = {
  basic: "Professional",
  teams: "Teams Growth",
  enterprise: "Enterprise Scale",
};

const faqs = [
  {
    q: "Can I cancel or upgrade my plan anytime?",
    a: "Yes. You can upgrade, downgrade, or cancel your membership anytime directly from your Account settings. All changes take effect immediately.",
  },
  {
    q: "What is the difference between the Free Tier and paid plans?",
    a: "Free accounts can apply to max 2 jobs (candidates) or publish max 2 jobs (recruiters). Paid plans unlock unlimited applications, advanced candidate pipelines, and priority recruitment matching.",
  },
  {
    q: "Is payment secure?",
    a: "100% secure. All transactions are encrypted and processed by Stripe, the global standard for online payments. HireHub never stores or has access to your credit card data.",
  },
  {
    q: "Can I get an invoice or company receipt?",
    a: "Yes. Stripe automatically generates PDF tax receipts and VAT/GST compliant invoices sent straight to your billing email.",
  },
];

export const Membership = ({ user }: { user: any }) => {
  const { toast } = useToast();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  async function handlePayment(getCurrentPlan: any) {
    if (!stripePublishableKey || !stripePromise) {
      toast({
        variant: "destructive",
        title: "Stripe payments not configured",
        description:
          "Please configure NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment to process test checkouts.",
      });
      return;
    }

    setProcessingPlan(getCurrentPlan?.type);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Unable to connect to Stripe. Please check your publishable key.",
        });
        return;
      }

      const extractPriceId = await createPriceIdAction({
        planType: getCurrentPlan?.type,
        amount: Number(getCurrentPlan?.price),
      });

      if (!extractPriceId?.id) {
        toast({
          variant: "destructive",
          title: "Price initialization failed",
          description: "Could not create Stripe price item for this plan.",
        });
        return;
      }

      const result = await createStripePaymentAction({
        planType: getCurrentPlan?.type,
        lineItems: [
          {
            price: extractPriceId?.id,
            quantity: 1,
          },
        ],
      });

      if (result?.id) {
        await stripe.redirectToCheckout({
          sessionId: result?.id,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Checkout failed",
          description: result?.error || "Could not initialize Stripe checkout session.",
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Payment error",
        description: err?.message || "An unexpected error occurred during checkout.",
      });
    } finally {
      setProcessingPlan(null);
    }
  }

  const { memberShipType } = user ?? {};
  const isPremiumUser = !!user?.isPremiumUser;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. HERO HEADER BANNER                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-indigo-50/70 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold"
            >
              HireHub Plans
            </Badge>
            {isPremiumUser ? (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-1">
                <Sparkles className="h-3 w-3" /> Active:{" "}
                {planDisplayNames[memberShipType] || "Premium Tier"}
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-medium text-slate-600 dark:text-slate-400">
                Free Tier (2 actions limit)
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isPremiumUser ? "Manage Your Membership" : "Upgrade Your Career & Hiring Superpowers"}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {user?.role === "Recruiter"
              ? "Scale your technical team with unlimited job listings, direct applicant pipeline management, and priority candidate visibility."
              : "Unlock unlimited job applications, priority recruiter reach, and verified candidate profile badges to land your next technical role."}
          </p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. PRICING PLAN CARDS                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {membershipPlans.map((plan) => {
          const isOwned =
            memberShipType === plan.type ||
            (memberShipType === "enterprise" &&
              (plan.type === "basic" || plan.type === "teams")) ||
            (memberShipType === "teams" && plan.type === "basic");

          const isPopular = plan.type === "teams";
          const details = planDescriptions[plan.type] || { subtitle: "", features: [] };
          const isCurrentLoading = processingPlan === plan.type;

          return (
            <div
              key={plan.type}
              className={`relative flex flex-col justify-between rounded-3xl border transition-all duration-200 p-7 bg-white dark:bg-slate-950 ${
                isPopular
                  ? "border-emerald-500/80 dark:border-emerald-500/80 shadow-lg ring-2 ring-emerald-500/20"
                  : "border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1 text-xs font-bold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </span>
                </div>
              )}

              <div>
                {/* Header: Icon + Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    {planIcons[plan.type]}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {planDisplayNames[plan.type] || plan.heading}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {plan.heading}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px] mb-5 leading-relaxed">
                  {details.subtitle}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    / year (billed annually)
                  </span>
                </div>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-2.5">
                    {details.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-normal"
                      >
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mt-0.5">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {isOwned ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/30"
                  >
                    ✓ Current Active Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePayment(plan)}
                    disabled={isCurrentLoading}
                    className={`w-full font-semibold gap-2 shadow-sm ${
                      isPopular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white"
                    }`}
                  >
                    {isCurrentLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        {memberShipType ? "Upgrade Plan" : "Get Started Now"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. SECURITY & TRUST BADGE                                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-6 px-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          End-to-end encrypted checkout via Stripe
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Lock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Cancel or downgrade anytime with 1 click
        </span>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Zap className="h-4 w-4 text-amber-500" />
          Instant membership activation upon payment
        </span>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. FREQUENTLY ASKED QUESTIONS SECTION                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about our plans, quotas, and billing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-2 shadow-2xs"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
