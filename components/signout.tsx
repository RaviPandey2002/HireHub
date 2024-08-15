
import { Button } from "./ui/button";
import { signOut } from "../auth"

export const SignOut = () => {
    console.log("CLICKED")
    return (
        <>
            <Button
                className="bg-black text-white h-10 w-30">
                SignOut
            </Button>

        </>
    )
}