"use client"
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "lib/utils";

export const HeaderSheet = ({ menuItems, user }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleLinkClick = () => setIsOpen(false);
    const handleSubmit = () => signOut();

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsOpen(true)}
                    >
                        <AlignJustify className="h-5 w-5" />
                        <span className="sr-only">Toggle Navigation Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                    {/* Brand in sheet */}
                    <div className="flex items-center gap-2 mb-6 font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black">
                            H
                        </span>
                        HireHub
                    </div>
                    <nav className="flex flex-col gap-1">
                        {menuItems.map((menuItem) =>
                            menuItem.show ? (
                                <Link
                                    href={menuItem.path}
                                    key={menuItem.label}
                                    onClick={handleLinkClick}
                                    className={cn(
                                        "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        pathname === menuItem.path ||
                                        (menuItem.path !== "/" && pathname.startsWith(menuItem.path))
                                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    {menuItem.label}
                                </Link>
                            ) : null
                        )}
                    </nav>
                    {user && (
                        <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <Button type="submit" variant="outline" className="w-full">
                                    Logout
                                </Button>
                            </form>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
