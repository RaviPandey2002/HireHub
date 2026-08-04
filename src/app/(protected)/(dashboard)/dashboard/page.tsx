import { getUser } from "actions/getUser";
import { fetchCandidateDashboardStats, fetchRecruiterDashboardStats } from "data/user";
import { RecruiterDashboard } from "@/components/dash-components/recruiter-dashboard";
import { CandidateDashboard } from "@/components/dash-components/candidate-dashboard";
import { redirect } from "next/navigation";

async function DashboardPage() {
    const user = await getUser();
    if (!user || user.role === "OnBoarding") redirect("/onboard");

    if (user.role === "Recruiter") {
        const stats = await fetchRecruiterDashboardStats(user.id);
        return <RecruiterDashboard user={user} stats={stats} />;
    }

    const stats = await fetchCandidateDashboardStats(user.id);
    return <CandidateDashboard user={user} stats={stats} />;
}

export default DashboardPage;
