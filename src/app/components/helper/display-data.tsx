import { auth } from "auth";

export const DisplayData = async () => {
    const session = await auth();
    console.log("SESSION: ", session.user);
        return (
        <div>
            {JSON.parse(JSON.stringify(session))}
        </div>
    )
}