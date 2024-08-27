import { getUser } from "actions/getUser"
import { SignOutButton } from "@components/helper/signOutButton";
import { DashboardHeader } from "@components/common/dashboard-header";

async function DashboardLayout({ children }) {
    const user = await getUser();
    console.log("Dashboard users", user);
    return (
        <>
            <div className="mx-auto max-w-7xl p-6 lg:px-8 ml-5">
                <DashboardHeader />
                <div>LAYOUT</div>
                <main>{children}</main>
                <SignOutButton />
            </div>
        </>
    )
}

export default DashboardLayout;