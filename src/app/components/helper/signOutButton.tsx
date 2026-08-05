"use client"
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
    return (
        <Button className="h-10 px-5 ml-3" onClick={() => signOut()}>
            Sign Out
        </Button>
    );
}
