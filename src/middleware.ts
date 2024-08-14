import NextAuth from "next-auth"
import authConfig from "../auth.config"
const { auth } = NextAuth(authConfig)
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  onBoardingRoute
} from "../routes"


export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const session = await auth();
  // console.log("SESSION : ", JSON.stringify(session))
  const ProfileInfo = null;

  if (isApiAuthRoute) {
    return (null);
  }
  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     if (!ProfileInfo) {
  //       return Response.redirect(new URL(onBoardingRoute, nextUrl));
  //     }
  //     else {
  //       return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  //     }
  //   }
  //   return null;
  // }

  if (isAuthRoute) {
    if (isLoggedIn) {
            return Response.redirect(new URL(onBoardingRoute, nextUrl));
          }
        return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("./login", nextUrl))
  }

  return null;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}