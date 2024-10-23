import { Membership } from "@/components/membership";
import { getUser } from "actions/getUser";
import { redirect } from "next/navigation";



const MembershipPage = async () => {

    const user = await getUser();
    if(user?.role === 'OnBoarding') redirect('/onboard');

    return <Membership user={user} />;
}

export default MembershipPage;