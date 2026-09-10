"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  SendHorizonal,
  Building2,
  MapPin,
  Briefcase,
  ArrowRight,
  Calendar,
  Sparkles,
  TrendingUp,
  FileText,
  Zap,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AppUser, CandidateDashboardStats, JobOpening } from "types";

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

interface FeaturedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  skills: string;
}

interface CandidateDashboardProps {
  user: AppUser | null;
  stats: CandidateDashboardStats | null;
  featuredJobs?: JobOpening[];
  totalJobsCount?: number;
}

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

export const CandidateDashboard = ({
  user,
  stats,
  featuredJobs = [],
  totalJobsCount = 18,
}: CandidateDashboardProps) => {
  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  const isPremium = !!user?.isPremiumUser;
  const applicationCount = stats?.total || 0;
  const isQuotaExceeded = !isPremium && applicationCount >= 2;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. DYNAMIC WELCOME HERO BANNER                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {firstName} 👋
              </h1>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-semibold"
              >
                Candidate
              </Badge>
              {isPremium ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-1">
                  <Sparkles className="h-3 w-3" /> Premium Member
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-slate-600 dark:text-slate-400 font-medium">
                  Free Tier
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Track your active job applications in real time, monitor recruiter feedback, and discover newly opened engineering positions.
            </p>

            {/* Application Quota Alert / Pill */}
            <div className="pt-1">
              {!isPremium ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/90 px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-2xs">
                  <span className="font-semibold">Applications:</span>
                  <span className={isQuotaExceeded ? "text-amber-600 font-bold" : "font-bold text-slate-900 dark:text-white"}>
                    {applicationCount} / 2 used
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <Link
                    href="/membership"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Upgrade for Unlimited <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="h-3.5 w-3.5" /> Unlimited Job Applications Active
                </div>
              )}
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/jobs">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm">
                <Briefcase className="h-4 w-4" />
                Explore Jobs
              </Button>
            </Link>
            <Link href="/activity">
              <Button variant="outline" className="gap-2 font-semibold border-slate-300 dark:border-slate-700">
                <Clock className="h-4 w-4" />
                Track Applications
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. COLOR-CODED METRIC CARDS                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Applied */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applied
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <SendHorizonal className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.total || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Submitted applications
            </p>
          </div>
        </div>

        {/* Under Review */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Under Review
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.applied || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Pending recruiter decision
            </p>
          </div>
        </div>

        {/* Selected */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Selected
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats?.selected || 0}
            </p>
            <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
              Matches & offers 🎉
            </p>
          </div>
        </div>

        {/* Live Openings */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Openings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalJobsCount}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Verified tech positions
            </p>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. QUICK ACTION SHORTCUT CARDS                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/jobs"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/60 p-3 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Explore {totalJobsCount}+ Open Roles
              </p>
              <p className="text-xs text-slate-400">Search by location, stack & level</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
        </Link>

        <Link
          href="/account"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/60 p-3 text-blue-600 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Resume & Profile
              </p>
              <p className="text-xs text-slate-400">Keep your skills and details up to date</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
        </Link>

        <Link
          href="/membership"
          className="group flex items-center justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/60 p-3 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Membership Perks
              </p>
              <p className="text-xs text-slate-400">Unlock unlimited job applications</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
        </Link>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. RECENT APPLICATIONS LIVE COMMAND FEED                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recent Applications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status tracking for your submitted candidacies
            </p>
          </div>
          {stats && stats.total > 0 && (
            <Link
              href="/activity"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View Full Pipeline
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {!stats || stats.recentApplications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto mb-3">
              <SendHorizonal className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No applications submitted yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Explore open positions at top tech companies and submit your application to track your progress here.
            </p>
            <Link href="/jobs" className="inline-block mt-4">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Explore Jobs Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentApplications.slice(0, 5).map((app) => {
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5 gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
                >
                  {/* Left: Monogram + Title + Company + Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-sm shadow-sm">
                      {monogram}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                        {app.job?.title || "Role Application"}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
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
                      <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900">
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

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. FRESH OPPORTUNITIES SPOTLIGHT                             */}
      {/* ──────────────────────────────────────────────────────────── */}
      {featuredJobs.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                New Opportunities for You
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Recently added roles from top tech teams hiring now
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Browse all {totalJobsCount} jobs
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => {
              const companyMonogram = (job.companyName || "C")
                .split(" ")
                .map((w) => w[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase();

              const skills = (job.skills || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .slice(0, 2);

              return (
                <div
                  key={job.id}
                  className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-2xs">
                          {companyMonogram}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {job.companyName}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0 font-medium text-slate-600 dark:text-slate-400">
                        {job.type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span>{job.experience} exp</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {skills.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link href="/jobs">
                      <Button size="sm" variant="ghost" className="h-7 text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 px-2 hover:text-emerald-700">
                        Apply <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

