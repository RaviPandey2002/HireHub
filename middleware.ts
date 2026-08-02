import { auth } from "auth.edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  apiWebhookPrefix,
  onBoardingRoute,
  DEFAULT_LOGIN_REDIRECT,
} from "routes";

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Server actions POST to the page URL with a Next-Action header —
  // never redirect them, let Next.js handle the action.
  const isServerAction = req.method === "POST" && req.headers.has("next-action");
  if (isServerAction) return NextResponse.next();

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiWebhookRoute = nextUrl.pathname.startsWith(apiWebhookPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnboardingRoute = onBoardingRoute.includes(nextUrl.pathname);

  // Always allow NextAuth API routes and webhooks
  if (isApiAuthRoute || isApiWebhookRoute) return NextResponse.next();

  // Logged-in users hitting /login or /register → send home
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Allow onboarding only for authenticated OnBoarding-role users
  if (isOnboardingRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // Public routes are always accessible
  if (isPublicRoute) return NextResponse.next();

  // Everything else requires authentication
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
