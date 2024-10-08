"use client"
import { AlignJustify } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import { signOut } from "next-auth/react";
export const HeaderSheet = ({ menuItems, user }) => {
    const handleSubmit =() => {
        signOut();
    }
    const [isOpen, setIsOpen]= useState(false);
    const handleLinkClick = ()=>{
        setIsOpen(false);
    } 

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button className="lg:hidden" onClick={()=>{setIsOpen(true)}} >
                        <AlignJustify className="h-6 w-6" />
                        <span className="sr-only">Toggle Navigation Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-2/3 ">
                    <div className="grid gap-2 py-6">
                        {menuItems.map((menuItem) =>
                            menuItem.show ? (
                                <Link
                                    href={menuItem.path}
                                    className="flex w-full items-center py-2 text-lg font-semibold"
                                    key={menuItem.label}
                                    onClick={handleLinkClick}
                                >
                                    {menuItem.label}
                                </Link>
                            ) : null
                        )}
                    </div>
                    {
                        user ? <form action={handleSubmit} >
                            <Button type="submit" className="w-full">
                                Logout
                            </Button>
                        </form> : null
                    }
                </SheetContent>
            </Sheet>
        </>
    )
}