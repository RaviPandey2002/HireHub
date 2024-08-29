import { useSession } from 'next-auth/react'

export const useCurrentUser = async () => {
    const session =  useSession();
    return (session?.data?.user);
}
