import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Users,
  FileText,
  PlusCircle,
  TrendingUp,
  Zap,
  Check,
  UserCheck,
} from "lucide-react";
import { AppUser, JobApplication } from "types";

export interface FeaturedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  skills: string;
}

export interface CandidateStats {
  total: number;
  selected: number;
  rejected: number;
  applied: number;
  recentApplications: JobApplication[];
}

export interface RecruiterStats {
  totalJobs: number;
  totalApplications: number;
  selected: number;
  rejected: number;
  pending: number;
  recentApplications: JobApplication[];
}

export interface LandingPageProps {
  user: AppUser | null;
  profileInfo: string | undefined;
  featuredJobs: FeaturedJob[];
  totalJobsCount: number;
  candidateStats: CandidateStats | null;
  recruiterStats: RecruiterStats | null;
}

const TRUSTED_COMPANIES = [
  "Google",
  "Stripe",
  "Meta",
  "Netflix",
  "Apple",
  "Vercel",
  "OpenAI",
  "Airbnb",
  "Linear",
  "Spotify",
  "GitHub",
  "Figma",
];

export const LandingPage = ({
  user,
  profileInfo,
  featuredJobs,
  totalJobsCount,
  candidateStats,
  recruiterStats,
}: LandingPageProps) => {
  const isCandidate = user && profileInfo === "Candidate";
  const isRecruiter = user && profileInfo === "Recruiter";

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 1: CANDIDATE CAREER DASHBOARD
  // ──────────────────────────────────────────────────────────────────────────
  if (isCandidate) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Welcome Header */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.name?.split(" ")[0] || "there"} 👋
                </h1>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  Candidate
                </Badge>
                {user.isPremiumUser && (
                  <Badge className="bg-amber-500 text-white gap-1 hover:bg-amber-600">
                    <Sparkles className="h-3 w-3" /> Premium
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Track your active job applications and discover newly posted engineering opportunities.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/jobs">
                <Button className="gap-2">
                  <Briefcase className="h-4 w-4" /> Explore Jobs
                </Button>
              </Link>
              <Link href="/activity">
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" /> Your Activity
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Application Analytics */}
        {candidateStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Total Applied</span>
                <Briefcase className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {candidateStats.total}
              </p>
              <p className="mt-1 text-xs text-gray-400">Applications submitted</p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Under Review</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {candidateStats.applied}
              </p>
              <p className="mt-1 text-xs text-gray-400">Awaiting recruiter review</p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Selected</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {candidateStats.selected}
              </p>
              <p className="mt-1 text-xs text-gray-400">Successful matches 🎉</p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Live Openings</span>
                <TrendingUp className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {totalJobsCount}
              </p>
              <p className="mt-1 text-xs text-gray-400">Roles open for application</p>
            </div>
          </div>
        )}

        {/* Quick Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/jobs"
            className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2.5 text-blue-600 dark:text-blue-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Search 19+ Jobs
                </p>
                <p className="text-xs text-gray-400">Filter by location, role & skills</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
          </Link>

          <Link
            href="/account"
            className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-2.5 text-emerald-600 dark:text-emerald-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Resume & Profile
                </p>
                <p className="text-xs text-gray-400">Keep your details up to date</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
          </Link>

          <Link
            href="/membership"
            className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-amber-500 dark:hover:border-amber-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-2.5 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  Membership Perks
                </p>
                <p className="text-xs text-gray-400">Unlock unlimited job applications</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
          </Link>
        </div>

        {/* Recommended Jobs Spotlight */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                New Opportunities for You
              </h2>
              <p className="text-xs text-gray-400">Recently posted positions from verified tech companies</p>
            </div>
            <Link href="/jobs" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all {totalJobsCount} jobs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {job.companyName}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-medium">
                      {job.type}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span>·</span>
                    <span>{job.experience}</span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {job.skills.split(",").slice(0, 2).map((skill, i) => (
                      <span key={i} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  <Link href="/jobs">
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600 dark:text-blue-400 gap-1 px-2">
                      Apply <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 2: RECRUITER TALENT COMMAND HUB
  // ──────────────────────────────────────────────────────────────────────────
  if (isRecruiter) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Welcome Header */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/30 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-950 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {user.name?.split(" ")[0] || "Recruiter"} 👋
                </h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                  Recruiter
                </Badge>
                {user.isPremiumUser && (
                  <Badge className="bg-amber-500 text-white gap-1 hover:bg-amber-600">
                    <Sparkles className="h-3 w-3" /> Enterprise
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your job postings, monitor candidate applications, and build your technical pipeline.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/jobs">
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <PlusCircle className="h-4 w-4" /> Post a Job
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" /> Review Pipeline
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Recruitment Analytics */}
        {recruiterStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Active Jobs</span>
                <Building2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {recruiterStats.totalJobs}
              </p>
              <p className="mt-1 text-xs text-gray-400">Positions published by you</p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Applicants</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-gray-900 dark:text-white">
                {recruiterStats.totalApplications}
              </p>
              <p className="mt-1 text-xs text-gray-400">Total candidates applied</p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Pending Review</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {recruiterStats.pending}
              </p>
              <p className="mt-1 text-xs text-gray-400">Awaiting your evaluation</p>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                <span>Selected</span>
                <CheckCircle2 className="h-4 w-4 text-indigo-500" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {recruiterStats.selected}
              </p>
              <p className="mt-1 text-xs text-gray-400">Offers extended</p>
            </div>
          </div>
        )}

        {/* Recruiter Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/jobs"
            className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-2.5 text-emerald-600 dark:text-emerald-400">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  Post New Opening
                </p>
                <p className="text-xs text-gray-400">Target top engineers worldwide</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
          </Link>

          <Link
            href="/dashboard"
            className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-2.5 text-blue-600 dark:text-blue-400">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Candidate Pipeline
                </p>
                <p className="text-xs text-gray-400">Review resumes & statuses</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
          </Link>

          <Link
            href="/membership"
            className="group flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-amber-500 dark:hover:border-amber-500 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-2.5 text-amber-600 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  Recruiter Quota
                </p>
                <p className="text-xs text-gray-400">Unlock unlimited job postings</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-all" />
          </Link>
        </div>

        {/* Live Marketplace Preview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Live Engineering Marketplace
              </h2>
              <p className="text-xs text-gray-400">See current positions posted across the HireHub community</p>
            </div>
            <Link href="/jobs" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Browse all jobs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {job.companyName}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-medium">
                      {job.type}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span>·</span>
                    <span>{job.experience}</span>
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {job.skills.split(",").slice(0, 2).map((skill, i) => (
                      <span key={i} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  <Link href="/jobs">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 px-2">
                      Manage <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW 3: GUEST / UNAUTHENTICATED VISITOR LANDING PAGE
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-blue-50/40 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:gap-14">
            {/* Hero Left Copy */}
            <div className="flex w-full flex-col lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 w-fit">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Tech Hiring Platform</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
                Where Top Engineers Meet Visionary Teams.
              </h1>

              <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                Discover high-impact roles at innovative companies, or recruit pre-screened technical talent in record time with full application transparency.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
                    <Briefcase className="h-4 w-4" /> Explore {totalJobsCount > 0 ? `${totalJobsCount}+ ` : ""}Jobs
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 font-semibold border-gray-300 dark:border-gray-700">
                    <PlusCircle className="h-4 w-4" /> Post a Role
                  </Button>
                </Link>
              </div>

              {/* Quick Tags */}
              <div className="mt-8 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-medium">Popular:</span>
                {["Remote", "React", "Go", "Python", "Full Time", "DevOps"].map((tag) => (
                  <Link key={tag} href="/jobs">
                    <span className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Hero Right Graphic */}
            <div className="flex w-full justify-center lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 blur-2xl dark:from-blue-600/10 dark:to-indigo-600/10"></div>
                <Image
                  height={600}
                  width={600}
                  quality={95}
                  priority={true}
                  src="/images/HireHubLandingPageImage.png"
                  alt="HireHub Platform Preview"
                  className="relative z-10 h-auto max-h-[460px] w-full max-w-md lg:max-w-lg object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED COMPANIES BAR */}
      <section className="w-full py-10 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
            Trusted by hiring engineering teams across innovative tech companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {TRUSTED_COMPANIES.map((company) => (
              <span
                key={company}
                className="text-base sm:text-lg font-bold tracking-tight text-gray-400 dark:text-gray-600 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LIVE FEATURED JOBS SPOTLIGHT */}
      <section className="w-full py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              <Zap className="h-3 w-3" /> Live Job Openings
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Tech Opportunities
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Hand-picked engineering and product roles from verified employers.
            </p>
          </div>
          <Link href="/jobs">
            <Button variant="outline" className="gap-2 font-medium">
              View All {totalJobsCount} Jobs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {job.companyName}
                  </span>
                  <Badge variant="secondary" className="text-xs font-medium">
                    {job.type}
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                  <span>·</span>
                  <span>{job.experience}</span>
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {job.skills.split(",").slice(0, 2).map((skill, i) => (
                    <span key={i} className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
                <Link href="/jobs">
                  <Button size="sm" className="h-8 text-xs font-semibold gap-1">
                    Apply <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW HIREHUB WORKS (DUAL TRACK) */}
      <section className="w-full py-16 sm:py-20 bg-gray-50/70 dark:bg-gray-900/30 border-y border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Designed for Both Sides of Tech Hiring
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Whether you are advancing your software engineering career or scaling your team, HireHub keeps it fast and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Candidates */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 p-3 text-blue-600 dark:text-blue-400 mb-5">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                For Job Seekers
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Take the guesswork out of applying with complete status visibility and direct employer connections.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "1-Click apply with your verified profile & uploaded resume",
                  "Live application tracking (Applied → Under Review → Selected)",
                  "Automatic email notifications on every recruiter status update",
                  "Secure time-limited resume storage protecting your personal PII",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    Create Candidate Profile <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Recruiters */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-3 text-emerald-600 dark:text-emerald-400 mb-5">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                For Recruiters & Founders
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Publish openings to a high-intent technical talent pool and manage applications with zero friction.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Post detailed job specifications in under 2 minutes",
                  "Comprehensive applicant review modal with candidate skill tags",
                  "1-Click candidate selection and rejection with automated email alerts",
                  "Fair freemium quotas with instant Stripe subscription upgrades",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/register">
                  <Button variant="outline" className="w-full sm:w-auto gap-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
                    Post a Position <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM METRICS */}
      <section className="w-full py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800">
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                {totalJobsCount}+
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Tech Roles
              </p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
                500+
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                Hiring Companies
              </p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                &lt; 24h
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                Review Turnaround
              </p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-amber-500 tracking-tight">
                99%
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                Application Delivery Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="w-full pb-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-center text-white shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Career or Build Your Team?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Join thousands of developers and tech recruiters building the future of software on HireHub today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold shadow-md w-full sm:w-auto">
                Get Started for Free
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 font-medium w-full sm:w-auto">
                Browse Open Roles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
