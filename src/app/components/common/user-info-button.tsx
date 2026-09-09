"use client"

import { LogOut, Sparkles, User, LayoutDashboard } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function UserInfoButton() {
    const { data: session } = useSession()
    const user = session?.user

    // Build initials from the user's name or email, e.g. "John Doe" → "JD"
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
        : "?"

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9 ring-2 ring-transparent hover:ring-slate-300 dark:hover:ring-slate-700 transition-all">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white truncate">
                                {user?.name || "HireHub User"}
                            </p>
                            {user?.role && user.role !== "OnBoarding" && (
                                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    {user.role}
                                </span>
                            )}
                        </div>
                        <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard" className="flex items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4 text-slate-500" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/account" className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-slate-500" />
                            <span>Account Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/membership" className="flex items-center">
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                            <span>Membership</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
