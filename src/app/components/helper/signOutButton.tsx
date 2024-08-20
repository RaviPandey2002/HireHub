"use client"

import { Button } from "../ui/button";
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export const SignOutButton = () => {
    const router = useRouter();
    const onClick = async () => {
        await signOut({redirect: false});
        console.log("REDIRECTED");
        router.push('./login');
    }
    return (
        <Button
            onClick={onClick}
            className="bg-blue-800 text-white h-10 w-30"
        >
            SignOut Client
        </Button>
    )
}