"use server"
import { auth } from "auth";
export const getUser = async () => {
    const session = await auth();
    const user = session?.user;
    if(!user) return null;
    return JSON.parse(JSON.stringify(user));
}