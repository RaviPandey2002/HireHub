import { getUser } from "actions/getUser"
import authConfig from "auth.config"
import { NextResponse } from "next/server"
import NextAuth from "node_modules/next-auth"
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  onBoardingRoute,
  publicRoutes
} from "routes"
const { auth } = NextAuth(authConfig)


export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isOnBoardingRoute = onBoardingRoute.includes(nextUrl.pathname);


  if (isApiAuthRoute) {
    return (null);
  }
  if (isPublicRoute) return (null);

  if (isAuthRoute) {
    if (!isLoggedIn) return null;
  }

  const user = await getUser();
  
  if (isOnBoardingRoute) {
    if (user?.role !== "OnBoarding") {
      return NextResponse.redirect(new URL(process.env.NEXTAUTH_URL, nextUrl));
    }
  }
  if (!isOnBoardingRoute) {
    if (user?.role === "OnBoarding") {
      return NextResponse.redirect(new URL("/onboard", nextUrl));
    }
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL(process.env.NEXTAUTH_URL, nextUrl));
  }


  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(process.env.NEXTAUTH_URL, nextUrl))
  }

  return null;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}