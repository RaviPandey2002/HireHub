import NextAuth from "node_modules/next-auth"
import authConfig from "../auth.config"
const { auth } = NextAuth(authConfig)
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  onBoardingRoute
} from "../routes"
import { getUser } from "../actions/getUser"


export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);


  if (isApiAuthRoute) {
    return (null);
  }

  const user = await getUser();
  console.log("MIDDLEWARE")
  if (isAuthRoute || isPublicRoute) {
    if (isLoggedIn && user?.role === "OnBoarding") {
      return Response.redirect(new URL(onBoardingRoute, nextUrl));
    }
    if (isLoggedIn && isAuthRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }

    return null;
  }

  return null;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}