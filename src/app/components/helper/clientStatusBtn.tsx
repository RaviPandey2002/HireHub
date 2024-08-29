"use client"
import { getSession, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export const ClientStatusBtn = () => {
    // const clientSession = useSession();
    const onClick = async () => {
        const session = await getSession();
        console.log("ClientBTN",session?.user);
        // clientSession.update();
    }
    return (
        <>
            <Button onClick={onClick} className="ml-3 bg-blue-800 text-white h-6">
                client
            </Button>
        </>
    );

}