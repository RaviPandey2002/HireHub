"use client"
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton =  () => {
    const onClick = () => {
        console.log("Logout using client SignOut");
        signOut();
    }
    return (
       <Button className="h-3 w-3 ml-9 mr-8" onClick={onClick}>
        SignOUT
       </Button>
    )
}