"use client";

import Link from "next/link";
import { Briefcase, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Application {
  id: string;
  name: string;
  email: string;
  jobId: string;
  status: string[];
  jobApplicationDate: string;
}

interface RecruiterStats {
  totalJobs: number;
  totalApplications: number;
  selected: number;
  rejected: number;
  pending: number;
  recentApplications: Application[];
}

interface RecruiterDashboardProps {
  user: { name?: string; recruiterInfo?: { companyName?: string } };
  stats: RecruiterStats;
}

const StatCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 flex items-center gap-4`}>
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

function statusBadgeVariant(status: string[]): "secondary" | "outline" | "destructive" {
  if (status.includes("Selected")) return "secondary";
  if (status.includes("Rejected")) return "destructive";
  return "outline";
}

function latestStatus(status: string[]): string {
  if (status.includes("Selected")) return "Selected";
  if (status.includes("Rejected")) return "Rejected";
  return "Applied";
}

export const RecruiterDashboard = ({ user, stats }: RecruiterDashboardProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b dark:border-gray-700 pb-6 pt-10">
        <div>
          <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {user?.recruiterInfo?.companyName ?? user?.name}
          </p>
        </div>
        <Link href="/jobs">
          <Button>Manage Jobs</Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={<Briefcase className="h-6 w-6 text-white" />}
          label="Jobs Posted"
          value={stats.totalJobs}
          accent="bg-black dark:bg-white [&>svg]:dark:text-black"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-white" />}
          label="Total Applicants"
          value={stats.totalApplications}
          accent="bg-black dark:bg-white [&>svg]:dark:text-black"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-white" />}
          label="Pending Review"
          value={stats.pending}
          accent="bg-black dark:bg-white [&>svg]:dark:text-black"
        />
        <StatCard
          icon={<CheckCircle2 className="h-6 w-6 text-white" />}
          label="Selected"
          value={stats.selected}
          accent="bg-black dark:bg-white [&>svg]:dark:text-black"
        />
        <StatCard
          icon={<XCircle className="h-6 w-6 text-white" />}
          label="Rejected"
          value={stats.rejected}
          accent="bg-black dark:bg-white [&>svg]:dark:text-black"
        />
      </div>

      {/* Recent applications */}
      <div className="mt-10 pb-24">
        <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">
          Recent Applications
        </h2>
        {stats.recentApplications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No applications yet. Post a job to get started.
          </p>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Candidate</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-950">
                {stats.recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{app.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{app.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(app.status)}>
                        {latestStatus(app.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400 dark:text-gray-500 hidden md:table-cell">
                      {new Date(app.jobApplicationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {stats.totalApplications > 10 && (
          <Link href="/jobs" className="block mt-4">
            <Button variant="outline" size="sm">View all in Jobs Dashboard →</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
