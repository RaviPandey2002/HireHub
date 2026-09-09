import { getUser } from "actions/getUser";
import { fetchCandidateDashboardStats, fetchRecruiterDashboardStats } from "data/user";
import { RecruiterDashboard } from "@/components/dash-components/recruiter-dashboard";
import { CandidateDashboard } from "@/components/dash-components/candidate-dashboard";
import { redirect } from "next/navigation";
import { db } from "lib/db";

async function DashboardPage() {
    const user = await getUser();
    if (!user || user.role === "OnBoarding") redirect("/onboard");

    if (user.role === "Recruiter") {
        const stats = await fetchRecruiterDashboardStats(user.id);
        return <RecruiterDashboard user={user} stats={stats} />;
    }

    const [stats, featuredJobs, totalJobsCount] = await Promise.all([
        fetchCandidateDashboardStats(user.id),
        db.jobs.findMany({
            take: 3,
            orderBy: { id: "desc" },
        }),
        db.jobs.count(),
    ]);

    return (
        <CandidateDashboard
            user={user}
            stats={stats}
            featuredJobs={JSON.parse(JSON.stringify(featuredJobs))}
            totalJobsCount={totalJobsCount}
        />
    );
}

export default DashboardPage;
