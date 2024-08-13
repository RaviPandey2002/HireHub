import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { signIn } from "next-auth/react";

export const OtherProviders = () => {
    return (
        <>
            <div className="flex items-center w-full gap-x-2 justify-center mb-2 mt-3">
                <button
                    onClick={() => signIn("google")}
                    className="border border-black rounded-md p-[10px] [150px] w-full flex justify-center"
                >
                    <FcGoogle className="h-5 w-5" />
                </button>
                <button
                    onClick={() => signIn("github")}
                    className="border border-black rounded-md p-[10px] [150px] w-full flex justify-center"
                >
                    <FaGithub className="h-5 w-5" />
                </button>
            </div>
        </>
    )
}