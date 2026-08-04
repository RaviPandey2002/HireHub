"use client";

import Link from "next/link";
import { CheckCircle2, XCircle, Clock, SendHorizonal } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Application {
  id: string;
  jobId: string;
  status: string[];
  jobApplicationDate: string;
}

interface CandidateStats {
  total: number;
  selected: number;
  rejected: number;
  applied: number;
  recentApplications: Application[];
}

interface CandidateDashboardProps {
  user: { name?: string };
  stats: CandidateStats;
}

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 flex items-center gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white">
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

export const CandidateDashboard = ({ user, stats }: CandidateDashboardProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b dark:border-gray-700 pb-6 pt-10">
        <div>
          <h1 className="text-4xl font-bold dark:text-white tracking-tight text-gray-950">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>
        <Link href="/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<SendHorizonal className="h-6 w-6 text-white dark:text-black" />} label="Total Applied" value={stats.total} />
        <StatCard icon={<Clock className="h-6 w-6 text-white dark:text-black" />} label="Pending" value={stats.applied} />
        <StatCard icon={<CheckCircle2 className="h-6 w-6 text-white dark:text-black" />} label="Selected" value={stats.selected} />
        <StatCard icon={<XCircle className="h-6 w-6 text-white dark:text-black" />} label="Rejected" value={stats.rejected} />
      </div>

      {/* Recent applications */}
      <div className="mt-10 pb-24">
        <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4">
          Your Applications
        </h2>
        {stats.recentApplications.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3">
            <p>You haven&apos;t applied to any jobs yet.</p>
            <Link href="/jobs">
              <Button variant="outline">Browse open roles</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-5 py-4"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Applied on {new Date(app.jobApplicationDate).toLocaleDateString()}
                </p>
                <Badge variant={statusBadgeVariant(app.status)}>
                  {latestStatus(app.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
        {stats.total > 0 && (
          <Link href="/activity" className="block mt-4">
            <Button variant="outline" size="sm">View full activity →</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
