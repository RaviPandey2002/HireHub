"use client"

import { getUser } from "actions/getUser"
import { Button } from "@/components/ui/button"

export const UserServerStatus = () => {
    const handleClick = async () => {
        await getUser();
    }
    return (
        <Button className="ml-5 bg-blue-800 text-white h-10 w-30" onClick={handleClick} type="button">
            server
        </Button>
    );
}
