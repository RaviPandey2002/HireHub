import { auth } from "auth";
import Link from "next/link";
import { HeaderSheet } from "./header-sheet";
import { UserInfoButton } from "./user-info-button";
import { NavLink } from "./nav-link";

async function Header({ user }) {
  const isOnboarded = !!user && user.role !== "OnBoarding";
  const isOnboarding = user?.role === "OnBoarding";

  const menuItems = [
    { label: "Home",             path: "/",           show: true },
    { label: "Dashboard",        path: "/dashboard",  show: isOnboarded },
    { label: "Feed",             path: "/feed",       show: isOnboarded },
    { label: "Jobs",             path: "/jobs",       show: isOnboarded },
    { label: "Activity",         path: "/activity",   show: isOnboarded && user?.role === "Candidate" },
    { label: "Companies",        path: "/companies",  show: isOnboarded && user?.role === "Candidate" },
    { label: "Membership",       path: "/membership", show: isOnboarded },
    { label: "Account",          path: "/account",    show: isOnboarded },
    { label: "Complete Profile", path: "/onboard",    show: isOnboarding },
    { label: "Login",            path: "/login",      show: !user },
    { label: "Register",         path: "/register",   show: !user },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-gray-900 dark:text-white select-none"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black">
            H
          </span>
          HireHub
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) =>
            item.show ? (
              <NavLink key={item.label} href={item.path}>
                {item.label}
              </NavLink>
            ) : null
          )}
          {user ? (
            <span className="ml-2">
              <UserInfoButton />
            </span>
          ) : null}
        </nav>

        {/* Mobile menu */}
        <HeaderSheet menuItems={menuItems} user={user} />
      </div>
    </header>
  );
}

export default Header;
