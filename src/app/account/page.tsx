import { AccountInfo } from "@/components/accountInfo";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";

const AccountPage = async () => {
    const user = await getUser();
    if( user?.role === "OnBoarding") redirect('/onboard')
    return (<AccountInfo user={user} />)
}

export default AccountPage;