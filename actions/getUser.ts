import { auth } from "auth";
export const getUser = async () => {
    const session = await auth();
    const user = session?.user;
    return { user };
}