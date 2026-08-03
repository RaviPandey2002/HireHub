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
  // In NextAuth v5 the JWT token fields are merged directly onto req.auth.user.
  // Depending on the version, role may live at req.auth.user.role OR at the
  // token level via req.auth.user (which IS the token).  Read both paths.
  const role = (req.auth?.user?.role ?? (req.auth as any)?.token?.role) as string | undefined;
  const isOnboarding = role === "OnBoarding";

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

  // Logged-in users hitting /login or /register → send to onboard (if needed) or home
  if (isAuthRoute) {
    if (isLoggedIn) {
      const dest = isOnboarding ? "/onboard" : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(dest, nextUrl));
    }
    return NextResponse.next();
  }

  // Onboarding route — must be logged in
  if (isOnboardingRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  // Public routes are always accessible
  if (isPublicRoute) {
    // If a logged-in OnBoarding user hits "/" redirect them to /onboard
    if (isLoggedIn && isOnboarding) {
      return NextResponse.redirect(new URL("/onboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Everything else requires authentication
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Authenticated OnBoarding-role users can only access /onboard
  if (isOnboarding) {
    return NextResponse.redirect(new URL("/onboard", nextUrl));
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
