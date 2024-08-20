import { useSession } from "next-auth/react"
import { Button } from "@components/ui/button"

export const UserClientStatus = () => {
    const session = useSession();
    const onClick = () => {
        console.log("Client User clicked", { session })
    }
    return (
        <>
            <Button onClick={onClick} className="ml-3 bg-blue-800 text-white h-10 w-30">
                Get userClientStatus
            </Button>
        </>
    );


}