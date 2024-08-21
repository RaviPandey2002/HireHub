"use client"
import { useSession } from 'next-auth/react'

export const useCurrentUser = () => {
    const session = useSession();
    console.log("FROM CC: ",session.data);
    return (session.data?.user);
}
