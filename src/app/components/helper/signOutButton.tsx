"use client"

import { Button } from "../ui/button";
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export const SignOutButton = () => {
    const router = useRouter();
    const onClick = async () => {
        console.log("REID: ");
        await signOut({redirect: false});
        router.push('./login');
    }
    console.log("Client signOut CLICKED");
    return (
        <Button
            onClick={onClick}
            className="bg-blue-800 text-white h-10 w-30"
        >
            SignOut Client
        </Button>
    )
}