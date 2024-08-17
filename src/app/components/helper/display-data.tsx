"use client"
import { Button } from "@components/ui/button"
import { useCurrentUser } from "hooks/use-current-user"

export const DisplayData = () => {

    const userData = useCurrentUser();

    let data = null;
    const onClick = () => {
        console.log("DDDN:DDN:", userData);
    }
    return (
        <>
            {
                "Sonething" + JSON.stringify(data)
            }
            <Button onClick={onClick}>CLICK me</Button>
        </>
    )
}