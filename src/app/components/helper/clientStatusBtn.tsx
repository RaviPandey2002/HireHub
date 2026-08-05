"use client"

import { getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export const ClientStatusBtn = () => {
    const onClick = async () => {
        await getSession();
    }
    return (
        <Button onClick={onClick} className="ml-3 bg-blue-800 text-white h-6">
            client
        </Button>
    );
}
