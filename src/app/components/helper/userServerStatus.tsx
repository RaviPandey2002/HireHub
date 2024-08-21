"use client"
import { Button } from "@components/ui/button"
import { getUser } from "actions/getUser"

export const UserServerStatus = async () => {
    const user = await getUser();


    const handleClick = () => {
        console.log("Client-Side Click Event:", user);
    }
    return (
        <Button className="bg-blue-800 text-white h-10 w-30" onClick={handleClick}
            type="button"
        >
            Get userServerStatus
        </Button>
    );


}