"use client";

import Link from "next/link";
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  ArrowRight,
  Building2,
  Sparkles,
  MapPin,
  TrendingUp,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PostNewJob } from "./post-new-job";

interface Application {
  id: string;
  name: string;
  email: string;
  jobId: string;
  status: string[];
  jobApplicationDate: string;
  job?: {
    title?: string;
    companyName?: string;
    location?: string;
    type?: string;
  } | null;
}

interface PostedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  skills: string;
  applicantCount?: number;
}

interface RecruiterStats {
  totalJobs: number;
  totalApplications: number;
  selected: number;
  rejected: number;
  pending: number;
  recentApplications: Application[];
  postedJobs?: PostedJob[];
}

interface RecruiterDashboardProps {
  user: {
    id?: string;
    name?: string;
    email?: string;
    isPremiumUser?: boolean;
    recruiterInfo?: { companyName?: string };
  };
  stats: RecruiterStats | null;
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

function getInitials(name?: string) {
  if (!name) return "CA";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderStatusBadge(status: string[]) {
  if (status.includes("Selected")) {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 gap-1 font-medium">
        <CheckCircle2 className="h-3 w-3" /> Selected
      </Badge>
    );
  }
  if (status.includes("Rejected")) {
    return (
      <Badge variant="destructive" className="gap-1 font-medium">
        <XCircle className="h-3 w-3" /> Rejected
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 gap-1 font-medium"
    >
      <Clock className="h-3 w-3" /> In Review
    </Badge>
  );
}

export const RecruiterDashboard = ({ user, stats }: RecruiterDashboardProps) => {
  const companyName = user?.recruiterInfo?.companyName || user?.name || "Your Company";
  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  const isPremium = !!user?.isPremiumUser;
  const postedJobsCount = stats?.totalJobs || 0;
  const isQuotaExceeded = !isPremium && postedJobsCount >= 2;
  const recentApplications = stats?.recentApplications || [];
  const postedJobs = stats?.postedJobs || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. DYNAMIC RECRUITER TALENT COMMAND HERO BANNER             */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {firstName} 🎯
              </h1>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold"
              >
                Recruiter
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1 font-medium text-slate-700 dark:text-slate-300"
              >
                <Building2 className="h-3 w-3" />
                {companyName}
              </Badge>
              {isPremium ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold gap-1">
                  <Sparkles className="h-3 w-3" /> Enterprise Recruiter
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-slate-600 dark:text-slate-400 font-medium">
                  Free Tier
                </Badge>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Manage your engineering job postings, track applicant pipelines in real time, and hire qualified technical talent for {companyName}.
            </p>

            {/* Posting Quota Alert / Status Pill */}
            <div className="pt-1">
              {!isPremium ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/90 px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-2xs">
                  <span className="font-semibold">Active Postings:</span>
                  <span className={isQuotaExceeded ? "text-amber-600 font-bold" : "font-bold text-slate-900 dark:text-white"}>
                    {postedJobsCount} / 2 used
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <Link
                    href="/membership"
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Upgrade for Unlimited <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="h-3.5 w-3.5" /> Unlimited Job Postings Active
                </div>
              )}
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <PostNewJob
              user={user}
              jobList={new Array(postedJobsCount)}
              trigger={
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Post a Job
                </Button>
              }
            />
            <Link href="/jobs">
              <Button variant="outline" className="gap-2 font-semibold border-slate-300 dark:border-slate-700">
                <Briefcase className="h-4 w-4" />
                Manage Openings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. COLOR-CODED METRIC CARDS                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Postings */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Postings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalJobs || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Live job listings
            </p>
          </div>
        </div>

        {/* Total Candidates */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Candidates
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats?.totalApplications || 0}
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Candidate submissions
            </p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Review
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats?.pending || 0}
            </p>
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80 font-medium">
              Awaiting your review
            </p>
          </div>
        </div>

        {/* Selected / Hired */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Selected / Hired
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {stats?.selected || 0}
            </p>
            <p className="mt-1 text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">
              Offers extended 🎉
            </p>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. QUICK RECRUITER ACTION SHORTCUTS                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Shortcut 1: Post New Job */}
        <PostNewJob
          user={user}
          jobList={new Array(postedJobsCount)}
          trigger={
            <div className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer h-full flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Post a New Role
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Specify tech stacks, salary expectations, and requirements to reach top engineering talent.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Create Posting <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          }
        />

        {/* Shortcut 2: Candidate Pipeline */}
        <Link
          href="/jobs"
          className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Candidate Pipeline
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Review applicant resumes, assess candidate qualifications, and progress applicants to next stages.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
            Manage Pipeline <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Shortcut 3: Enterprise Membership */}
        <Link
          href="/membership"
          className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Hiring Perks & Plans
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Unlock unlimited job postings, priority candidate matching, and enterprise recruitment features.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
            Explore Plans <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MAIN CONTENT TWO-COLUMN LAYOUT                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Recent Candidate Applications (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recent Submissions
              </h2>
              <Badge variant="secondary" className="font-semibold text-xs">
                {recentApplications.length} recent
              </Badge>
            </div>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              All in Jobs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {recentApplications.length === 0 ? (
              <div className="py-14 px-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    No candidate applications yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    When qualified candidates apply to your posted openings, their applications and profiles will appear here for review.
                  </p>
                </div>
                <div className="pt-2">
                  <PostNewJob
                    user={user}
                    jobList={new Array(postedJobsCount)}
                    trigger={
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                        <Plus className="h-4 w-4 mr-1.5" /> Post Your First Job
                      </Button>
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      {/* Candidate Initials Monogram */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 font-bold text-sm shadow-2xs">
                        {getInitials(app.name)}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {app.name}
                          </p>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {app.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Applied for:
                          </span>
                          <span className="truncate max-w-[200px] text-emerald-700 dark:text-emerald-400 font-medium">
                            {app.job?.title || "Active Position"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Status badge, Date, and Review CTA */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-left sm:text-right">
                        {renderStatusBadge(app.status)}
                        <p
                          className="mt-1 text-[11px] text-slate-400 dark:text-slate-500"
                          suppressHydrationWarning
                        >
                          {formatUtcDate(app.jobApplicationDate)}
                        </p>
                      </div>

                      <Link href="/jobs">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 px-2.5 h-8 gap-1"
                        >
                          Review <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Openings Spotlight & Hiring Tips (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Job Openings Spotlight */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Your Openings
                </h2>
                <Badge variant="secondary" className="font-semibold text-xs">
                  {postedJobsCount} active
                </Badge>
              </div>
              <Link
                href="/jobs"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Manage all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {postedJobs.length === 0 ? (
                <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-sm space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    No active job postings
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Start publishing technical roles to attract engineers from our talent network.
                  </p>
                  <PostNewJob
                    user={user}
                    jobList={new Array(postedJobsCount)}
                    trigger={
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                        <Plus className="h-3.5 w-3.5 mr-1" /> Post a Job
                      </Button>
                    }
                  />
                </div>
              ) : (
                postedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {job.type}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs shrink-0"
                      >
                        {job.applicantCount || 0} applicants
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Exp: {job.experience} yrs
                      </span>
                      <Link
                        href="/jobs"
                        className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        View Applicants <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Hiring Pro Tips Card */}
          <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-slate-900 dark:to-slate-950 p-5 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <TrendingUp className="h-4 w-4" /> Hiring Acceleration Tip
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Listings specifying exact tech stacks and transparent salary expectations receive up to <strong>2.4x more qualified candidates</strong>. Keep your application statuses updated to boost candidate engagement!
            </p>
            {stats && stats.pending > 0 && (
              <div className="pt-2">
                <Link href="/jobs">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                    <Clock className="h-3.5 w-3.5" />
                    You have {stats.pending} candidate(s) awaiting your review →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
