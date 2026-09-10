"use client";

import {
  LogOut,
  Sparkles,
  User,
  LayoutDashboard,
  Briefcase,
  SendHorizonal,
  Building2,
  UserCheck,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function UserInfoButton() {
  const { data: session } = useSession();
  const user = session?.user;

  // Build initials from user name or email
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "?";

  const isCandidate = user?.role === "Candidate";
  const isRecruiter = user?.role === "Recruiter";
  const isPremium = !!user?.isPremiumUser;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative rounded-full focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 transition-all group"
          aria-label="User Account Menu"
        >
          <Avatar className="h-9 w-9 ring-2 ring-transparent group-hover:ring-slate-300 dark:group-hover:ring-slate-700 transition-all cursor-pointer">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-200 font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Active online dot */}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-1.5" align="end" sideOffset={8}>
        {/* User Identity Header */}
        <DropdownMenuLabel className="font-normal p-3 rounded-lg bg-slate-50/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 mb-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 space-y-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">
                {user?.name || "HireHub User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-tight">
                {user?.email}
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                {user?.role && user.role !== "OnBoarding" && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  >
                    {user.role}
                  </Badge>
                )}
                {isPremium ? (
                  <Badge className="text-[10px] py-0 px-1.5 font-semibold bg-amber-500 hover:bg-amber-600 text-white gap-0.5">
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
        </DropdownMenuLabel>

        {/* Primary Workspace Links */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
            <Link href="/dashboard" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-sm">Dashboard</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Hub</span>
            </Link>
          </DropdownMenuItem>

          {isCandidate && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
                <Link href="/activity" className="flex items-center gap-2.5 w-full">
                  <SendHorizonal className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">My Applications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
                <Link href="/jobs" className="flex items-center gap-2.5 w-full">
                  <Briefcase className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium text-sm">Explore Openings</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {isRecruiter && (
            <>
              <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
                <Link href="/applicants" className="flex items-center gap-2.5 w-full">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium text-sm">Applicants Pipeline</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
                <Link href="/jobs" className="flex items-center gap-2.5 w-full">
                  <Briefcase className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-sm">Manage Postings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
                <Link href="/talent" className="flex items-center gap-2.5 w-full">
                  <Search className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-sm">Talent Discovery</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
            <Link href="/companies" className="flex items-center gap-2.5 w-full">
              <Building2 className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-sm">Companies Directory</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        {/* Account & Billing */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
            <Link href="/account" className="flex items-center gap-2.5 w-full">
              <User className="h-4 w-4 text-slate-500" />
              <span className="font-medium text-sm">Account Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer py-2 px-2.5 rounded-md">
            <Link href="/membership" className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="font-medium text-sm">Membership</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {isPremium ? "Active" : "Upgrade"}
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer py-2 px-2.5 rounded-md text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 flex items-center gap-2.5"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
