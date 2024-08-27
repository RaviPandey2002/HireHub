import { Button } from "@/components/ui/button"
import { getUser } from "actions/getUser"

export const UserServerStatus = () => {
    const handleClick = async () => {
        const user = await getUser();
        console.log("Server-Side Btn:", user);
    }
    return (
        <Button className="ml-5 bg-blue-800 text-white h-10 w-30" onClick={handleClick}
            type="button"
        >
            Get userServerStatus
        </Button>
    );


}