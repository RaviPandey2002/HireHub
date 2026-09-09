"use client";

import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  SendHorizonal,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ApplicationJob {
  id?: string;
  title: string;
  companyName: string;
  location?: string;
  type?: string;
}

interface Application {
  id: string;
  jobId: string;
  status: string[];
  jobApplicationDate: string;
  job?: ApplicationJob | null;
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
  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex items-center gap-4 shadow-sm">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

function formatUtcDate(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  } catch {
    return dateString;
  }
}

function getLatestStatus(status: string[] = []): "Selected" | "Rejected" | "Under Review" {
  if (status.includes("Selected")) return "Selected";
  if (status.includes("Rejected")) return "Rejected";
  return "Under Review";
}

export const CandidateDashboard = ({ user, stats }: CandidateDashboardProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>
          </p>
        </div>
        <Link href="/jobs">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm">
            Browse Open Jobs
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<SendHorizonal className="h-5 w-5" />}
          label="Total Applied"
          value={stats.total}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Pending Review"
          value={stats.applied}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-600" />}
          label="Selected"
          value={stats.selected}
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-rose-500 dark:text-rose-600" />}
          label="Rejected"
          value={stats.rejected}
        />
      </div>

      {/* Recent applications */}
      <div className="mt-10 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Your Applications
          </h2>
          {stats.total > 0 && (
            <Link
              href="/activity"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View Full Pipeline
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {stats.recentApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You haven&apos;t applied to any jobs yet.
            </p>
            <Link href="/jobs" className="inline-block mt-3">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Browse Open Roles
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentApplications.map((app) => {
              const status = getLatestStatus(app.status);
              const companyName = app.job?.companyName || "Hiring Company";
              const monogram = companyName
                .split(" ")
                .map((w) => w[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5 gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm"
                >
                  {/* Left: Avatar + Title + Company + Location */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm shadow-sm">
                      {monogram}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                        {app.job?.title || "Role Application"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          {companyName}
                        </span>
                        {app.job?.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {app.job.location}
                            </span>
                          </>
                        )}
                        {app.job?.type && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3 text-slate-400" />
                              {app.job.type}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Date + Status Badge + Track Link */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-900">
                    <span
                      className="text-xs text-slate-400 flex items-center gap-1"
                      suppressHydrationWarning
                    >
                      <Calendar className="h-3 w-3" />
                      Applied {formatUtcDate(app.jobApplicationDate)}
                    </span>

                    <Badge
                      variant={
                        status === "Selected"
                          ? "default"
                          : status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className={`font-semibold text-xs px-2.5 py-0.5 ${
                        status === "Selected"
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : status === "Under Review"
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                          : ""
                      }`}
                    >
                      {status === "Selected" ? "Selected 🎉" : status}
                    </Badge>

                    <Link href="/activity">
                      <Button variant="ghost" size="sm" className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900">
                        Track →
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
