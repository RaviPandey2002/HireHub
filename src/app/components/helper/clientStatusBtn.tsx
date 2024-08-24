"use client"
import { getSession, useSession } from "next-auth/react"
import { Button } from "@components/ui/button"

export const ClientStatusBtn = () => {
    const session = useSession();
    const onClick = async () => {
        const currentUser = await getSession();
        console.log("Header session", session.data)
        console.log("Header getSession", currentUser)
    }
    return (
        <>
            <Button onClick={onClick} className="ml-3 bg-blue-800 text-white h-10 w-30">
                Get userClientStatus
            </Button>
        </>
    );


}