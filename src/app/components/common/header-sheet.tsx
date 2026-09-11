"use client";

import {
  AlignJustify,
  LayoutDashboard,
  Briefcase,
  SendHorizonal,
  Building2,
  User,
  Sparkles,
  LogOut,
  Home,
  UserCheck,
  Search,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "lib/utils";
import { AppUser } from "types";

export const HeaderSheet = ({
  menuItems,
  user,
}: {
  menuItems: { label: string; path: string; show: boolean }[];
  user: AppUser | null;
}) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => setIsOpen(false);
  const handleSubmit = () => signOut({ callbackUrl: "/login" });

  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?";

  const isPremium = !!user?.isPremiumUser;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
          >
            <AlignJustify className="h-5 w-5" />
            <span className="sr-only">Toggle Navigation Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-6 flex flex-col justify-between">
          <div>
            <SheetHeader className="text-left pb-4 border-b border-slate-100 dark:border-slate-800">
              {/* Brand in sheet */}
              <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-slate-900 dark:text-white select-none">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black">
                  H
                </span>
                HireHub
              </div>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation and user profile settings
              </SheetDescription>
            </SheetHeader>

            {/* Authenticated User Identity Card */}
            {user && (
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                <Avatar className="h-11 w-11 shrink-0">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || "HireHub User"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-1.5 pt-1">
                    {user?.role && user.role !== "OnBoarding" && (
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      >
                        {user.role}
                      </Badge>
                    )}
                    {isPremium ? (
                      <Badge className="text-[10px] py-0 px-1.5 font-semibold bg-amber-500 text-white gap-0.5">
                        <Sparkles className="h-2.5 w-2.5" /> Pro
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[10px] py-0 px-1.5 font-medium text-slate-500 dark:text-slate-400"
                      >
                        Free
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation Links */}
            <nav className="flex flex-col gap-1.5 mt-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1">
                Navigation
              </span>
              {menuItems.map((menuItem) => {
                if (!menuItem.show) return null;
                const isActive =
                  pathname === menuItem.path ||
                  (menuItem.path !== "/" && pathname.startsWith(menuItem.path));

                return (
                  <Link
                    href={menuItem.path}
                    key={menuItem.label}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {menuItem.label === "Home" && <Home className="h-4 w-4" />}
                      {menuItem.label === "Dashboard" && (
                        <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {menuItem.label === "Jobs" && <Briefcase className="h-4 w-4 text-indigo-500" />}
                      {menuItem.label === "Applications" && (
                        <SendHorizonal className="h-4 w-4 text-blue-500" />
                      )}
                      {menuItem.label === "Companies" && (
                        <Building2 className="h-4 w-4 text-purple-500" />
                      )}
                      {menuItem.label === "Applicants" && (
                        <UserCheck className="h-4 w-4 text-indigo-500" />
                      )}
                      {menuItem.label === "Talent Pool" && (
                        <Search className="h-4 w-4 text-amber-500" />
                      )}
                      {menuItem.label === "Complete Profile" && (
                        <User className="h-4 w-4 text-emerald-500" />
                      )}
                      {menuItem.label === "Login" && <LogIn className="h-4 w-4 text-slate-500" />}
                      {menuItem.label === "Register" && (
                        <UserPlus className="h-4 w-4 text-emerald-500" />
                      )}
                      <span>{menuItem.label}</span>
                    </div>
                    {isActive && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Account & Logout section */}
          {user && (
            <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-0.5">
                Preferences
              </span>
              <Link
                href="/account"
                onClick={handleLinkClick}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <User className="h-4 w-4 text-slate-500" />
                Account Settings
              </Link>
              <Link
                href="/membership"
                onClick={handleLinkClick}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Membership</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {isPremium ? "Active" : "Upgrade"}
                </span>
              </Link>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="mt-2"
              >
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 border-slate-200 dark:border-slate-800 gap-2 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </form>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
