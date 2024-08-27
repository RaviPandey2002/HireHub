"use client"
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton =  () => {
    const onClick = () => {
        console.log("Logout using client SignOut");
        signOut();
    }
    return (
       <Button onClick={onClick}>
        SignOUT
       </Button>
    )
}