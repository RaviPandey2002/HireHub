import { Button } from "@components/ui/button"
import { getUser } from "actions/getUser"

export const UserServerStatus = async () => {
    const user = await getUser();
    const onClick = () => {
        console.log("Server Session:", { user });
    }
    return (
        <form onSubmit={onClick}>
            <Button className="bg-blue-800 text-white h-10 w-30">
                Get userServerStatus
            </Button>
        </form>
    );


}